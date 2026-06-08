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
  getImage?: (code: string) => string | null;
  ownedCount: number;
}

const sectionStyles: Record<string, { gradient: string; icon: string }> = {
  fwc: { gradient: "from-wc-blue via-wc-purple to-wc-blue", icon: "🏆" },
  "fwc-bottom": { gradient: "from-wc-teal via-wc-green to-wc-teal", icon: "🏟️" },
  "coca-cola": { gradient: "from-wc-red via-wc-coral to-wc-red", icon: "🥤" },
};

export function SpecialPage({ section, getQuantity, onAdd, onRemove, onCameraClick, onImageClick, getImage, ownedCount }: SpecialPageProps) {
  const total = section.stickers.length;
  const percentage = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
  const isComplete = ownedCount === total && total > 0;
  const style = sectionStyles[section.id] || sectionStyles.fwc;

  return (
    <div className="album-section">
      <div className={`rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r ${style.gradient}`}>
        {/* Header */}
        <div className="px-5 pt-4 pb-3 relative overflow-hidden">
          <div className="absolute -right-4 -top-6 text-[80px] font-black leading-none opacity-10 text-white select-none">
            26
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{style.icon}</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {section.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-20 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full progress-fill bg-white"
                  style={{ width: `${percentage}%`, opacity: isComplete ? 1 : 0.8 }}
                />
              </div>
              <span className="text-xs font-bold text-white/90">
                {ownedCount}/{total}
              </span>
              {isComplete && <span className="text-sm">🏆</span>}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="px-3 py-4 bg-black/15">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {section.stickers.map((sticker) => (
              <StickerCard
                key={sticker.code}
                sticker={sticker}
                quantity={getQuantity(sticker.code)}
                onAdd={() => onAdd(sticker.code)}
                onRemove={() => onRemove(sticker.code)}
                onCameraClick={onCameraClick ? () => onCameraClick(sticker.code) : undefined}
                onImageClick={onImageClick ? () => onImageClick(sticker.code) : undefined}
                image={getImage ? getImage(sticker.code) : null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
