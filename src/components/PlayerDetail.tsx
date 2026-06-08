"use client";

import { useState, useEffect } from "react";
import playersData from "@/data/players-enriched.json";
import catalogData from "@/data/panini-wc-2026-catalog.json";

interface PlayerDetailProps {
  stickerCode: string;
  image?: string | null;
  onClose: () => void;
}

interface PlayerInfo {
  team_code: string;
  team_name: string;
  shirt_number: number;
  position: string;
  name: string;
  date_of_birth: string;
  age: number;
  caps: number;
  goals: number;
  club: string;
  club_country: string;
  is_captain: boolean;
}

function getPositionLabel(pos: string): string {
  switch (pos) {
    case "GK": return "Portero";
    case "DF": return "Defensa";
    case "MF": return "Mediocampista";
    case "FW": return "Delantero";
    default: return pos;
  }
}

function getPositionColor(pos: string): string {
  switch (pos) {
    case "GK": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "DF": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "MF": return "bg-green-500/20 text-green-300 border-green-500/30";
    case "FW": return "bg-red-500/20 text-red-300 border-red-500/30";
    default: return "bg-white/10 text-white/70 border-white/20";
  }
}

export function PlayerDetail({ stickerCode, image, onClose }: PlayerDetailProps) {
  // Match by name: find player in enriched data by comparing names
  const codeMatch = stickerCode.match(/^([A-Z]{2,3})(\d+)$/);
  const teamCode = codeMatch?.[1];
  const stickerNum = codeMatch ? parseInt(codeMatch[2]) : 0;

  // Get all players from this team
  const teamPlayers = teamCode
    ? (playersData.players as PlayerInfo[]).filter((p) => p.team_code === teamCode)
    : [];

  // Find by matching the sticker name (from catalog) against Wikipedia player names
  // Use fuzzy matching: normalize and compare last names
  function normalize(s: string): string {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Get the sticker's display name from the catalog
  const catalogEntry = catalogData.stickers.find((s: { code: string }) => s.code === stickerCode);
  const stickerName = catalogEntry?.name || "";

  let playerInfo: PlayerInfo | null = null;

  if (stickerName && stickerName !== "Emblem" && stickerName !== "Team Photo") {
    const normalizedStickerName = normalize(stickerName);
    // Try exact match first
    playerInfo = teamPlayers.find((p) => normalize(p.name) === normalizedStickerName) || null;
    // Try last-name match
    if (!playerInfo) {
      const stickerParts = normalizedStickerName.split(" ");
      playerInfo = teamPlayers.find((p) => {
        const playerParts = normalize(p.name).split(" ");
        return stickerParts.some((sp) => sp.length > 3 && playerParts.includes(sp));
      }) || null;
    }
  }

  if (!playerInfo || !teamCode || stickerNum < 2) {
    return null;
  }

  return (
    <PlayerDetailModal playerInfo={playerInfo} stickerCode={stickerCode} image={image} onClose={onClose} />
  );
}

function PlayerDetailModal({ playerInfo, stickerCode, image, onClose }: { playerInfo: PlayerInfo; stickerCode: string; image?: string | null; onClose: () => void }) {
  const [wikiImage, setWikiImage] = useState<string | null>(null);

  // Fetch Wikipedia image as fallback
  useEffect(() => {
    if (image) return; // Already have a captured image
    const playerName = playerInfo.name.replace(/ /g, "_");
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.thumbnail?.source) {
          setWikiImage(data.thumbnail.source);
        }
      })
      .catch(() => {}); // Silent fail
  }, [playerInfo.name, image]);

  const displayImage = image || wikiImage;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#1a1744] border border-white/10 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with position color */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Player image */}
              {displayImage && (
                <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-white/20 shrink-0">
                  <img src={displayImage} alt={playerInfo.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPositionColor(playerInfo.position)}`}>
                    {getPositionLabel(playerInfo.position)}
                  </span>
                  {playerInfo.is_captain && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      © Capitán
                    </span>
                  )}
                  <span className="text-white/40 text-xs">#{playerInfo.shirt_number}</span>
                </div>
                <h2 className="text-xl font-black text-white">{playerInfo.name}</h2>
                <p className="text-xs text-white/50 mt-0.5">{playerInfo.team_name} · {stickerCode}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white text-xl self-start">✕</button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 rounded-lg p-2.5 text-center">
              <p className="text-lg font-black text-white">{playerInfo.age}</p>
              <p className="text-[10px] text-white/40">Edad</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5 text-center">
              <p className="text-lg font-black text-white">{playerInfo.caps}</p>
              <p className="text-[10px] text-white/40">Partidos</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5 text-center">
              <p className="text-lg font-black text-white">{playerInfo.goals}</p>
              <p className="text-[10px] text-white/40">Goles</p>
            </div>
          </div>

          {/* Club info */}
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Club actual</p>
            <p className="text-sm font-bold text-white">{playerInfo.club}</p>
            <p className="text-xs text-white/50">{playerInfo.club_country}</p>
          </div>

          {/* Birth date */}
          <div className="mt-2 bg-white/5 rounded-lg p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
            <p className="text-sm text-white">{new Date(playerInfo.date_of_birth).toLocaleDateString("es", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 text-center">
          <p className="text-[9px] text-white/30">Fuente: Wikipedia · CC BY-SA 4.0</p>
        </div>
      </div>
    </div>
  );
}
