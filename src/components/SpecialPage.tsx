"use client";

import { SpecialSection } from "@/data/album";
import { StickerCard } from "./StickerCard";

interface SpecialPageProps {
  section: SpecialSection;
  getQuantity: (code: string) => number;
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
  ownedCount: number;
}

export function SpecialPage({ section, getQuantity, onAdd, onRemove, ownedCount }: SpecialPageProps) {
  const total = section.stickers.length;
  const percentage = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
  const isComplete = ownedCount === total && total > 0;

  return (
    <div className="album-section">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-panini-magenta/30 flex items-center justify-center text-xs">
            ⭐
          </div>
          <h3 className="text-sm font-bold">{section.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 bg-panini-dark rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full progress-fill ${
                isComplete
                  ? "bg-gradient-to-r from-panini-gold to-panini-lime"
                  : "bg-gradient-to-r from-panini-magenta to-panini-coral"
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
        {section.stickers.map((sticker) => (
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
