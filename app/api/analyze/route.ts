import { NextRequest, NextResponse } from "next/server";

// Stub for Claude Vision API integration.
// Replace the body of this handler with real Anthropic API calls.
//
// Example with @anthropic-ai/sdk:
//
//   import Anthropic from "@anthropic-ai/sdk";
//   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
//
//   const message = await client.messages.create({
//     model: "claude-opus-4-5",
//     max_tokens: 1024,
//     messages: [{
//       role: "user",
//       content: [
//         { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64Data } },
//         { type: "text", text: "Rate this outfit 0-100 on style, fit, color, and trend. Return JSON." }
//       ]
//     }]
//   });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageDataUrl, fileName } = body as {
      imageDataUrl: string;
      fileName: string;
    };

    if (!imageDataUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // --- STUB RESPONSE ---
    // Replace this with actual Claude Vision API call using the imageDataUrl.
    // The imageDataUrl is a base64-encoded data URL: "data:image/jpeg;base64,..."
    // Strip the prefix to get the raw base64: imageDataUrl.split(",")[1]
    console.log(`Received fit check request for: ${fileName}`);

    // Simulate processing delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Placeholder scores — swap with Claude's actual response
    const scores = {
      overall: Math.floor(Math.random() * 20) + 75, // 75–95
      style: Math.floor(Math.random() * 25) + 70,
      fit: Math.floor(Math.random() * 25) + 68,
      color: Math.floor(Math.random() * 20) + 75,
      trend: Math.floor(Math.random() * 30) + 65,
      verdict:
        "Strong color coordination and confident silhouette. The layering adds depth without overwhelming the look.",
      tip: "Consider adding a statement accessory or swapping the shoes for something with more contrast to elevate the overall fit.",
    };

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
