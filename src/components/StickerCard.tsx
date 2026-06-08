"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Sticker } from "@/data/album";

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onCameraClick?: () => void;
  onImageClick?: () => void;
  onInfoClick?: () => void;
  image?: string | null;
  teamColor?: string;
}

const LONG_PRESS_MS = 500;

export function StickerCard({ sticker, quantity, onAdd, onRemove, onCameraClick, onImageClick, onInfoClick, image, teamColor }: StickerCardProps) {
  const owned = quantity > 0;
  const duplicate = quantity > 1;
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close actions popup when clicking outside
  useEffect(() => {
    if (!showActions) return;
    const handleOutside = (e: PointerEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    // Small delay to avoid the same tap closing it immediately
    const timer = setTimeout(() => {
      document.addEventListener("pointerdown", handleOutside);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [showActions]);

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
    if (owned) {
      // On owned stickers, show actions popup (mobile-friendly)
      setShowActions(true);
    } else {
      // On empty stickers, add directly
      onAdd();
    }
  }, [onAdd, owned]);

  return (
    <div className="sticker-card relative select-none group">
      {/* Main sticker area */}
      <div
        className={`
          rounded-xl aspect-[3/4] flex flex-col items-center justify-center text-center overflow-hidden
          border transition-all cursor-pointer
          ${owned
            ? duplicate
              ? "bg-white border-sticker-gold/80 shadow-lg shadow-yellow-400/15"
              : "bg-white border-sticker-green/60 shadow-lg shadow-green-400/15"
            : "border-dashed border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.08]"
          }
          ${showActions && owned ? "ring-2 ring-wc-purple/60 scale-105" : ""}
        `}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          if (owned) setShowActions(true);
          else onRemove();
        }}
        onTouchStart={!owned ? startPress : undefined}
        onTouchEnd={!owned ? endPress : undefined}
        onTouchCancel={!owned ? endPress : undefined}
        onMouseDown={!owned ? startPress : undefined}
        onMouseUp={!owned ? endPress : undefined}
        onMouseLeave={!owned ? endPress : undefined}
      >
        {owned && image ? (
          <div className="w-full h-full relative">
            <img
              src={image}
              alt={sticker.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 text-[7px] font-bold text-center py-0.5 bg-black/60 text-white backdrop-blur-sm">
              {sticker.name}
            </span>
          </div>
        ) : owned ? (
          <>
            <div
              className="w-full flex-1 rounded-lg flex items-center justify-center"
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
          <div className="flex flex-col items-center justify-center h-full px-0.5">
            <span className="text-[10px] font-bold text-white/40">
              {sticker.code}
            </span>
            {sticker.name !== "Emblem" && sticker.name !== "Team Photo" && (
              <span className="text-[7px] text-white/25 leading-tight text-center mt-0.5 line-clamp-2">
                {sticker.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions popup — shown on tap (mobile) or hover (desktop) */}
      {showActions && owned && (
        <div
          ref={actionsRef}
          className="absolute z-50 -bottom-2 left-1/2 -translate-x-1/2 translate-y-full
            flex items-center gap-1 bg-[#1e1b3a] border border-white/15 rounded-xl px-2 py-1.5 shadow-xl shadow-black/40"
        >
          {/* Add more */}
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); setShowActions(false); }}
            className="w-7 h-7 rounded-full bg-wc-green/90 text-white text-xs font-bold flex items-center justify-center active:scale-90 transition-transform"
            title="Sumar"
          >
            +
          </button>
          {/* Remove */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); setShowActions(false); }}
            className="w-7 h-7 rounded-full bg-wc-red/90 text-white text-xs font-bold flex items-center justify-center active:scale-90 transition-transform"
            title="Quitar"
          >
            −
          </button>
          {/* Info */}
          {onInfoClick && sticker.type === "player" && (
            <button
              onClick={(e) => { e.stopPropagation(); onInfoClick(); setShowActions(false); }}
              className="w-7 h-7 rounded-full bg-wc-purple/90 text-white text-[10px] flex items-center justify-center active:scale-90 transition-transform"
              title="Info"
            >
              ℹ
            </button>
          )}
          {/* View image */}
          {image && onImageClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onImageClick(); setShowActions(false); }}
              className="w-7 h-7 rounded-full bg-white/80 text-black text-[10px] flex items-center justify-center active:scale-90 transition-transform"
              title="Ver"
            >
              🔍
            </button>
          )}
          {/* Camera */}
          {onCameraClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onCameraClick(); setShowActions(false); }}
              className="w-7 h-7 rounded-full bg-wc-teal/90 text-white text-[10px] flex items-center justify-center active:scale-90 transition-transform"
              title="Foto"
            >
              📷
            </button>
          )}
        </div>
      )}

      {/* Desktop hover buttons (hidden on touch devices) */}
      {owned && !showActions && (
        <div className="absolute -bottom-1 left-0 right-0 hidden sm:flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="w-5 h-5 rounded-full bg-wc-red/90 text-white text-[10px] font-bold flex items-center justify-center hover:bg-wc-red shadow-sm"
            title="Quitar"
          >
            −
          </button>
          {onInfoClick && sticker.type === "player" && (
            <button
              onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
              className="w-5 h-5 rounded-full bg-wc-purple/90 text-white text-[9px] flex items-center justify-center hover:bg-wc-purple shadow-sm"
              title="Info del jugador"
            >
              ℹ
            </button>
          )}
          {image && onImageClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onImageClick(); }}
              className="w-5 h-5 rounded-full bg-white/80 text-black text-[9px] flex items-center justify-center hover:bg-white shadow-sm"
              title="Ver imagen"
            >
              🔍
            </button>
          )}
          {onCameraClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onCameraClick(); }}
              className="w-5 h-5 rounded-full bg-wc-teal/90 text-white text-[9px] flex items-center justify-center hover:bg-wc-teal shadow-sm"
              title="Capturar foto"
            >
              📷
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="w-5 h-5 rounded-full bg-wc-green/90 text-white text-[10px] font-bold flex items-center justify-center hover:bg-wc-green shadow-sm"
            title="Sumar repetida"
          >
            +
          </button>
        </div>
      )}

      {/* Quantity badge */}
      {quantity > 1 && (
        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-wc-gold-light to-wc-gold text-black text-[9px] font-black rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-md shadow-yellow-500/30">
          {quantity}
        </div>
      )}

      {/* Owned checkmark */}
      {owned && !duplicate && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-wc-green to-wc-teal text-white text-[7px] font-bold rounded-full w-[14px] h-[14px] flex items-center justify-center shadow-sm">
          ✓
        </div>
      )}
    </div>
  );
}
