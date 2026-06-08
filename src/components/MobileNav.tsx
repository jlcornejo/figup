"use client";

import { ViewFilter } from "./Sidebar";

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
      <div className="mobile-nav-glass px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onMenuOpen}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-wc-purple/30 to-wc-blue/20 flex items-center justify-center text-sm shrink-0 border border-wc-purple/30"
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
              className={`flex-1 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                filter === f.key
                  ? "bg-gradient-to-r from-wc-purple to-wc-blue text-white shadow-lg shadow-wc-purple/20"
                  : "bg-white/5 text-white/40 border border-white/5"
              }`}
            >
              {f.icon}
              <span className="ml-0.5 hidden xs:inline">{f.label}</span>
            </button>
          ))}

          {/* Mini stats */}
          <div className="shrink-0 text-right pl-2 border-l border-white/10">
            <div className="text-[10px] font-bold gradient-text leading-none">
              {totalOwned}/{totalStickers}
            </div>
            <div className="text-[9px] text-white/35 leading-none mt-0.5">
              {percentage}%{totalDuplicates > 0 && ` · ${totalDuplicates}🔄`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
