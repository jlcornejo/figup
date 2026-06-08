"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "figup-sticker-images";

// Store images in localStorage (they're already compressed to ~200px jpeg)
function loadImages(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // corrupted or too large
  }
  return {};
}

function saveImages(images: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch {
    // storage might be full — silently fail
    console.warn("FigUp: localStorage full, cannot save sticker images");
  }
}

export function useStickerImages() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImages(loadImages());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveImages(images);
    }
  }, [images, isLoaded]);

  const setImage = useCallback((code: string, dataUrl: string) => {
    setImages((prev) => ({ ...prev, [code]: dataUrl }));
  }, []);

  const getImage = useCallback(
    (code: string): string | null => {
      return images[code] || null;
    },
    [images]
  );

  const removeImage = useCallback((code: string) => {
    setImages((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }, []);

  return { images, isLoaded, setImage, getImage, removeImage };
}
