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
    `w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
      active
        ? "bg-gradient-to-r from-wc-purple/20 to-wc-teal/10 text-white border border-wc-purple/30 shadow-lg shadow-wc-purple/10"
        : "text-white/50 hover:text-white hover:bg-white/5"
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full w-64 sidebar-glass
          z-50 transform transition-transform duration-300 overflow-y-auto pt-16
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="p-4">
          {/* Filters */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2.5">
              Filtrar
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { key: "all", label: "Todas", icon: "📋", color: "from-wc-purple to-wc-blue" },
                  { key: "owned", label: "Tengo", icon: "✅", color: "from-wc-green to-wc-teal" },
                  { key: "missing", label: "Faltan", icon: "❌", color: "from-wc-red to-wc-orange" },
                  { key: "duplicates", label: "Repetidas", icon: "🔄", color: "from-wc-gold to-wc-orange" },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => onFilterChange(f.key)}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                    filter === f.key
                      ? `bg-gradient-to-r ${f.color} text-white shadow-lg`
                      : "bg-white/5 text-white/40 hover:text-white hover:bg-white/8 border border-white/5"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2.5">
              Secciones
            </h4>

            <button onClick={() => onSectionChange("all")} className={navBtnClass(currentSection === "all")}>
              📖 Todo el Álbum
            </button>

            <button onClick={() => onSectionChange("opening")} className={navBtnClass(currentSection === "opening")}>
              🏆 FWC (Apertura)
            </button>

            {/* Groups with team colors */}
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-5 mb-2.5">
              Equipos
            </h4>
            {groups.map((group) => {
              const groupTeams = teams.filter((t) => t.group === group);
              if (groupTeams.length === 0) return null;
              return (
                <div key={group} className="mb-1.5">
                  <button
                    onClick={() => onSectionChange(`group-${group}`)}
                    className={navBtnClass(currentSection === `group-${group}`)}
                  >
                    ⚽ Grupo {group}
                  </button>
                  <div className="ml-2 mt-1 space-y-0.5">
                    {groupTeams.map((team) => {
                      const progress = getTeamProgress(team);
                      const isComplete = progress.owned === progress.total;
                      const pct = progress.total > 0 ? (progress.owned / progress.total) * 100 : 0;
                      return (
                        <button
                          key={team.id}
                          onClick={() => onSectionChange(team.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
                            currentSection === team.id
                              ? "bg-white/10 text-white border border-white/10"
                              : "text-white/45 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="text-sm shrink-0">
                            {teamFlags[team.code] || "🏳️"}
                          </span>
                          <span className="truncate flex-1">
                            {isComplete && "🏆 "}
                            {team.name}
                          </span>
                          <span className={`text-[10px] shrink-0 font-semibold ${
                            isComplete ? "text-wc-gold-light" : pct > 50 ? "text-wc-lime/70" : "text-white/30"
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
