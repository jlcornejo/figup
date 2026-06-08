"use client";

import { ViewFilter, SectionView } from "./Sidebar";

interface MobileNavProps {
  filter: ViewFilter;
  onFilterChange: (filter: ViewFilter) => void;
  onMenuOpen: () => void;
  totalOwned: number;
  totalStickers: number;
  totalDuplicates: number;
}

export function MobileNav({
  filter,
  onFilterChange,
  onMenuOpen,
  totalOwned,
  totalStickers,
  totalDuplicates,
}: MobileNavProps) {
  const percentage = Math.round((totalOwned / totalStickers) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Stats bar */}
      <div className="bg-app-bg/90 backdrop-blur-md border-t border-white/10 px-3 py-2">
        {/* Filters row */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onMenuOpen}
            className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm shrink-0"
          >
            ☰
          </button>

          {(
            [
              { key: "all", label: "Todas", icon: "📋" },
              { key: "owned", label: "Tengo", icon: "✅" },
              { key: "missing", label: "Faltan", icon: "❌" },
              { key: "duplicates", label: "Repes", icon: "🔄" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                filter === f.key
                  ? "bg-wc-lime/20 text-wc-lime border border-wc-lime/30"
                  : "bg-white/5 text-white/50 border border-transparent"
              }`}
            >
              {f.icon}
              <span className="ml-0.5 hidden xs:inline">{f.label}</span>
            </button>
          ))}

          {/* Mini stats */}
          <div className="shrink-0 text-right pl-2 border-l border-white/10">
            <div className="text-[10px] font-bold text-wc-lime leading-none">
              {totalOwned}/{totalStickers}
            </div>
            <div className="text-[9px] text-white/40 leading-none mt-0.5">
              {percentage}%{totalDuplicates > 0 && ` · ${totalDuplicates}🔄`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
