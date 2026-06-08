"use client";

import { useState, useMemo, useCallback } from "react";
import { albumData, TeamSection } from "@/data/album";
import { useAuth } from "@/store/auth";
import { useCollection } from "@/store/collection";
import { useStickerImages } from "@/store/stickerImages";
import { Header } from "@/components/Header";
import { Sidebar, ViewFilter, SectionView } from "@/components/Sidebar";
import { TeamPage } from "@/components/TeamPage";
import { SpecialPage } from "@/components/SpecialPage";
import { QuickAdd } from "@/components/QuickAdd";
import { StickerCamera } from "@/components/StickerCamera";
import { StickerZoom } from "@/components/StickerZoom";
import { MobileNav } from "@/components/MobileNav";
import { LoginScreen } from "@/components/LoginScreen";
import { UserMenu } from "@/components/UserMenu";
import { PlayerDetail } from "@/components/PlayerDetail";

export default function Home() {
  const { user, profile, isLoading: authLoading, isAuthenticated, signInWithGoogle, signInWithEmail, signOut } = useAuth();

  const {
    isLoaded,
    addSticker,
    removeSticker,
    getQuantity,
    isOwned,
    getTotalOwned,
    getTotalDuplicates,
    getOwnedInRange,
  } = useCollection(user?.id ?? null);

  const [currentSection, setCurrentSection] = useState<SectionView>("all");
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<string | null>(null);
  const [zoomTarget, setZoomTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [playerDetailCode, setPlayerDetailCode] = useState<string | null>(null);

  const { getImage, setImage, removeImage } = useStickerImages();

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
    let allTeams = albumData.sections.teams;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      allTeams = allTeams.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.group.toLowerCase() === q ||
          `grupo ${t.group}`.toLowerCase().includes(q) ||
          t.stickers.some((s) => s.name.toLowerCase().includes(q))
      );
      return allTeams;
    }

    if (currentSection === "all") return allTeams;
    if (currentSection.startsWith("group-")) {
      const group = currentSection.replace("group-", "");
      return allTeams.filter((t) => t.group === group);
    }
    const team = allTeams.find((t) => t.id === currentSection);
    return team ? [team] : [];
  }, [currentSection, searchQuery]);

  const showOpening =
    !searchQuery && (currentSection === "all" || currentSection === "opening");
  const showTeams =
    searchQuery ||
    currentSection === "all" ||
    currentSection.startsWith("group-") ||
    albumData.sections.teams.some((t) => t.id === currentSection);
  const showFwcBottom =
    !searchQuery && (currentSection === "all" || currentSection === "fwc-bottom");
  const showCocaCola =
    !searchQuery && (currentSection === "all" || currentSection === "coca-cola");

  // Auth loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-2xl overflow-hidden animate-pulse">
              <div className="absolute top-0 left-0 w-9 h-9 rounded-full bg-wc-red opacity-80" />
              <div className="absolute top-0 right-0 w-7 h-7 rounded-full bg-wc-green opacity-80" />
              <div className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-wc-skyblue opacity-80" />
              <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-wc-orange opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-black drop-shadow-md">26</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-app-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show login
  if (!isAuthenticated) {
    return <LoginScreen onGoogleLogin={signInWithGoogle} onEmailLogin={signInWithEmail} />;
  }

  // Collection loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-2xl overflow-hidden animate-pulse">
              <div className="absolute top-0 left-0 w-9 h-9 rounded-full bg-wc-red opacity-80" />
              <div className="absolute top-0 right-0 w-7 h-7 rounded-full bg-wc-green opacity-80" />
              <div className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-wc-skyblue opacity-80" />
              <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-wc-orange opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-black drop-shadow-md">26</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-app-text-muted">Cargando tu álbum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        totalOwned={totalOwned}
        totalStickers={albumData.totalStickers}
        totalDuplicates={totalDuplicates}
        userSlot={profile ? <UserMenu profile={profile} onSignOut={signOut} /> : null}
      />

      <div className="flex">
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
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-6xl overflow-y-auto">
          {/* Search */}
          <div className="mb-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar equipo o jugador... (ej: Messi, Uruguay, ARG)"
                className="w-full glass-card rounded-2xl pl-10 pr-10 py-3 text-sm
                  text-white placeholder:text-white/25 focus:outline-none focus:border-wc-purple/40 
                  focus:shadow-lg focus:shadow-wc-purple/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-4 glass-card rounded-2xl p-3.5">
            <p className="text-xs text-white/50">
              <strong className="text-white/80">Tap/Click</strong> para agregar · 
              <strong className="text-white/80"> Mantener presionado</strong> para quitar · 
              <span className="text-wc-gold-light font-bold"> Dorado</span> = repetida · 
              <span className="text-sticker-green font-bold"> Verde</span> = tengo
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
                onCameraClick={(code) => setCameraTarget(code)}
                onImageClick={(code) => setZoomTarget(code)}
                onInfoClick={(code) => setPlayerDetailCode(code)}
                getImage={getImage}
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
                    onCameraClick={(code) => setCameraTarget(code)}
                onImageClick={(code) => setZoomTarget(code)}
                onInfoClick={(code) => setPlayerDetailCode(code)}
                    getImage={getImage}
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
                onCameraClick={(code) => setCameraTarget(code)}
                onImageClick={(code) => setZoomTarget(code)}
                onInfoClick={(code) => setPlayerDetailCode(code)}
                getImage={getImage}
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
                onCameraClick={(code) => setCameraTarget(code)}
                onImageClick={(code) => setZoomTarget(code)}
                onInfoClick={(code) => setPlayerDetailCode(code)}
                getImage={getImage}
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

      {/* Mobile bottom nav */}
      <MobileNav
        filter={filter}
        onFilterChange={setFilter}
        onMenuOpen={() => setSidebarOpen(true)}
        totalOwned={totalOwned}
        totalStickers={albumData.totalStickers}
        totalDuplicates={totalDuplicates}
      />

      {/* Camera modal */}
      {cameraTarget && (
        <StickerCamera
          stickerCode={cameraTarget}
          onCapture={(imageDataUrl) => {
            setImage(cameraTarget, imageDataUrl);
            setCameraTarget(null);
          }}
          onClose={() => setCameraTarget(null)}
        />
      )}

      {/* Zoom modal */}
      {zoomTarget && getImage(zoomTarget) && (
        <StickerZoom
          code={zoomTarget}
          image={getImage(zoomTarget)!}
          onClose={() => setZoomTarget(null)}
          onRetake={() => {
            setZoomTarget(null);
            setCameraTarget(zoomTarget);
          }}
          onDelete={() => {
            removeImage(zoomTarget);
            setZoomTarget(null);
          }}
        />
      )}

      {/* Player detail modal */}
      {playerDetailCode && (
        <PlayerDetail
          stickerCode={playerDetailCode}
          image={getImage(playerDetailCode)}
          onClose={() => setPlayerDetailCode(null)}
        />
      )}
    </div>
  );
}
