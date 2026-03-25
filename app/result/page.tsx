"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FitScore {
  score: number;
  grade: string;
  vibe: string;
  breakdown: {
    style: number;
    fit: number;
    colorCoordination: number;
    occasionFit: number;
  };
  feedback: string;
  tips: string[];
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-white/60 text-sm font-medium">{label}</span>
        <span className="text-white font-black">{score}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 54;
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference - (score / 100) * circumference), 300);
    return () => clearTimeout(t);
  }, [score, circumference]);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2d78" />
            <stop offset="50%" stopColor="#9b51e0" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black gradient-text">{score}</span>
        <span className="text-white/40 text-xs font-medium">/100</span>
      </div>
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-white font-bold text-sm">{grade}</span>
      </div>
    </div>
  );
}


export default function ResultPage() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [scores, setScores] = useState<FitScore | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const img = sessionStorage.getItem("fitcheck_image");
    const raw = sessionStorage.getItem("fitcheck_result");
    if (img) setImageDataUrl(img);
    if (raw) {
      try { setScores(JSON.parse(raw)); } catch { /* ignore */ }
    }
    if (!raw) {
      setScores({
        score: 84, grade: "A-", vibe: "Street Luxe",
        breakdown: { style: 88, fit: 79, colorCoordination: 91, occasionFit: 80 },
        feedback: "That fit is lowkey fire. The color coordination is doing heavy lifting.",
        tips: ["Layer a structured jacket to add definition", "Swap shoes for more contrast", "Add one statement accessory to elevate"],
      });
    }
  }, []);

  const handleShare = async () => {
    if (!scores) return;
    setSharing(true);
    try {
      const W = 800, H = 1000, IMG_H = 580;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, W, H);

      // Outfit image
      if (imageDataUrl) {
        const img = new window.Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = imageDataUrl;
        });
        // Cover-fit: center-crop to fill width
        const scale = Math.max(W / img.naturalWidth, IMG_H / img.naturalHeight);
        const sw = W / scale, sh = IMG_H / scale;
        const sx = (img.naturalWidth - sw) / 2, sy = (img.naturalHeight - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, IMG_H);
      }

      // Gradient fade image into background
      const fade = ctx.createLinearGradient(0, IMG_H * 0.45, 0, IMG_H);
      fade.addColorStop(0, "rgba(10,10,15,0)");
      fade.addColorStop(1, "rgba(10,10,15,1)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, W, IMG_H);

      // Score number
      ctx.font = "900 140px system-ui, -apple-system, sans-serif";
      const scoreGrad = ctx.createLinearGradient(60, 0, 260, 0);
      scoreGrad.addColorStop(0, "#ff2d78");
      scoreGrad.addColorStop(0.5, "#9b51e0");
      scoreGrad.addColorStop(1, "#00d4ff");
      ctx.fillStyle = scoreGrad;
      ctx.fillText(String(scores.score), 60, IMG_H - 20);

      // Grade
      ctx.font = "900 52px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(scores.grade, 60, IMG_H + 60);

      // Vibe
      ctx.font = "700 28px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#9b51e0";
      ctx.fillText(scores.vibe.toUpperCase(), 60, IMG_H + 106);

      // Divider
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, IMG_H + 130);
      ctx.lineTo(W - 60, IMG_H + 130);
      ctx.stroke();

      // Feedback snippet
      const words = scores.feedback.split(" ");
      const lines: string[] = [];
      let line = "";
      ctx.font = "400 26px system-ui, -apple-system, sans-serif";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > W - 120) { lines.push(line); line = word; }
        else line = test;
      }
      if (line) lines.push(line);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 60, IMG_H + 172 + i * 38));

      // Branding
      ctx.font = "500 22px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillText("fitcheck.ai  ·  Drop your fit →", 60, H - 40);

      const png = canvas.toDataURL("image/png");
      if (navigator.share) {
        const blob = await fetch(png).then((r) => r.blob());
        const file = new File([blob], "fitcheck.png", { type: "image/png" });
        await navigator.share({ files: [file], title: `My Fit Score: ${scores.score}/100 ${scores.grade}` });
      } else {
        const a = document.createElement("a");
        a.href = png; a.download = "fitcheck.png"; a.click();
      }
    } catch (err) {
      console.error("Share failed", err);
    } finally {
      setSharing(false);
    }
  };

  const breakdown = scores ? [
    { label: "Style", score: scores.breakdown.style, color: "linear-gradient(90deg,#ff2d78,#ff6b6b)" },
    { label: "Fit", score: scores.breakdown.fit, color: "linear-gradient(90deg,#9b51e0,#c084fc)" },
    { label: "Color", score: scores.breakdown.colorCoordination, color: "linear-gradient(90deg,#00d4ff,#38bdf8)" },
    { label: "Occasion", score: scores.breakdown.occasionFit, color: "linear-gradient(90deg,#f59e0b,#fbbf24)" },
  ] : [];

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <nav className="px-5 pt-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          New Check
        </Link>
        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">Results</span>
        <button onClick={handleShare} disabled={!scores || sharing} className="text-white/50 hover:text-white transition-colors text-sm font-medium disabled:opacity-30">
          {sharing ? "Saving..." : "Share"}
        </button>
      </nav>

      <div className="flex-1 px-5 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Photo + score ring */}
        <div className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10">
          {imageDataUrl ? (
            <div className="relative h-56 sm:h-72">
              <Image src={imageDataUrl} alt="Your fit" fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-56 sm:h-72 shimmer bg-white/5" />
          )}
          <div className="p-6 pt-12 relative -mt-12">
            <ScoreRing score={scores?.score ?? 0} grade={scores?.grade ?? ""} />
          </div>
          {scores && (
            <div className="pb-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: "linear-gradient(90deg,#ff2d78,#9b51e0)", color: "#fff" }}>
                {scores.vibe}
              </span>
            </div>
          )}
        </div>

        {/* Verdict + tips */}
        {scores && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
            <h2 className="text-white font-black text-xl">The Verdict</h2>
            <p className="text-white/70 text-sm leading-relaxed">{scores.feedback}</p>
            <div className="border-t border-white/5 pt-3 space-y-2">
              <p className="text-[#00d4ff] text-xs font-bold uppercase tracking-wider">3 Tips to Level Up</p>
              <ul className="space-y-1.5">
                {scores.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/50 text-xs leading-relaxed">
                    <span className="text-[#ff2d78] font-bold mt-0.5 shrink-0">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Breakdown bars */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-4">
          <h2 className="text-white font-black text-xl">Breakdown</h2>
          {scores ? (
            <div className="space-y-4">
              {breakdown.map((b) => <ScoreBar key={b.label} label={b.label} score={b.score} color={b.color} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {[80, 65, 70, 75].map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 shimmer bg-white/10 rounded" style={{ width: `${w}%` }} />
                  <div className="h-2 shimmer bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share CTA */}
        <button
          onClick={handleShare}
          disabled={!scores || sharing}
          className="w-full py-4 px-8 rounded-2xl font-black text-lg tracking-wide text-center
            bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white shadow-xl glow-pink
            transition-transform active:scale-95 disabled:opacity-50"
        >
          {sharing ? "Generating card..." : "Share Your Fit 🔥"}
        </button>

        <Link href="/" className="block w-full py-3 px-8 rounded-2xl font-bold text-base tracking-wide text-center bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-colors">
          Check Another Fit
        </Link>
      </div>
    </main>
  );
}
