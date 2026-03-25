# Fit Check AI

Drop your fit. Get your score. No cap.

AI-powered outfit rating app — upload a photo, get scored by Claude Vision, share your card.

## Stack

- **Next.js 14** (App Router)
- **Anthropic claude-sonnet-4-6** — vision scoring
- **Tailwind CSS** — dark mode, mobile-first
- **html-to-image** — shareable PNG card generation

## Setup

```bash
npm install
```

Create a `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set the `ANTHROPIC_API_KEY` environment variable in the Vercel dashboard (Settings → Environment Variables).

The `vercel.json` references `@anthropic-api-key` as a Vercel secret — create it with:

```bash
vercel env add ANTHROPIC_API_KEY
```

## API

### `POST /api/score-outfit`

```json
{ "imageDataUrl": "data:image/jpeg;base64,...", "fileName": "fit.jpg" }
```

Returns:
```json
{
  "score": 87,
  "grade": "A",
  "vibe": "Street Luxe",
  "breakdown": { "style": 90, "fit": 85, "colorCoordination": 88, "occasionFit": 82 },
  "feedback": "...",
  "tips": ["...", "...", "..."]
}
```
