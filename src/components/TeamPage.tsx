"use client";

import { TeamSection } from "@/data/album";
import { teamColors } from "@/data/teamColors";
import { teamFlags } from "@/data/teamFlags";
import { StickerCard } from "./StickerCard";

interface TeamPageProps {
  team: TeamSection;
  getQuantity: (code: string) => number;
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
  onCameraClick?: (code: string) => void;
  onImageClick?: (code: string) => void;
  onInfoClick?: (code: string) => void;
  getImage?: (code: string) => string | null;
  ownedCount: number;
}

export function TeamPage({ team, getQuantity, onAdd, onRemove, onCameraClick, onImageClick, onInfoClick, getImage, ownedCount }: TeamPageProps) {
  const total = team.stickers.length;
  const percentage = Math.round((ownedCount / total) * 100);
  const isComplete = ownedCount === total;
  const colors = teamColors[team.code] || { primary: "#1A237E", secondary: "#FFFFFF", accent: "#C62828" };

  return (
    <div className="album-section">
      <div
        className="rounded-2xl overflow-hidden shadow-xl"
        style={{
          background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.primary}cc 100%)`,
        }}
      >
        {/* Team header - text always white for readability */}
        <div className="px-5 pt-5 pb-3 relative overflow-hidden">
          {/* Decorative "26" watermark */}
          <div className="absolute -right-3 -top-3 text-[90px] font-black leading-none opacity-[0.07] text-white select-none pointer-events-none">
            26
          </div>

          {/* Secondary color decorative bar on left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{ backgroundColor: colors.secondary }}
          />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                We Are
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-3xl">{teamFlags[team.code] || "🏳️"}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-none text-white">
                  {team.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/20"
                >
                  Grupo {team.group}
                </span>
                <span className="text-[10px] font-medium text-white/50">
                  {team.code}
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              {isComplete && <span className="text-2xl">🏆</span>}
              <span className="text-lg font-black text-white">
                {ownedCount}<span className="text-white/50 text-xs font-medium">/{total}</span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-3 relative">
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-black/20">
              <div
                className="h-full rounded-full progress-fill"
                style={{
                  width: `${percentage}%`,
                  background: isComplete
                    ? "linear-gradient(90deg, #f5c842, #ffd700)"
                    : `linear-gradient(90deg, ${colors.secondary}, #ffffff)`,
                }}
              />
            </div>
            <span className="text-[11px] font-bold text-white/80">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Sticker grid - slightly darker area */}
        <div className="px-3 py-4" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
            {team.stickers.map((sticker) => (
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
                teamColor={colors.primary}
              />
            ))}
          </div>
        </div>

        {/* Bottom flag-stripe bar */}
        <div className="flex h-1.5">
          <div className="flex-1" style={{ backgroundColor: colors.primary }} />
          <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
          <div className="flex-1" style={{ backgroundColor: colors.accent }} />
        </div>
      </div>
    </div>
  );
}
