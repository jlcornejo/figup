import catalogRaw from "./panini-wc-2026-catalog.json";

export interface Sticker {
  code: string;
  name: string;
  type: "player" | "team_photo" | "badge" | "stadium" | "special" | "foil";
}

export interface TeamSection {
  id: string;
  name: string;
  code: string;
  group: string;
  stickers: Sticker[];
}

export interface SpecialSection {
  id: string;
  name: string;
  stickers: Sticker[];
}

// Filter out European shiny variants (codes ending in "s") and regional CC codes
const standardStickers = catalogRaw.stickers.filter(
  (s) => !s.code.endsWith("s") && !s.code.startsWith("CC-")
);

// Determine sticker type from name/code
function getStickerType(code: string, name: string): Sticker["type"] {
  if (code.startsWith("FWC")) return "foil";
  if (code === "00") return "special";
  if (name === "Emblem") return "badge";
  if (name === "Team Photo") return "team_photo";
  if (name.includes("Stadium") || name.includes("Official")) return "special";
  return "player";
}

// Build team groupings from sticker codes
const teamCodes = new Set<string>();
standardStickers.forEach((s) => {
  const match = s.code.match(/^([A-Z]{2,3})\d+$/);
  if (match && !["FWC", "CC"].includes(match[1])) {
    teamCodes.add(match[1]);
  }
});

// Group assignments based on the official album order
const groupAssignments: Record<string, string> = {
  MEX: "A", RSA: "A", KOR: "A", CZE: "A",
  CAN: "E", BIH: "E", QAT: "E", SUI: "E",
  BRA: "F", MAR: "F", HAI: "F", NZL: "F",
  USA: "B", PAR: "B", AUS: "B", TUR: "B",
  GER: "J", CUW: "J", CIV: "J", GHA: "J",
  ECU: "G", FRA: "G", SEN: "G", IRQ: "G",
  NED: "K", SWE: "K", NOR: "K",
  JPN: "H", SCO: "H", COD: "H", ENG: "H", COL: "H",
  TUN: "I", ESP: "I", CPV: "I", UZB: "I",
  BEL: "L", EGY: "L", POR: "L", CRO: "L",
  IRN: "J",
  KSA: "C", URU: "C", JOR: "C", PAN: "C",
  ARG: "D", ALG: "D", AUT: "D",
};

// Team display names
const teamNames: Record<string, string> = {
  MEX: "México", RSA: "Sudáfrica", KOR: "Corea del Sur", CZE: "República Checa",
  CAN: "Canadá", BIH: "Bosnia y Herzegovina", QAT: "Catar", SUI: "Suiza",
  BRA: "Brasil", MAR: "Marruecos", HAI: "Haití", NZL: "Nueva Zelanda",
  USA: "Estados Unidos", PAR: "Paraguay", AUS: "Australia", TUR: "Turquía",
  GER: "Alemania", CUW: "Curazao", CIV: "Costa de Marfil", GHA: "Ghana",
  ECU: "Ecuador", FRA: "Francia", SEN: "Senegal", IRQ: "Irak",
  NED: "Países Bajos", SWE: "Suecia", NOR: "Noruega",
  JPN: "Japón", SCO: "Escocia", COD: "R.D. del Congo", ENG: "Inglaterra", COL: "Colombia",
  TUN: "Túnez", ESP: "España", CPV: "Cabo Verde", UZB: "Uzbekistán",
  BEL: "Bélgica", EGY: "Egipto", POR: "Portugal", CRO: "Croacia",
  IRN: "Irán",
  KSA: "Arabia Saudita", URU: "Uruguay", JOR: "Jordania", PAN: "Panamá",
  ARG: "Argentina", ALG: "Argelia", AUT: "Austria",
};

// Build album order (maintain catalog order)
const albumOrderTeams: string[] = [];
standardStickers.forEach((s) => {
  const match = s.code.match(/^([A-Z]{2,3})\d+$/);
  if (match && !["FWC", "CC"].includes(match[1])) {
    if (!albumOrderTeams.includes(match[1])) {
      albumOrderTeams.push(match[1]);
    }
  }
});

// Special sticker for "00" Panini Logo
const paniniLogo: Sticker = { code: "00", name: "Panini Logo", type: "special" };

// Opening section (FWC1-FWC8)
const openingSection: SpecialSection = {
  id: "fwc",
  name: "FIFA World Cup",
  stickers: standardStickers
    .filter((s) => s.code.startsWith("FWC") && parseInt(s.code.replace("FWC", "")) <= 8)
    .map((s) => ({ code: s.code, name: s.name, type: getStickerType(s.code, s.name) })),
};

// Add panini logo to opening
openingSection.stickers.unshift(paniniLogo);

// Team sections in album order
const teamSections: TeamSection[] = albumOrderTeams.map((teamCode) => {
  const teamStickers = standardStickers
    .filter((s) => {
      const match = s.code.match(/^([A-Z]{2,3})\d+$/);
      return match && match[1] === teamCode;
    })
    .map((s) => ({
      code: s.code,
      name: s.name,
      type: getStickerType(s.code, s.name),
    }));

  return {
    id: teamCode.toLowerCase(),
    name: teamNames[teamCode] || teamCode,
    code: teamCode,
    group: groupAssignments[teamCode] || "?",
    stickers: teamStickers,
  };
});

// FWC History section (FWC9-FWC19)
const fwcBottomSection: SpecialSection = {
  id: "fwc-bottom",
  name: "FIFA World Cup History",
  stickers: standardStickers
    .filter((s) => s.code.startsWith("FWC") && parseInt(s.code.replace("FWC", "")) >= 9)
    .map((s) => ({ code: s.code, name: s.name, type: "foil" as const })),
};

// Coca-Cola section (CC1-CC12, not CC-US/CC-UK regionals)
const cocaColaStickers = standardStickers
  .filter((s) => /^CC\d+$/.test(s.code))
  .map((s) => ({ code: s.code, name: s.name, type: "special" as const }));

const cocaColaSection: SpecialSection = {
  id: "coca-cola",
  name: "Coca-Cola Exclusivos",
  stickers: cocaColaStickers,
};

// Total count (excluding European shinies)
const totalStickers =
  openingSection.stickers.length +
  teamSections.reduce((sum, t) => sum + t.stickers.length, 0) +
  fwcBottomSection.stickers.length +
  cocaColaSection.stickers.length;

export const albumData = {
  totalStickers,
  packSize: 7,
  sections: {
    opening: openingSection,
    teams: teamSections,
    fwcBottom: fwcBottomSection,
    cocaCola: cocaColaSection,
  },
  groups: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
};

export function getAllStickerCodes(): string[] {
  return [
    ...openingSection.stickers.map((s) => s.code),
    ...teamSections.flatMap((t) => t.stickers.map((s) => s.code)),
    ...fwcBottomSection.stickers.map((s) => s.code),
    ...cocaColaSection.stickers.map((s) => s.code),
  ];
}

export function getTeamsByGroup(group: string): TeamSection[] {
  return teamSections.filter((t) => t.group === group);
}
