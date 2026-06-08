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
  const [wikiThumb, setWikiThumb] = useState<string | null>(null);

  // Fetch Wikipedia thumbnail for owned players without a captured photo
  useEffect(() => {
    if (!owned || image || sticker.type !== "player") return;
    if (sticker.name.length < 4) return;

    const name = sticker.name.replace(/ /g, "_");
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.thumbnail?.source) {
          setWikiThumb(data.thumbnail.source);
        } else {
          // Try with "(footballer)" suffix
          return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name + "_(footballer)")}`)
            .then((r) => r.ok ? r.json() : null)
            .then((d) => { if (d?.thumbnail?.source) setWikiThumb(d.thumbnail.source); });
        }
      })
      .catch(() => {});
  }, [owned, image, sticker.name, sticker.type]);

  const displayImage = image || wikiThumb;

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
        {owned && displayImage ? (
          <div className="w-full h-full relative">
            <img
              src={displayImage}
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

      {/* Action buttons */}
      {owned && (
        <div className="absolute -bottom-1 left-0 right-0 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
