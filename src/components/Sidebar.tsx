"use client";

import { albumData, TeamSection } from "@/data/album";

export type ViewFilter = "all" | "owned" | "missing" | "duplicates";
export type SectionView = "all" | "opening" | "fwc-bottom" | "coca-cola" | string;

interface SidebarProps {
  currentSection: SectionView;
  onSectionChange: (section: SectionView) => void;
  filter: ViewFilter;
  onFilterChange: (filter: ViewFilter) => void;
  getTeamProgress: (team: TeamSection) => { owned: number; total: number };
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  currentSection,
  onSectionChange,
  filter,
  onFilterChange,
  getTeamProgress,
  isOpen,
  onToggle,
}: SidebarProps) {
  const groups = albumData.groups;
  const teams = albumData.sections.teams;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-panini-dark border-r border-panini-border
          z-50 transform transition-transform duration-300 overflow-y-auto pt-16
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="p-4">
          {/* Filters */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-panini-text-muted uppercase tracking-wide mb-2">
              Filtrar
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { key: "all", label: "Todas", icon: "📋" },
                  { key: "owned", label: "Tengo", icon: "✅" },
                  { key: "missing", label: "Faltan", icon: "❌" },
                  { key: "duplicates", label: "Repetidas", icon: "🔄" },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => onFilterChange(f.key)}
                  className={`px-2 py-1.5 rounded text-xs transition-colors ${
                    filter === f.key
                      ? "bg-panini-magenta/20 text-panini-magenta border border-panini-magenta/40"
                      : "bg-panini-card text-panini-text-muted hover:text-panini-text border border-panini-border"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-panini-text-muted uppercase tracking-wide mb-2">
              Secciones
            </h4>

            <button
              onClick={() => onSectionChange("all")}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                currentSection === "all"
                  ? "bg-panini-purple/20 text-panini-text border border-panini-purple/40"
                  : "text-panini-text-muted hover:text-panini-text hover:bg-panini-card"
              }`}
            >
              📖 Todo el Álbum
            </button>

            <button
              onClick={() => onSectionChange("opening")}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                currentSection === "opening"
                  ? "bg-panini-purple/20 text-panini-text border border-panini-purple/40"
                  : "text-panini-text-muted hover:text-panini-text hover:bg-panini-card"
              }`}
            >
              ✨ FWC (Apertura)
            </button>

            {/* Groups */}
            <h4 className="text-xs font-semibold text-panini-text-muted uppercase tracking-wide mt-4 mb-2">
              Equipos por Grupo
            </h4>
            {groups.map((group) => {
              const groupTeams = teams.filter((t) => t.group === group);
              if (groupTeams.length === 0) return null;
              return (
                <div key={group}>
                  <button
                    onClick={() => onSectionChange(`group-${group}`)}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                      currentSection === `group-${group}`
                        ? "bg-panini-purple/20 text-panini-text border border-panini-purple/40"
                        : "text-panini-text-muted hover:text-panini-text hover:bg-panini-card"
                    }`}
                  >
                    ⚽ Grupo {group}
                  </button>
                  <div className="ml-4 space-y-0.5">
                    {groupTeams.map((team) => {
                      const progress = getTeamProgress(team);
                      const isComplete = progress.owned === progress.total;
                      return (
                        <button
                          key={team.id}
                          onClick={() => onSectionChange(team.id)}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors flex items-center justify-between ${
                            currentSection === team.id
                              ? "bg-panini-purple/20 text-panini-text"
                              : "text-panini-text-muted hover:text-panini-text"
                          }`}
                        >
                          <span className="truncate">
                            {isComplete && "🏆 "}
                            {team.name}
                          </span>
                          <span className="text-[10px] ml-1 shrink-0">
                            {progress.owned}/{progress.total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => onSectionChange("fwc-bottom")}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-colors mt-2 ${
                currentSection === "fwc-bottom"
                  ? "bg-panini-purple/20 text-panini-text border border-panini-purple/40"
                  : "text-panini-text-muted hover:text-panini-text hover:bg-panini-card"
              }`}
            >
              🏟️ FWC (Estadios)
            </button>

            <button
              onClick={() => onSectionChange("coca-cola")}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                currentSection === "coca-cola"
                  ? "bg-panini-purple/20 text-panini-text border border-panini-purple/40"
                  : "text-panini-text-muted hover:text-panini-text hover:bg-panini-card"
              }`}
            >
              🥤 Coca-Cola Exclusivos
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
