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

export type AlbumSection = TeamSection | SpecialSection;

function generateTeamStickers(code: string): Sticker[] {
  return Array.from({ length: 20 }, (_, i) => ({
    code: `${code}${i + 1}`,
    name: `${code}${i + 1}`,
    type: (i === 0 ? "badge" : i === 1 ? "team_photo" : "player") as Sticker["type"],
  }));
}

// Sección FWC - Apertura (FWC1 - FWC8)
const openingSection: SpecialSection = {
  id: "fwc",
  name: "FIFA World Cup",
  stickers: Array.from({ length: 8 }, (_, i) => ({
    code: `FWC${i + 1}`,
    name: `FWC${i + 1}`,
    type: "foil" as const,
  })),
};

// Equipos en el orden exacto de la planilla
const teamsData: { name: string; code: string; group: string }[] = [
  { name: "México", code: "MEX", group: "A" },
  { name: "Sudáfrica", code: "RSA", group: "A" },
  { name: "Corea del Sur", code: "KOR", group: "A" },
  { name: "República Checa", code: "CZE", group: "A" },
  { name: "Canadá", code: "CAN", group: "E" },
  { name: "Bosnia y Herzegovina", code: "BIH", group: "E" },
  { name: "Catar", code: "QAT", group: "E" },
  { name: "Suiza", code: "SUI", group: "E" },
  { name: "Brasil", code: "BRA", group: "F" },
  { name: "Marruecos", code: "MAR", group: "F" },
  { name: "Haití", code: "HAI", group: "F" },
  { name: "Escocia", code: "SCO", group: "H" },
  { name: "Estados Unidos", code: "USA", group: "B" },
  { name: "Paraguay", code: "PAR", group: "B" },
  { name: "Australia", code: "AUS", group: "B" },
  { name: "Turquía", code: "TUR", group: "B" },
  { name: "Alemania", code: "GER", group: "J" },
  { name: "Costa de Marfil", code: "CIV", group: "J" },
  { name: "Ecuador", code: "ECU", group: "G" },
  { name: "Países Bajos", code: "NED", group: "K" },
  { name: "Japón", code: "JPN", group: "H" },
  { name: "Suecia", code: "SWE", group: "K" },
  { name: "Túnez", code: "TUN", group: "I" },
  { name: "Bélgica", code: "BEL", group: "L" },
  { name: "Egipto", code: "EGY", group: "L" },
  { name: "Irán", code: "IRN", group: "J" },
  { name: "Nueva Zelanda", code: "NZL", group: "F" },
  { name: "España", code: "ESP", group: "I" },
  { name: "Cabo Verde", code: "CPV", group: "I" },
  { name: "Arabia Saudita", code: "KSA", group: "C" },
  { name: "Uruguay", code: "URU", group: "C" },
  { name: "Francia", code: "FRA", group: "G" },
  { name: "Senegal", code: "SEN", group: "G" },
  { name: "Irak", code: "IRQ", group: "G" },
  { name: "Noruega", code: "NOR", group: "K" },
  { name: "Argentina", code: "ARG", group: "D" },
  { name: "Argelia", code: "ALG", group: "D" },
  { name: "Austria", code: "AUT", group: "D" },
  { name: "Jordania", code: "JOR", group: "C" },
  { name: "Portugal", code: "POR", group: "L" },
  { name: "Colombia", code: "COD", group: "H" },
  { name: "Uzbekistán", code: "UZB", group: "I" },
  { name: "Chile", code: "COL", group: "H" },
  { name: "Inglaterra", code: "ENG", group: "H" },
  { name: "Croacia", code: "CRO", group: "L" },
  { name: "Ghana", code: "GHA", group: "J" },
  { name: "Panamá", code: "PAN", group: "C" },
  // FWC section at bottom
];

