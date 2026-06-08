"use client";

interface HeaderProps {
  totalOwned: number;
  totalStickers: number;
  totalDuplicates: number;
}

export function Header({ totalOwned, totalStickers, totalDuplicates }: HeaderProps) {
  const percentage = Math.round((totalOwned / totalStickers) * 100);

  return (
    <header className="sticky top-0 z-50 bg-panini-darker/95 backdrop-blur-sm border-b border-panini-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-panini-magenta to-panini-purple flex items-center justify-center">
              <span className="text-lg font-bold">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">FigUp</h1>
              <p className="text-[10px] text-panini-text-muted leading-tight">Mundial 2026</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm text-panini-text-muted">Tengo</span>
                <span className="text-lg font-bold text-panini-turquoise">
                  {totalOwned}
                </span>
                <span className="text-sm text-panini-text-muted">/ {totalStickers}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 bg-panini-dark rounded-full w-32 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-panini-turquoise to-panini-lime rounded-full progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-panini-turquoise">{percentage}%</span>
              </div>
            </div>
            {totalDuplicates > 0 && (
              <div className="border-l border-panini-border pl-3">
                <span className="text-xs text-panini-text-muted">Repetidas</span>
                <p className="text-sm font-bold text-panini-gold">{totalDuplicates}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
