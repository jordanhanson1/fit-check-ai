import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCORING_PROMPT = `You are an expert fashion critic and stylist. Analyze this outfit photo and return a JSON score.

Rules:
- Score honestly — don't inflate scores
- If the image does NOT show a person/outfit, return an error
- "vibe" should be a 2-3 word fashion label (e.g. "Street Luxe", "Coastal Prep", "Dark Academia", "Clean Minimal")
- "grade" follows: S+ (95-100), S (90-94), A+ (87-89), A (83-86), A- (80-82), B+ (77-79), B (73-76), B- (70-72), C+ (67-69), C (63-66), C- (60-62), D (below 60)
- "feedback" should be 2-3 sentences, Gen Z tone, specific to the outfit
- "tips" should be 3 concrete, actionable improvement suggestions

Return ONLY valid JSON, no markdown, no explanation:
{
  "score": <integer 0-100>,
  "grade": "<letter grade>",
  "vibe": "<2-3 word vibe label>",
  "breakdown": {
    "style": <integer 0-100>,
    "fit": <integer 0-100>,
    "colorCoordination": <integer 0-100>,
    "occasionFit": <integer 0-100>
  },
  "feedback": "<2-3 sentence feedback>",
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageDataUrl, fileName } = body as {
      imageDataUrl: string;
      fileName?: string;
    };

    if (!imageDataUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Parse data URL: "data:<mediaType>;base64,<data>"
    const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const mediaType = matches[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    const base64Data = matches[2];

    console.log(`Scoring outfit: ${fileName ?? "unknown"} (${mediaType})`);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            { type: "text", text: SCORING_PROMPT },
          ],
        },
      ],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Claude sometimes wraps in code fences — strip them
      const cleaned = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(cleaned);
    }

    // Validate required fields
    if (
      typeof parsed.score !== "number" ||
      !parsed.grade ||
      !parsed.vibe ||
      !parsed.breakdown ||
      !parsed.feedback ||
      !Array.isArray(parsed.tips)
    ) {
      throw new Error("Incomplete response from Claude");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("score-outfit error:", error);

    if (error instanceof Error && error.message.includes("not an outfit")) {
      return NextResponse.json(
        { error: "That doesn't look like an outfit. Drop a fit pic!" },
        { status: 422 }
      );
    }

    return NextResponse.json({ error: "Analysis failed. Try again." }, { status: 500 });
  }
}