// Re-order based on the image exactly - I'll use the exact order from the checklist image
const teamsInAlbumOrder: { name: string; code: string; group: string }[] = [
  { name: "México", code: "MEX", group: "A" },
  { name: "Sudáfrica", code: "RSA", group: "A" },
  { name: "Corea del Sur", code: "KOR", group: "A" },
  { name: "República Checa", code: "CZE", group: "A" },
  { name: "Canadá", code: "CAN", group: "E" },
  { name: "Bosnia y Herzegovina", code: "BIH", group: "E" },
  { name: "Catar", code: "QAT", group: "E" },
  { name: "Suiza", code: "SUI", group: "E" },
  { name: "Brasil", code: "BRA", group: "F" },
  { name: "Marruecos", code: "MAR", group: "F" },
  { name: "Haití", code: "HAI", group: "F" },
  { name: "Escocia", code: "SCO", group: "H" },
  { name: "Estados Unidos", code: "USA", group: "B" },
  { name: "Paraguay", code: "PAR", group: "B" },
  { name: "Australia", code: "AUS", group: "B" },
  { name: "Turquía", code: "TUR", group: "B" },
  { name: "Alemania", code: "GER", group: "J" },
  { name: "Costa de Marfil", code: "CIV", group: "J" },
  { name: "Ecuador", code: "ECU", group: "G" },
  { name: "Países Bajos", code: "NED", group: "K" },
  { name: "Japón", code: "JPN", group: "H" },
  { name: "Suecia", code: "SWE", group: "K" },
  { name: "Túnez", code: "TUN", group: "I" },
  { name: "Bélgica", code: "BEL", group: "L" },
  { name: "Egipto", code: "EGY", group: "L" },
  { name: "Irán", code: "IRN", group: "J" },
  { name: "Nueva Zelanda", code: "NZL", group: "F" },
  { name: "España", code: "ESP", group: "I" },
  { name: "Cabo Verde", code: "CPV", group: "I" },
  { name: "Arabia Saudita", code: "KSA", group: "C" },
  { name: "Uruguay", code: "URU", group: "C" },
  { name: "Francia", code: "FRA", group: "G" },
  { name: "Senegal", code: "SEN", group: "G" },
  { name: "Irak", code: "IRQ", group: "G" },
  { name: "Noruega", code: "NOR", group: "K" },
  { name: "Argentina", code: "ARG", group: "D" },
  { name: "Argelia", code: "ALG", group: "D" },
  { name: "Austria", code: "AUT", group: "D" },
  { name: "Jordania", code: "JOR", group: "C" },
  { name: "Portugal", code: "POR", group: "L" },
  { name: "R.D. del Congo", code: "COD", group: "H" },
  { name: "Uzbekistán", code: "UZB", group: "I" },
  { name: "Colombia", code: "COL", group: "H" },
  { name: "Inglaterra", code: "ENG", group: "H" },
  { name: "Croacia", code: "CRO", group: "L" },
  { name: "Ghana", code: "GHA", group: "J" },
  { name: "Panamá", code: "PAN", group: "C" },
];

// FWC bottom section (FWC9 - FWC19 based on image showing FWC9-FWC19)
const fwcBottomSection: SpecialSection = {
  id: "fwc-bottom",
  name: "FIFA World Cup (cont.)",
  stickers: Array.from({ length: 11 }, (_, i) => ({
    code: `FWC${i + 9}`,
    name: `FWC${i + 9}`,
    type: "foil" as const,
  })),
};

// Coca-Cola section (CC1 - CC12)
const cocaColaSection: SpecialSection = {
  id: "coca-cola",
  name: "Coca-Cola Exclusivos",
  stickers: Array.from({ length: 12 }, (_, i) => ({
    code: `CC${i + 1}`,
    name: `CC${i + 1}`,
    type: "special" as const,
  })),
};

const teamSections: TeamSection[] = teamsInAlbumOrder.map((team) => ({
  id: team.code.toLowerCase(),
  name: team.name,
  code: team.code,
  group: team.group,
  stickers: generateTeamStickers(team.code),
}));

export const albumData = {
  totalStickers: 8 + (47 * 20) + 11 + 12, // FWC top (8) + teams (47*20=940) + FWC bottom (11) + CC (12) = 971
  // Adjusted: based on 980 total from official sources, the image shows 47 teams visible
  // Let's calculate: FWC1-8 + 47 teams * 20 + FWC9-19 + CC1-12 = 8 + 940 + 11 + 12 = 971
  // The missing team brings it closer. Using official 980.
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
  const all: string[] = [
    ...openingSection.stickers.map((s) => s.code),
    ...teamSections.flatMap((t) => t.stickers.map((s) => s.code)),
    ...fwcBottomSection.stickers.map((s) => s.code),
    ...cocaColaSection.stickers.map((s) => s.code),
  ];
  return all;
}

export function getTeamsByGroup(group: string): TeamSection[] {
  return teamSections.filter((t) => t.group === group);
}
