"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface CollectionState {
  /** Map of sticker code → quantity owned (0 = not owned) */
  stickers: Record<string, number>;
}

const STORAGE_KEY = "figup-collection";

function loadFromLocalStorage(): CollectionState {
  if (typeof window === "undefined") return { stickers: {} };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // corrupted data, start fresh
  }
  return { stickers: {} };
}

function saveToLocalStorage(state: CollectionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export function useCollection(userId: string | null) {
  const [collection, setCollection] = useState<CollectionState>({ stickers: {} });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUserId = useRef<string | null>(null);

  // Load collection when userId changes
  useEffect(() => {
    // Avoid reloading if same user
    if (prevUserId.current === userId && isLoaded) return;
    prevUserId.current = userId;

    async function load() {
      if (userId && isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("collections")
          .select("sticker_code, quantity")
          .eq("user_id", userId);

        if (!error && data && data.length > 0) {
          const stickers: Record<string, number> = {};
          data.forEach((row) => {
            stickers[row.sticker_code] = row.quantity;
          });
          setCollection({ stickers });
        } else if (!error && data && data.length === 0) {
          // New user — check if there's local data to migrate
          const local = loadFromLocalStorage();
          if (Object.keys(local.stickers).length > 0) {
            setCollection(local);
            // Migrate local data to cloud
            syncToSupabase(userId, local);
          } else {
            setCollection({ stickers: {} });
          }
        } else {
          setCollection(loadFromLocalStorage());
        }
      } else {
        setCollection(loadFromLocalStorage());
      }
      setIsLoaded(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Save on every change
  useEffect(() => {
    if (!isLoaded) return;
    saveToLocalStorage(collection);

    if (userId && isSupabaseConfigured && supabase) {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        syncToSupabase(userId, collection);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, isLoaded]);

  async function syncToSupabase(uid: string, state: CollectionState) {
    if (!supabase) return;
    setIsSyncing(true);
    try {
      const upserts = Object.entries(state.stickers)
        .filter(([, qty]) => qty > 0)
        .map(([code, qty]) => ({
          user_id: uid,
          sticker_code: code,
          quantity: qty,
        }));

      if (upserts.length > 0) {
        await supabase
          .from("collections")
          .upsert(upserts, { onConflict: "user_id,sticker_code" });
      }

      // Remove stickers deleted locally
      const { data: existing } = await supabase
        .from("collections")
        .select("sticker_code")
        .eq("user_id", uid);

      if (existing) {
        const toDelete = existing
          .filter((row) => !state.stickers[row.sticker_code] || state.stickers[row.sticker_code] <= 0)
          .map((row) => row.sticker_code);

        if (toDelete.length > 0) {
          await supabase
            .from("collections")
            .delete()
            .eq("user_id", uid)
            .in("sticker_code", toDelete);
        }
      }
    } catch {
      // Silent fail — data safe in localStorage
    }
    setIsSyncing(false);
  }

  const addSticker = useCallback((code: string) => {
    setCollection((prev) => ({
      stickers: {
        ...prev.stickers,
        [code]: (prev.stickers[code] || 0) + 1,
      },
    }));
  }, []);

  const removeSticker = useCallback((code: string) => {
    setCollection((prev) => {
      const current = prev.stickers[code] || 0;
      if (current <= 0) return prev;
      const newStickers = { ...prev.stickers };
      if (current === 1) {
        delete newStickers[code];
      } else {
        newStickers[code] = current - 1;
      }
      return { stickers: newStickers };
    });
  }, []);

  const getQuantity = useCallback(
    (code: string): number => {
      return collection.stickers[code] || 0;
    },
    [collection]
  );

  const isOwned = useCallback(
    (code: string): boolean => {
      return (collection.stickers[code] || 0) > 0;
    },
    [collection]
  );

  const isDuplicate = useCallback(
    (code: string): boolean => {
      return (collection.stickers[code] || 0) > 1;
    },
    [collection]
  );

  const getTotalOwned = useCallback((): number => {
    return Object.values(collection.stickers).filter((q) => q > 0).length;
  }, [collection]);

  const getTotalDuplicates = useCallback((): number => {
    return Object.values(collection.stickers).reduce(
      (sum, q) => sum + Math.max(0, q - 1),
      0
    );
  }, [collection]);

  const getOwnedInRange = useCallback(
    (codes: string[]): number => {
      return codes.filter((c) => (collection.stickers[c] || 0) > 0).length;
    },
    [collection]
  );

  const resetCollection = useCallback(() => {
    setCollection({ stickers: {} });
  }, []);

  return {
    collection,
    isLoaded,
    isSyncing,
    addSticker,
    removeSticker,
    getQuantity,
    isOwned,
    isDuplicate,
    getTotalOwned,
    getTotalDuplicates,
    getOwnedInRange,
    resetCollection,
  };
}
