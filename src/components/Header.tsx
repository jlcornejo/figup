"use client";

import { ReactNode } from "react";

interface HeaderProps {
  totalOwned: number;
  totalStickers: number;
  totalDuplicates: number;
  userSlot?: ReactNode;
}

export function Header({ totalOwned, totalStickers, totalDuplicates, userSlot }: HeaderProps) {
  const percentage = Math.round((totalOwned / totalStickers) * 100);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-app-bg/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-wc-red opacity-80" />
                <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-wc-green opacity-80" />
                <div className="absolute bottom-0 left-0 w-5 h-5 rounded-full bg-wc-skyblue opacity-80" />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-wc-orange opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-black drop-shadow-md">26</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight tracking-tight">
                <span className="text-wc-lime">Fig</span><span className="text-white">Up</span>
              </h1>
              <p className="text-[10px] text-app-text-muted leading-tight font-medium">
                FIFA World Cup 2026™
              </p>
            </div>
          </div>

          {/* Right side: stats + user */}
          <div className="flex items-center gap-3">
            {/* Stats - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-wc-lime">{totalOwned}</span>
                  <span className="text-xs text-app-text-muted font-medium">/ {totalStickers}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-2.5 bg-white/10 rounded-full w-28 overflow-hidden">
                    <div
                      className="h-full rounded-full progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: "linear-gradient(90deg, #2ecc71, #f1c40f)",
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-wc-lime">{percentage}%</span>
                </div>
              </div>
              {totalDuplicates > 0 && (
                <div className="border-l border-white/15 pl-3">
                  <span className="text-[10px] text-app-text-muted">Repes</span>
                  <p className="text-sm font-black text-wc-gold-light">{totalDuplicates}</p>
                </div>
              )}
            </div>

            {/* User menu */}
            {userSlot}
          </div>
        </div>
      </div>
    </header>
  );
}
