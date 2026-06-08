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
        className="rounded-3xl overflow-hidden relative team-mesh"
        style={{
          background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primary}dd 40%, ${colors.primary}99 100%)`,
          boxShadow: `0 20px 60px ${colors.primary}40, 0 0 0 1px rgba(255,255,255,0.1) inset`,
        }}
      >
        {/* Decorative colored orbs */}
        <div
          className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: colors.secondary }}
        />
        <div
          className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full opacity-15 blur-2xl"
          style={{ backgroundColor: colors.accent }}
        />

        {/* Team header */}
        <div className="px-5 pt-5 pb-3 relative overflow-hidden">
          {/* Decorative "26" watermark */}
          <div className="absolute -right-2 -top-4 text-[100px] font-black leading-none opacity-[0.06] text-white select-none pointer-events-none">
            26
          </div>

          {/* Accent stripe on left */}
          <div
            className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
            style={{ background: `linear-gradient(180deg, ${colors.secondary}, ${colors.accent})` }}
          />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 ml-0.5">
                We Are
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-3xl drop-shadow-lg">{teamFlags[team.code] || "🏳️"}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-none text-white drop-shadow-sm">
                  {team.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${colors.secondary}20`,
                    borderColor: `${colors.secondary}40`,
                    color: colors.secondary,
                  }}
                >
                  Grupo {team.group}
                </span>
                <span className="text-[10px] font-medium text-white/40 tracking-wider">
                  {team.code}
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              {isComplete && <span className="text-3xl animate-bounce">🏆</span>}
              <span className="text-xl font-black text-white">
                {ownedCount}<span className="text-white/40 text-xs font-medium">/{total}</span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-3.5 relative">
            <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-black/30 border border-white/5">
              <div
                className="h-full rounded-full progress-fill"
                style={{
                  width: `${percentage}%`,
                  background: isComplete
                    ? "linear-gradient(90deg, #ffd60a, #ffc300, #ff6b6b)"
                    : `linear-gradient(90deg, ${colors.secondary}, ${colors.accent || '#fff'})`,
                  boxShadow: isComplete ? '0 0 12px rgba(255,214,10,0.5)' : undefined,
                }}
              />
            </div>
            <span className="text-[11px] font-bold text-white/70">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Sticker grid */}
        <div className="px-3 py-4 relative" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
          {/* Subtle diagonal lines pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)`,
            }}
          />
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 relative">
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

        {/* Bottom gradient stripe */}
        <div className="flex h-1.5">
          <div className="flex-1" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }} />
          <div className="flex-1" style={{ background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent})` }} />
          <div className="flex-1" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})` }} />
        </div>
      </div>
    </div>
  );
}
