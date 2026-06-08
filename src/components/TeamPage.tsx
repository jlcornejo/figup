"use client";

import { TeamSection } from "@/data/album";
import { StickerCard } from "./StickerCard";

interface TeamPageProps {
  team: TeamSection;
  getQuantity: (code: string) => number;
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
  ownedCount: number;
}

export function TeamPage({ team, getQuantity, onAdd, onRemove, ownedCount }: TeamPageProps) {
  const total = team.stickers.length;
  const percentage = Math.round((ownedCount / total) * 100);
  const isComplete = ownedCount === total;

  return (
    <div className="album-section">
      {/* Team header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-panini-purple/30 flex items-center justify-center text-[10px] font-bold">
            {team.code}
          </div>
          <div>
            <h3 className="text-sm font-bold">{team.name}</h3>
            <span className="text-[10px] text-panini-text-muted">Grupo {team.group}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 bg-panini-dark rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full progress-fill ${
                isComplete
                  ? "bg-gradient-to-r from-panini-gold to-panini-lime"
                  : "bg-gradient-to-r from-panini-turquoise to-panini-lime"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-panini-text-muted">
            {ownedCount}/{total}
          </span>
          {isComplete && <span className="text-xs">🏆</span>}
        </div>
      </div>

      {/* Sticker grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1.5">
        {team.stickers.map((sticker) => (
          <StickerCard
            key={sticker.code}
            sticker={sticker}
            quantity={getQuantity(sticker.code)}
            onAdd={() => onAdd(sticker.code)}
            onRemove={() => onRemove(sticker.code)}
          />
        ))}
      </div>
    </div>
  );
}
