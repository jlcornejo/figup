"use client";

import { useState, useMemo, useCallback } from "react";
import { albumData, TeamSection } from "@/data/album";
import { useCollection } from "@/store/collection";
import { Header } from "@/components/Header";
import { Sidebar, ViewFilter, SectionView } from "@/components/Sidebar";
import { TeamPage } from "@/components/TeamPage";
import { SpecialPage } from "@/components/SpecialPage";
import { QuickAdd } from "@/components/QuickAdd";

export default function Home() {
  const {
    isLoaded,
    addSticker,
    removeSticker,
    getQuantity,
    isOwned,
    getTotalOwned,
    getTotalDuplicates,
    getOwnedInRange,
  } = useCollection();

  const [currentSection, setCurrentSection] = useState<SectionView>("all");
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalOwned = useMemo(() => getTotalOwned(), [getTotalOwned]);
  const totalDuplicates = useMemo(() => getTotalDuplicates(), [getTotalDuplicates]);

  const getTeamProgress = useCallback(
    (team: TeamSection) => {
      const codes = team.stickers.map((s) => s.code);
      return { owned: getOwnedInRange(codes), total: team.stickers.length };
    },
    [getOwnedInRange]
  );

  const shouldShowSticker = useCallback(
    (code: string): boolean => {
      switch (filter) {
        case "owned":
          return isOwned(code);
        case "missing":
          return !isOwned(code);
        case "duplicates":
          return getQuantity(code) > 1;
        default:
          return true;
      }
    },
    [filter, isOwned, getQuantity]
  );

  const visibleTeams = useMemo(() => {
    const allTeams = albumData.sections.teams;

    if (currentSection === "all") return allTeams;
    if (currentSection.startsWith("group-")) {
      const group = currentSection.replace("group-", "");
      return allTeams.filter((t) => t.group === group);
    }
    const team = allTeams.find((t) => t.id === currentSection);
    return team ? [team] : [];
  }, [currentSection]);

  const showOpening =
    currentSection === "all" || currentSection === "opening";
  const showTeams =
    currentSection === "all" ||
    currentSection.startsWith("group-") ||
    albumData.sections.teams.some((t) => t.id === currentSection);
  const showFwcBottom =
    currentSection === "all" || currentSection === "fwc-bottom";
  const showCocaCola =
    currentSection === "all" || currentSection === "coca-cola";

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-panini-magenta to-panini-purple flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-2xl font-bold">F</span>
          </div>
          <p className="text-sm text-panini-text-muted">Cargando tu álbum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        totalOwned={totalOwned}
        totalStickers={albumData.totalStickers}
        totalDuplicates={totalDuplicates}
      />

      <div className="flex flex-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed bottom-6 left-6 z-40 lg:hidden bg-panini-card border border-panini-border rounded-full p-3 shadow-lg"
        >
          <span className="text-lg">☰</span>
        </button>

        <Sidebar
          currentSection={currentSection}
          onSectionChange={(s) => {
            setCurrentSection(s);
            setSidebarOpen(false);
          }}
          filter={filter}
          onFilterChange={setFilter}
          getTeamProgress={getTeamProgress}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 max-w-6xl">
          {/* Instructions */}
          <div className="mb-6 bg-panini-card/50 border border-panini-border rounded-lg p-3">
            <p className="text-xs text-panini-text-muted">
              <strong className="text-panini-text">Tap/Click</strong> para agregar · 
              <strong className="text-panini-text"> Mantener presionado</strong> para quitar · 
              <strong className="text-panini-gold"> Dorado</strong> = repetida · 
              <strong className="text-panini-turquoise"> Turquesa</strong> = tengo
            </p>
          </div>

          <div className="space-y-8">
            {/* Opening FWC section */}
            {showOpening && (
              <SpecialPage
                section={{
                  ...albumData.sections.opening,
                  stickers: albumData.sections.opening.stickers.filter((s) =>
                    shouldShowSticker(s.code)
                  ),
                }}
                getQuantity={getQuantity}
                onAdd={addSticker}
                onRemove={removeSticker}
                ownedCount={getOwnedInRange(
                  albumData.sections.opening.stickers.map((s) => s.code)
                )}
              />
            )}

            {/* Teams */}
            {showTeams &&
              visibleTeams.map((team) => {
                const filteredStickers = team.stickers.filter((s) =>
                  shouldShowSticker(s.code)
                );
                if (filteredStickers.length === 0 && filter !== "all") return null;
                return (
                  <TeamPage
                    key={team.id}
                    team={{
                      ...team,
                      stickers: filteredStickers,
                    }}
                    getQuantity={getQuantity}
                    onAdd={addSticker}
                    onRemove={removeSticker}
                    ownedCount={getOwnedInRange(
                      team.stickers.map((s) => s.code)
                    )}
                  />
                );
              })}

            {/* FWC Bottom */}
            {showFwcBottom && (
              <SpecialPage
                section={{
                  ...albumData.sections.fwcBottom,
                  stickers: albumData.sections.fwcBottom.stickers.filter((s) =>
                    shouldShowSticker(s.code)
                  ),
                }}
                getQuantity={getQuantity}
                onAdd={addSticker}
                onRemove={removeSticker}
                ownedCount={getOwnedInRange(
                  albumData.sections.fwcBottom.stickers.map((s) => s.code)
                )}
              />
            )}

            {/* Coca-Cola */}
            {showCocaCola && (
              <SpecialPage
                section={{
                  ...albumData.sections.cocaCola,
                  stickers: albumData.sections.cocaCola.stickers.filter((s) =>
                    shouldShowSticker(s.code)
                  ),
                }}
                getQuantity={getQuantity}
                onAdd={addSticker}
                onRemove={removeSticker}
                ownedCount={getOwnedInRange(
                  albumData.sections.cocaCola.stickers.map((s) => s.code)
                )}
              />
            )}
          </div>
        </main>
      </div>

      {/* Quick Add (floating) */}
      <QuickAdd onAdd={addSticker} isOwned={isOwned} />
    </div>
  );
}
