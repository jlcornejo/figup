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
    <header className="sticky top-0 z-50 header-gradient">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <img
                src="/icon-192.png"
                alt="FigUp"
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-tight tracking-tight">
                <span className="gradient-text">Fig</span><span className="text-white">Up</span>
              </h1>
              <p className="text-[10px] text-app-text-muted leading-tight font-medium tracking-wider uppercase">
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
                  <span className="text-2xl font-black gradient-text">{totalOwned}</span>
                  <span className="text-xs text-app-text-muted font-medium">/ {totalStickers}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2.5 bg-white/5 rounded-full w-28 overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: "linear-gradient(90deg, #7b2ff7, #e01e37, #f77f00, #38b000)",
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-wc-lime">{percentage}%</span>
                </div>
              </div>
              {totalDuplicates > 0 && (
                <div className="border-l border-white/10 pl-3">
                  <span className="text-[10px] text-app-text-muted uppercase tracking-wider">Repes</span>
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
