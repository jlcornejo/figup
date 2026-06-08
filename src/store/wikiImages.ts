"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import catalogData from "@/data/panini-wc-2026-catalog.json";
import playersData from "@/data/players-enriched.json";

const CACHE_KEY = "figup-wiki-images";
const FETCH_DELAY_MS = 300; // Delay between fetches to avoid rate limiting

interface PlayerInfo {
  team_code: string;
  name: string;
}

// Normalize for matching
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Get player name from sticker code using catalog + enriched data
function getPlayerNameForCode(code: string): string | null {
  const catalogEntry = catalogData.stickers.find((s) => s.code === code);
  if (!catalogEntry) return null;

  const stickerName = catalogEntry.name;
  // Skip non-player stickers
  if (!stickerName || stickerName === "Emblem" || stickerName === "Team Photo" ||
      stickerName.startsWith("Official") || stickerName.includes("Stadium") ||
      stickerName.includes("Mascot") || stickerName.includes("Logo")) {
    return null;
  }

  // Extract team code from sticker code (e.g., RSA4 -> RSA)
  const codeMatch = code.match(/^([A-Z]{2,4})(\d+)$/);
  if (!codeMatch) return null;

  const teamCode = codeMatch[0].replace(/\d+/g, "");
  const teamPlayers = (playersData.players as PlayerInfo[]).filter(
    (p) => p.team_code === teamCode
  );

  // Find the matching player in enriched data for a better Wikipedia name
  const normalizedStickerName = normalize(stickerName);
  const player = teamPlayers.find((p) => normalize(p.name) === normalizedStickerName)
    || teamPlayers.find((p) => {
      const stickerParts = normalizedStickerName.split(" ");
      const playerParts = normalize(p.name).split(" ");
      return stickerParts.some((sp) => sp.length > 3 && playerParts.includes(sp));
    });

  // Return the enriched name (better for Wikipedia) or fall back to catalog name
  return player?.name || stickerName;
}

// Load cached wiki images from localStorage
function loadCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function saveCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    console.warn("FigUp: localStorage full for wiki images cache");
  }
}

export function useWikiImages(ownedCodes: string[], userImages: (code: string) => string | null) {
  const [wikiCache, setWikiCache] = useState<Record<string, string>>({});
  const [failedCodes, setFailedCodes] = useState<Set<string>>(new Set());
  const fetchQueueRef = useRef<string[]>([]);
  const isFetchingRef = useRef(false);

  // Load cache on mount
  useEffect(() => {
    setWikiCache(loadCache());
  }, []);

  // Save cache when it changes
  useEffect(() => {
    if (Object.keys(wikiCache).length > 0) {
      saveCache(wikiCache);
    }
  }, [wikiCache]);

  // Determine which codes need fetching
  useEffect(() => {
    const needed = ownedCodes.filter((code) => {
      // Skip if user already has a captured image
      if (userImages(code)) return false;
      // Skip if already cached or failed
      if (wikiCache[code]) return false;
      if (failedCodes.has(code)) return false;
      // Skip non-player codes (numbers < 3 are usually badge/team photo)
      const numMatch = code.match(/\d+$/);
      if (numMatch && parseInt(numMatch[0]) < 3) return false;
      // Check if it's actually a player
      if (!getPlayerNameForCode(code)) return false;
      return true;
    });

    if (needed.length > 0) {
      fetchQueueRef.current = [...new Set([...fetchQueueRef.current, ...needed])];
      processQueue();
    }
  }, [ownedCodes, wikiCache, failedCodes]);

  async function processQueue() {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    while (fetchQueueRef.current.length > 0) {
      const code = fetchQueueRef.current.shift()!;

      // Double-check it's still needed
      if (wikiCache[code] || failedCodes.has(code) || userImages(code)) continue;

      const playerName = getPlayerNameForCode(code);
      if (!playerName) {
        setFailedCodes((prev) => new Set(prev).add(code));
        continue;
      }

      try {
        const wikiName = playerName.replace(/ /g, "_");
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiName)}`
        );
        if (res.ok) {
          const data = await res.json();
          const imgUrl = data?.thumbnail?.source;
          if (imgUrl) {
            setWikiCache((prev) => ({ ...prev, [code]: imgUrl }));
          } else {
            setFailedCodes((prev) => new Set(prev).add(code));
          }
        } else {
          setFailedCodes((prev) => new Set(prev).add(code));
        }
      } catch {
        setFailedCodes((prev) => new Set(prev).add(code));
      }

      // Delay between requests
      await new Promise((r) => setTimeout(r, FETCH_DELAY_MS));
    }

    isFetchingRef.current = false;
  }

  // Return a function that gives the best image for a code
  const getWikiImage = useCallback(
    (code: string): string | null => {
      return wikiCache[code] || null;
    },
    [wikiCache]
  );

  return { getWikiImage };
}
