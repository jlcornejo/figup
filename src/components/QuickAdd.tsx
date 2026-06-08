"use client";

import { useState, useRef, useEffect } from "react";
import { getAllStickerCodes } from "@/data/album";

interface QuickAddProps {
  onAdd: (code: string) => void;
  isOwned: (code: string) => boolean;
}

const allCodes = getAllStickerCodes();

export function QuickAdd({ onAdd, isOwned }: QuickAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [recentlyAdded, setRecentlyAdded] = useState<{ code: string; wasOwned: boolean }[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (input.length >= 2) {
      const upper = input.toUpperCase();
      const match = allCodes.find((c) => c.startsWith(upper) && c !== upper);
      setSuggestion(match || null);
    } else {
      setSuggestion(null);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = input.toUpperCase().trim();
    if (allCodes.includes(code)) {
      const wasOwned = isOwned(code);
      onAdd(code);
      setRecentlyAdded((prev) => [{ code, wasOwned }, ...prev].slice(0, 7));
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      setInput(suggestion);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 lg:bottom-6 right-4 z-40 bg-gradient-to-r from-album-orange to-album-red
          text-white rounded-full px-5 py-3 shadow-lg shadow-album-red/25
          hover:shadow-album-red/40 transition-all duration-200 flex items-center gap-2
          text-sm font-bold"
      >
        <span className="text-lg">📦</span>
        Abrir Sobre
      </button>
    );
  }

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 lg:right-6 z-40 bg-[#1e1b3a] border border-white/10 rounded-xl p-4 shadow-2xl w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <span>📦</span> Abrir Sobre
        </h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setRecentlyAdded([]);
          }}
          className="text-white/50 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <p className="text-[10px] text-white/50 mb-2">
        Escribí el código (ej: MEX5, ARG12, FWC3) y Enter. Tab para autocompletar.
      </p>

      <form onSubmit={handleSubmit} className="relative flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Código figurita..."
            className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm
              text-white placeholder:text-white/50 focus:outline-none focus:border-wc-teal
              uppercase"
          />
          {suggestion && (
            <span className="absolute left-3 top-2 text-sm text-white/50/30 pointer-events-none">
              {suggestion}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-album-green text-white font-bold px-3 py-2 rounded-lg text-sm
            hover:bg-album-green/80 transition-colors"
        >
          +
        </button>
      </form>

      {/* Recently added */}
      {recentlyAdded.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-white/50">Agregadas:</p>
          <div className="flex flex-wrap gap-1.5">
            {recentlyAdded.map((item, i) => (
              <span
                key={`${item.code}-${i}`}
                className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  item.wasOwned
                    ? "bg-album-gold/20 text-album-gold border border-album-gold/30"
                    : "bg-album-green/20 text-album-green border border-album-green/30"
                }`}
              >
                {item.code} {item.wasOwned ? "🔄" : "✓"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
