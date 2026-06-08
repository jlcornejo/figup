"use client";

import { SpecialSection } from "@/data/album";
import { StickerCard } from "./StickerCard";

interface SpecialPageProps {
  section: SpecialSection;
  getQuantity: (code: string) => number;
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
  onCameraClick?: (code: string) => void;
  onImageClick?: (code: string) => void;
  onInfoClick?: (code: string) => void;
  getImage?: (code: string) => string | null;
  ownedCount: number;
}

const sectionStyles: Record<string, { gradient: string; glow: string; icon: string; accent: string }> = {
  fwc: {
    gradient: "linear-gradient(135deg, #2d46b9 0%, #7b2ff7 50%, #2d46b9 100%)",
    glow: "0 20px 60px rgba(123, 47, 247, 0.3)",
    icon: "🏆",
    accent: "#7b2ff7",
  },
  "fwc-bottom": {
    gradient: "linear-gradient(135deg, #00c9db 0%, #38b000 50%, #00c9db 100%)",
    glow: "0 20px 60px rgba(0, 201, 219, 0.3)",
    icon: "🏟️",
    accent: "#00c9db",
  },
  "coca-cola": {
    gradient: "linear-gradient(135deg, #e01e37 0%, #f77f00 50%, #e01e37 100%)",
    glow: "0 20px 60px rgba(224, 30, 55, 0.3)",
    icon: "🥤",
    accent: "#e01e37",
  },
};

export function SpecialPage({ section, getQuantity, onAdd, onRemove, onCameraClick, onImageClick, onInfoClick, getImage, ownedCount }: SpecialPageProps) {
  const total = section.stickers.length;
  const percentage = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
  const isComplete = ownedCount === total && total > 0;
  const style = sectionStyles[section.id] || sectionStyles.fwc;

  return (
    <div className="album-section">
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: style.gradient,
          boxShadow: `${style.glow}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
        }}
      >
        {/* Decorative mesh */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)
            `,
          }}
        />
        {/* Floating orb */}
        <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="px-5 pt-5 pb-3 relative overflow-hidden">
          <div className="absolute -right-4 -top-6 text-[90px] font-black leading-none opacity-[0.06] text-white select-none pointer-events-none">
            26
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl drop-shadow-lg">{style.icon}</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight drop-shadow-sm">
                {section.name}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-24 bg-black/20 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full progress-fill"
                  style={{
                    width: `${percentage}%`,
                    background: isComplete
                      ? "linear-gradient(90deg, #ffd60a, #ffc300)"
                      : "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
                    boxShadow: isComplete ? '0 0 8px rgba(255,214,10,0.5)' : undefined,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-white/90">
                {ownedCount}/{total}
              </span>
              {isComplete && <span className="text-sm animate-bounce">🏆</span>}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="px-3 py-4 relative" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 relative">
            {section.stickers.map((sticker) => (
              <StickerCard
                key={sticker.code}
                sticker={sticker}
                quantity={getQuantity(sticker.code)}
                onAdd={() => onAdd(sticker.code)}
                onRemove={() => onRemove(sticker.code)}
                onCameraClick={onCameraClick ? () => onCameraClick(sticker.code) : undefined}
                onImageClick={onImageClick ? () => onImageClick(sticker.code) : undefined}
                onInfoClick={onInfoClick ? () => onInfoClick(sticker.code) : undefined}
                image={getImage ? getImage(sticker.code) : null}
              />
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)` }} />
      </div>
    </div>
  );
}
