"use client";

import { albumData, TeamSection } from "@/data/album";
import { teamFlags } from "@/data/teamFlags";

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

  const navBtnClass = (active: boolean) =>
    `w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      active
        ? "bg-white/15 text-white border border-white/20 shadow-sm"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-app-bg/95 backdrop-blur-md border-r border-white/10
          z-50 transform transition-transform duration-300 overflow-y-auto pt-16
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="p-4">
          {/* Filters */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
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
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    filter === f.key
                      ? "bg-wc-lime/20 text-wc-lime border border-wc-lime/30"
                      : "bg-white/5 text-white/50 hover:text-white border border-white/10"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
              Secciones
            </h4>

            <button onClick={() => onSectionChange("all")} className={navBtnClass(currentSection === "all")}>
              📖 Todo el Álbum
            </button>

            <button onClick={() => onSectionChange("opening")} className={navBtnClass(currentSection === "opening")}>
              🏆 FWC (Apertura)
            </button>

            {/* Groups with team colors */}
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-4 mb-2">
              Equipos
            </h4>
            {groups.map((group) => {
              const groupTeams = teams.filter((t) => t.group === group);
              if (groupTeams.length === 0) return null;
              return (
                <div key={group} className="mb-1">
                  <button
                    onClick={() => onSectionChange(`group-${group}`)}
                    className={navBtnClass(currentSection === `group-${group}`)}
                  >
                    ⚽ Grupo {group}
                  </button>
                  <div className="ml-2 mt-0.5 space-y-0.5">
                    {groupTeams.map((team) => {
                      const progress = getTeamProgress(team);
                      const isComplete = progress.owned === progress.total;
                      return (
                        <button
                          key={team.id}
                          onClick={() => onSectionChange(team.id)}
                          className={`w-full text-left px-2 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 ${
                            currentSection === team.id
                              ? "bg-white/10 text-white"
                              : "text-white/50 hover:text-white"
                          }`}
                        >
                          {/* Team flag */}
                          <span className="text-sm shrink-0">
                            {teamFlags[team.code] || "🏳️"}
                          </span>
                          <span className="truncate flex-1">
                            {isComplete && "🏆 "}
                            {team.name}
                          </span>
                          <span className={`text-[10px] shrink-0 font-medium ${
                            isComplete ? "text-wc-gold-light" : "text-white/40"
                          }`}>
                            {progress.owned}/{progress.total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button onClick={() => onSectionChange("fwc-bottom")} className={navBtnClass(currentSection === "fwc-bottom")}>
              🏟️ FWC (Estadios)
            </button>

            <button onClick={() => onSectionChange("coca-cola")} className={navBtnClass(currentSection === "coca-cola")}>
              🥤 Coca-Cola
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
