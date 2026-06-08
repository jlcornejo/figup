"use client";

import { useRef, useCallback } from "react";
import { Sticker } from "@/data/album";

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onCameraClick?: () => void;
  onImageClick?: () => void;
  image?: string | null;
  teamColor?: string;
}

const LONG_PRESS_MS = 500;

export function StickerCard({ sticker, quantity, onAdd, onRemove, onCameraClick, onImageClick, image, teamColor }: StickerCardProps) {
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

  return (
    <div className="sticker-card relative select-none group">
      {/* Main sticker area — click to add */}
      <div
        className={`
          rounded-lg aspect-[3/4] flex flex-col items-center justify-center text-center overflow-hidden
          border-2 transition-all cursor-pointer
          ${owned
            ? duplicate
              ? "bg-white border-sticker-gold shadow-md shadow-yellow-400/20"
              : "bg-white border-sticker-green shadow-md shadow-green-400/20"
            : "border-dashed"
          }
        `}
        style={
          !owned
            ? {
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.3)",
              }
            : undefined
        }
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
        {owned && image ? (
          /* Has captured image */
          <div className="w-full h-full relative">
            <img
              src={image}
              alt={sticker.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 text-[7px] font-bold text-center py-0.5 bg-black/50 text-white">
              {sticker.name}
            </span>
          </div>
        ) : owned ? (
          /* Owned but no image */
          <>
            <div
              className="w-full flex-1 rounded flex items-center justify-center"
              style={{ backgroundColor: `${teamColor || "#4a69bd"}15` }}
            >
              <span className="text-base">
                {sticker.type === "foil" ? "✨" :
                 sticker.type === "stadium" ? "🏟️" :
                 sticker.type === "badge" ? "🛡️" :
                 sticker.type === "team_photo" ? "📸" :
                 sticker.type === "special" ? "⭐" : "⚽"}
              </span>
            </div>
            <span
              className="text-[7px] font-bold leading-tight truncate w-full px-0.5 py-0.5 text-center"
              style={{ color: teamColor || "#333" }}
            >
              {sticker.name}
            </span>
          </>
        ) : (
          /* Empty slot - show code + player name */
          <div className="flex flex-col items-center justify-center h-full px-0.5">
            <span className="text-[10px] font-bold text-white/50">
              {sticker.code}
            </span>
            {sticker.name !== "Emblem" && sticker.name !== "Team Photo" && (
              <span className="text-[7px] text-white/35 leading-tight text-center mt-0.5 line-clamp-2">
                {sticker.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons (visible on hover / always on mobile for owned) */}
      {owned && (
        <div className="absolute -bottom-1 left-0 right-0 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Minus button */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] font-bold flex items-center justify-center hover:bg-red-500 shadow-sm"
            title="Quitar"
          >
            −
          </button>
          {/* Zoom/view image */}
          {image && onImageClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onImageClick(); }}
              className="w-5 h-5 rounded-full bg-white/80 text-black text-[9px] flex items-center justify-center hover:bg-white shadow-sm"
              title="Ver imagen"
            >
              🔍
            </button>
          )}
          {/* Camera */}
          {onCameraClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onCameraClick(); }}
              className="w-5 h-5 rounded-full bg-blue-500/80 text-white text-[9px] flex items-center justify-center hover:bg-blue-500 shadow-sm"
              title="Capturar foto"
            >
              📷
            </button>
          )}
          {/* Plus button */}
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="w-5 h-5 rounded-full bg-sticker-green/80 text-white text-[10px] font-bold flex items-center justify-center hover:bg-sticker-green shadow-sm"
            title="Sumar repetida"
          >
            +
          </button>
        </div>
      )}

      {/* Quantity badge */}
      {quantity > 1 && (
        <div className="absolute -top-1.5 -right-1.5 bg-sticker-gold text-black text-[9px] font-black rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
          {quantity}
        </div>
      )}

      {/* Owned checkmark */}
      {owned && !duplicate && (
        <div className="absolute -top-1 -right-1 bg-sticker-green text-white text-[7px] font-bold rounded-full w-[14px] h-[14px] flex items-center justify-center">
          ✓
        </div>
      )}
    </div>
  );
}
