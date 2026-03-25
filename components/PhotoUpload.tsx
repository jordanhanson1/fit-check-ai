"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  onImageSelected: (dataUrl: string, fileName: string) => void;
  isAnalyzing?: boolean;
}

export default function PhotoUpload({ onImageSelected, isAnalyzing = false }: PhotoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onImageSelected(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleClick = () => {
    if (!isAnalyzing) inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload photo"
      />

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label="Drop your photo here or tap to upload"
        className={`
          relative w-full min-h-[320px] sm:min-h-[400px] rounded-2xl
          flex flex-col items-center justify-center
          cursor-pointer select-none transition-all duration-300
          overflow-hidden
          ${isDragOver
            ? "drop-zone-active border-2 border-[#ff2d78] bg-[#ff2d78]/10"
            : "border-2 border-dashed border-white/20 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.06]"
          }
          ${isAnalyzing ? "pointer-events-none" : ""}
        `}
      >
        {/* Preview image */}
        {preview && (
          <div className="absolute inset-0">
            <Image
              src={preview}
              alt="Uploaded fit preview"
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          </div>
        )}

        {/* Analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0a0a0f]/80 backdrop-blur-sm">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff2d78] border-r-[#9b51e0] animate-spin" />
            </div>
            <p className="text-white font-bold text-lg tracking-wide animate-pulse">
              Analyzing your fit...
            </p>
            <p className="text-white/50 text-sm mt-1">AI is cooking rn 🔥</p>
          </div>
        )}

        {/* Drop zone content */}
        {!isAnalyzing && (
          <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
            {!preview ? (
              <>
                {/* Upload icon */}
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${isDragOver
                    ? "bg-[#ff2d78]/20 scale-110"
                    : "bg-white/5"
                  }
                `}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`transition-colors duration-300 ${isDragOver ? "text-[#ff2d78]" : "text-white/60"}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>

                <div>
                  <p className="text-white font-bold text-xl mb-1">
                    {isDragOver ? "Drop it!" : "Drop your fit here"}
                  </p>
                  <p className="text-white/50 text-sm">or</p>
                </div>

                {/* Tap to upload button */}
                <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white font-bold text-sm tracking-wide shadow-lg glow-pink">
                  Tap to Upload
                </div>

                <p className="text-white/30 text-xs">
                  JPG, PNG, WEBP · Max 10MB
                </p>
              </>
            ) : (
              <>
                <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white font-bold text-sm tracking-wide shadow-lg glow-pink">
                  Change Photo
                </div>
                <p className="text-white/50 text-xs">Tap to choose a different photo</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Skeleton shimmer loading state */}
      {isAnalyzing && (
        <div className="mt-4 space-y-3">
          {[80, 60, 70].map((width, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 rounded-full shimmer bg-white/10" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
