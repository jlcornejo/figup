"use client";

import { useRef, useCallback } from "react";
import { Sticker } from "@/data/album";

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const LONG_PRESS_MS = 500;

export function StickerCard({ sticker, quantity, onAdd, onRemove }: StickerCardProps) {
  const owned = quantity > 0;
  const duplicate = quantity > 1;
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const startPress = useCallback(() => {
    didLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onRemove();
    }, LONG_PRESS_MS);
  }, [onRemove]);

  const endPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    onAdd();
  }, [onAdd]);

  const typeIcon = () => {
    switch (sticker.type) {
      case "foil":
        return "✨";
      case "stadium":
        return "🏟️";
      case "badge":
        return "🛡️";
      case "team_photo":
        return "📸";
      case "special":
        return "⭐";
      default:
        return "";
    }
  };

  return (
    <div
      className={`
        relative rounded-lg border transition-all duration-200 cursor-pointer select-none
        ${owned
          ? duplicate
            ? "bg-panini-card border-panini-gold/50 sticker-duplicate"
            : "bg-panini-card border-panini-turquoise/50 sticker-owned"
          : "bg-panini-dark border-panini-border hover:border-panini-text-muted"
        }
      `}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemove();
      }}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
    >
      {/* Sticker code */}
      <div className="px-2 py-1.5 flex items-center justify-between">
        <span
          className={`text-[11px] font-bold ${
            owned ? "text-panini-turquoise" : "text-panini-text-muted"
          }`}
        >
          {sticker.code}
        </span>
        {sticker.type !== "player" && (
          <span className="text-[10px]">{typeIcon()}</span>
        )}
      </div>

      {/* Quantity badge */}
      {quantity > 1 && (
        <div className="absolute -top-1.5 -right-1.5 bg-panini-gold text-panini-darker text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {quantity}
        </div>
      )}

      {/* Owned checkmark */}
      {owned && !duplicate && (
        <div className="absolute -top-1 -right-1 bg-panini-turquoise text-panini-darker text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          ✓
        </div>
      )}
    </div>
  );
}
