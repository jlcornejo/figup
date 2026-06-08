"use client";

import playersData from "@/data/players-enriched.json";

interface PlayerDetailProps {
  stickerCode: string;
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

export function PlayerDetail({ stickerCode, onClose }: PlayerDetailProps) {
  // Find player in enriched data by matching name from sticker catalog
  const player = (playersData.players as PlayerInfo[]).find((p) => {
    // Match by team code + trying to find by name/position order
    const codeMatch = stickerCode.match(/^([A-Z]{2,3})(\d+)$/);
    if (!codeMatch) return false;
    const teamCode = codeMatch[1];
    return p.team_code === teamCode && p.name.length > 0;
  });

  // Better matching: find by team code and sticker number order
  const codeMatch = stickerCode.match(/^([A-Z]{2,3})(\d+)$/);
  const teamCode = codeMatch?.[1];
  const stickerNum = codeMatch ? parseInt(codeMatch[2]) : 0;

  // Get all players from this team sorted by shirt number
  const teamPlayers = teamCode
    ? (playersData.players as PlayerInfo[]).filter((p) => p.team_code === teamCode)
    : [];

  // The sticker number doesn't always match shirt number, but we can try
  // For now, find player whose name matches the panini catalog name
  // Since we can't easily match here, just show the team player at this index position
  const playerInfo = teamPlayers.length > 0 && stickerNum >= 2 && stickerNum <= teamPlayers.length + 1
    ? teamPlayers[stickerNum - 2] // offset: sticker 1 = emblem, sticker 2 = first player
    : null;

  if (!playerInfo || !teamCode || stickerNum < 2) {
    return null; // No data for emblems, team photos, or unmatched
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#1a1744] border border-white/10 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with position color */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
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
            <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
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
