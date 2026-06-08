"use client";

import { useState } from "react";

interface SplashScreenProps {
  message?: string;
}

export function SplashScreen({ message = "Cargando..." }: SplashScreenProps) {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#1a1145]">
      {/* Video container — cropped to show center icon */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => setVideoEnded(true)}
        >
          <source src="/splash.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Loading text */}
      <p className="mt-6 text-sm text-white/50 animate-pulse">{message}</p>
    </div>
  );
}
