"use client";

import React, { createContext, useContext, useState } from "react";

interface ImageContextType {
  imageDataUrl: string | null;
  setImageDataUrl: (url: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
}

const ImageContext = createContext<ImageContextType>({
  imageDataUrl: null,
  setImageDataUrl: () => {},
  fileName: null,
  setFileName: () => {},
});

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ImageContext.Provider value={{ imageDataUrl, setImageDataUrl, fileName, setFileName }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImage() {
  return useContext(ImageContext);
}
