"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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

export function useCollection() {
  const [collection, setCollection] = useState<CollectionState>({ stickers: {} });
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen to auth state
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load collection: from Supabase if logged in, else localStorage
  useEffect(() => {
    async function load() {
      if (user && supabase) {
        const { data, error } = await supabase
          .from("collections")
          .select("sticker_code, quantity")
          .eq("user_id", user.id);

        if (!error && data) {
          const stickers: Record<string, number> = {};
          data.forEach((row) => {
            stickers[row.sticker_code] = row.quantity;
          });
          setCollection({ stickers });
        } else {
          setCollection(loadFromLocalStorage());
        }
      } else {
        setCollection(loadFromLocalStorage());
      }
      setIsLoaded(true);
    }
    load();
  }, [user]);

  // Save: always to localStorage, and debounced to Supabase if logged in
  useEffect(() => {
    if (!isLoaded) return;
    saveToLocalStorage(collection);

    if (user) {
      // Debounce sync to Supabase (wait 1s after last change)
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        syncToSupabase(user.id, collection);
      }, 1000);
    }
  }, [collection, isLoaded, user]);

  async function syncToSupabase(userId: string, state: CollectionState) {
    if (!supabase) return;
    setIsSyncing(true);
    try {
      const upserts = Object.entries(state.stickers)
        .filter(([, qty]) => qty > 0)
        .map(([code, qty]) => ({
          user_id: userId,
          sticker_code: code,
          quantity: qty,
        }));

      if (upserts.length > 0) {
        await supabase
          .from("collections")
          .upsert(upserts, { onConflict: "user_id,sticker_code" });
      }

      const { data: existing } = await supabase
        .from("collections")
        .select("sticker_code")
        .eq("user_id", userId);

      if (existing) {
        const toDelete = existing
          .filter((row) => !state.stickers[row.sticker_code] || state.stickers[row.sticker_code] <= 0)
          .map((row) => row.sticker_code);

        if (toDelete.length > 0) {
          await supabase
            .from("collections")
            .delete()
            .eq("user_id", userId)
            .in("sticker_code", toDelete);
        }
      }
    } catch {
      // Silent fail, data is still in localStorage
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
    user,
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
