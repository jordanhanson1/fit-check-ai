"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoUpload from "@/components/PhotoUpload";

/** Resize + re-encode a data URL to JPEG at max 1024px, quality 0.7 — keeps payload under Vercel's 4.5MB limit */
function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = dataUrl;
  });
}

type UsageInfo = { used: number; remaining: number; limit: number };

export default function HomePage() {
  const router = useRouter();
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data && typeof data.remaining === "number") setUsage(data); })
      .catch(() => {});
  }, []);

  const handleImageSelected = useCallback((dataUrl: string, name: string) => {
    setImageDataUrl(dataUrl);
    setFileName(name);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!imageDataUrl) {
      setError("Drop a photo first!");
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    try {
      const compressed = await compressImage(imageDataUrl);
      const response = await fetch("/api/score-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: compressed, fileName }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setError(data.message ?? "Weekly limit reached. Come back next Monday!");
        setIsAnalyzing(false);
        return;
      }
      if (!response.ok) throw new Error("Analysis failed");

      // Reuse already-compressed image for sessionStorage
      sessionStorage.setItem("fitcheck_image", compressed);
      sessionStorage.setItem("fitcheck_filename", fileName ?? "photo");

      const result = await response.json();
      sessionStorage.setItem("fitcheck_result", JSON.stringify(result));

      // Refresh usage count after a successful check
      fetch("/api/usage")
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data && typeof data.remaining === "number") setUsage(data); })
        .catch(() => {});

      router.push("/result");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again?");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ff2d78] animate-pulse" />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
            AI Powered
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-4">
          <span className="gradient-text">FIT CHECK</span>
        </h1>

        <p className="text-white/50 text-base sm:text-lg font-medium max-w-xs mx-auto">
          Drop your fit. Get your score. No cap.
        </p>

        {usage !== null && (
          <p className={`mt-3 text-xs font-semibold tracking-wide ${
            usage.remaining === 0
              ? "text-[#ff2d78]"
              : usage.remaining <= 3
              ? "text-yellow-400"
              : "text-white/40"
          }`}>
            {usage.remaining === 0
              ? "Weekly limit reached — resets Monday"
              : `${usage.remaining} of ${usage.limit} fit checks left this week`}
          </p>
        )}
      </header>

      {/* Upload section */}
      <section className="flex-1 px-5 pb-8 max-w-lg mx-auto w-full flex flex-col gap-5">
        {/* Inspiration link */}
        <Link
          href="/inspiration"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.07] transition-all text-sm font-semibold"
        >
          <span>✨</span>
          Browse Style Inspiration
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <PhotoUpload
          onImageSelected={handleImageSelected}
          isAnalyzing={isAnalyzing}
        />

        {/* Error message */}
        {error && (
          <p className="text-[#ff2d78] text-sm font-medium text-center">
            {error}
          </p>
        )}

        {/* Analyze CTA */}
        <button
          onClick={handleAnalyze}
          disabled={!imageDataUrl || isAnalyzing}
          className={`
            w-full py-4 px-8 rounded-2xl font-black text-lg tracking-wide
            transition-all duration-300 relative overflow-hidden
            ${imageDataUrl && !isAnalyzing
              ? "bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white shadow-xl glow-pink active:scale-95"
              : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"
            }
          `}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Cooking...
            </span>
          ) : (
            "Rate My Fit \u2192"
          )}
        </button>

        {/* How it works */}
        <div className="mt-2 grid grid-cols-3 gap-3">
          {[
            { icon: "📸", label: "Upload Fit" },
            { icon: "🤖", label: "AI Analyzes" },
            { icon: "🏆", label: "Get Score" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-white/40 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
