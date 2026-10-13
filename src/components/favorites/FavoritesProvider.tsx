"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ANONYMOUS_FAVORITES_KEY, FAVORITE_MIGRATION_KEY,
  getVisibleFavoriteIds, normalizeFavoriteIds, parseFavoriteMigrationPayload,
  reconcileAnonymousAfterMerge, reconcileVerifiedMigration, type FavoriteMigrationPayload,
} from "@/lib/favorites";

type AccountFavorites = { userId: string; ids: string[]; loading: boolean; error: boolean };
type FavoritesContextValue = {
  favoriteIds: string[]; userId: string | null; loading: boolean; error: boolean;
  isFavorite: (toolId: string) => boolean; toggleFavorite: (toolId: string) => Promise<void>;
};
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children, toolIds }: { children: ReactNode; toolIds: string[] }) {
  const [anonymousIds, setAnonymousIds] = useState<string[]>([]);
  const [migration, setMigration] = useState<FavoriteMigrationPayload | null>(null);
  const [account, setAccount] = useState<AccountFavorites | null>(null);
  const [ready, setReady] = useState(false);
  const migrationRef = useRef<FavoriteMigrationPayload | null>(null);
  const anonymousRef = useRef<string[]>([]);
  const activeUserRef = useRef<string | null>(null);
  const validIds = useMemo(() => [...toolIds], [toolIds]);

  const persistAnonymous = useCallback((ids: string[]) => {
    const normalized = normalizeFavoriteIds(ids, validIds);
    anonymousRef.current = normalized;
    setAnonymousIds(normalized);
    try {
      if (normalized.length) localStorage.setItem(ANONYMOUS_FAVORITES_KEY, JSON.stringify(normalized));
      else localStorage.removeItem(ANONYMOUS_FAVORITES_KEY);
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  }, [validIds]);

  const persistMigration = useCallback((payload: FavoriteMigrationPayload | null) => {
    migrationRef.current = payload;
    setMigration(payload);
    try {
      if (payload?.toolIds.length) localStorage.setItem(FAVORITE_MIGRATION_KEY, JSON.stringify(payload));
      else localStorage.removeItem(FAVORITE_MIGRATION_KEY);
    } catch {
      // Keep the in-memory payload available for retry during this session.
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let initialAnonymous: string[] = [];
    let storedMigration: FavoriteMigrationPayload | null = null;
    try {
      const rawAnonymous = localStorage.getItem(ANONYMOUS_FAVORITES_KEY);
      const parsedAnonymous: unknown = rawAnonymous ? JSON.parse(rawAnonymous) : [];
      initialAnonymous = normalizeFavoriteIds(parsedAnonymous, validIds);
      storedMigration = parseFavoriteMigrationPayload(localStorage.getItem(FAVORITE_MIGRATION_KEY), validIds);
    } catch {
      // Restricted storage must not break core tool usage.
    }
    anonymousRef.current = initialAnonymous;
    migrationRef.current = storedMigration;
    queueMicrotask(() => {
      if (!mounted) return;
      setAnonymousIds(initialAnonymous);
      setMigration(storedMigration);
      setReady(true);
    });

    const supabase = createClient();
    async function loadAccount(userId: string | null) {
      if (!mounted || (userId !== null && activeUserRef.current !== userId)) return;
      if (!userId) {
        setAccount(null);
        return;
      }
      setAccount({ userId, ids: [], loading: true, error: false });

      let pending = migrationRef.current;
      // Bind a pending anonymous merge to the first account that signs in.
      // A failed merge must never silently migrate to a different account.
      if (!pending && anonymousRef.current.length) {
        pending = { targetUserId: userId, toolIds: [...anonymousRef.current] };
        persistMigration(pending);
      }

      const { data: initialRows, error: initialError } = await supabase
        .from("user_favorites").select("tool_id").eq("user_id", userId);
      if (!mounted || (userId !== null && activeUserRef.current !== userId)) return;
      if (initialError) {
        setAccount({ userId, ids: [], loading: false, error: true });
        return;
      }

      let remoteIds = normalizeFavoriteIds(initialRows.map((row) => row.tool_id), validIds);
      pending = migrationRef.current;
      const pendingIds = pending?.targetUserId === userId ? pending.toolIds : [];

      if (pendingIds.length) {
        const { error: mergeError } = await supabase.from("user_favorites").upsert(
          pendingIds.map((tool_id) => ({ user_id: userId, tool_id })),
          { onConflict: "user_id,tool_id", ignoreDuplicates: true },
        );
        if (!mounted || (userId !== null && activeUserRef.current !== userId)) return;
        if (mergeError) {
          setAccount({ userId, ids: remoteIds, loading: false, error: true });
          return;
        }

        const { data: verifiedRows, error: verifyError } = await supabase
          .from("user_favorites").select("tool_id").eq("user_id", userId);
        if (!mounted || (userId !== null && activeUserRef.current !== userId)) return;
        if (verifyError) {
          setAccount({ userId, ids: remoteIds, loading: false, error: true });
          return;
        }
        remoteIds = normalizeFavoriteIds(verifiedRows.map((row) => row.tool_id), validIds);
        if (!pendingIds.every((id) => remoteIds.includes(id))) {
          setAccount({ userId, ids: remoteIds, loading: false, error: true });
          return;
        }

        // Clear only the exact payload that was confirmed by a fresh server read.
        persistMigration(reconcileVerifiedMigration(migrationRef.current, userId, pendingIds, remoteIds));
        persistAnonymous(reconcileAnonymousAfterMerge(anonymousRef.current, pendingIds, remoteIds));
      }
      if (mounted) setAccount({ userId, ids: remoteIds, loading: false, error: false });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user.id ?? null;
      if (activeUserRef.current === nextUserId) return;
      activeUserRef.current = nextUserId;
      void loadAccount(nextUserId);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [persistAnonymous, persistMigration, validIds]);

  const toggleFavorite = useCallback(async (toolId: string) => {
    if (!validIds.includes(toolId) || !ready) return;
    const currentAccount = account;
    if (!currentAccount) {
      const current = anonymousRef.current;
      persistAnonymous(current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId]);
      return;
    }
    if (currentAccount.loading || currentAccount.error) return;

    const currentMigration = migrationRef.current;
    const pendingForUser = currentMigration?.targetUserId === currentAccount.userId ? currentMigration.toolIds : [];
    const currentlyFavorite = currentAccount.ids.includes(toolId) || pendingForUser.includes(toolId);

    if (currentlyFavorite) {
      const { error } = await createClient().from("user_favorites").delete()
        .eq("user_id", currentAccount.userId).eq("tool_id", toolId);
      if (activeUserRef.current !== currentAccount.userId) return;
      if (error) {
        setAccount((previous) => previous?.userId === currentAccount.userId ? { ...previous, error: true } : previous);
        return;
      }
      if (currentMigration?.targetUserId === currentAccount.userId && currentMigration.toolIds.includes(toolId)) {
        persistMigration({ targetUserId: currentAccount.userId, toolIds: currentMigration.toolIds.filter((id) => id !== toolId) });
      }
      if (anonymousRef.current.includes(toolId)) persistAnonymous(anonymousRef.current.filter((id) => id !== toolId));
      setAccount((previous) => previous?.userId === currentAccount.userId
        ? { ...previous, ids: previous.ids.filter((id) => id !== toolId) } : previous);
      return;
    }

    const { error } = await createClient().from("user_favorites").upsert(
      { user_id: currentAccount.userId, tool_id: toolId },
      { onConflict: "user_id,tool_id", ignoreDuplicates: true },
    );
    if (activeUserRef.current !== currentAccount.userId) return;
    if (error) {
      setAccount((previous) => previous?.userId === currentAccount.userId ? { ...previous, error: true } : previous);
      return;
    }
    setAccount((previous) => previous?.userId === currentAccount.userId
      ? { ...previous, ids: [...new Set([...previous.ids, toolId])] } : previous);
  }, [account, persistAnonymous, persistMigration, ready, validIds]);

  const effectiveIds = useMemo(() => getVisibleFavoriteIds({
    userId: account?.userId ?? null,
    remoteIds: account?.ids ?? [],
    anonymousIds,
    migration,
    catalogOrder: validIds,
  }), [account, anonymousIds, migration, validIds]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favoriteIds: effectiveIds,
    userId: account?.userId ?? null,
    loading: !ready || Boolean(account?.loading),
    error: Boolean(account?.error),
    isFavorite: (toolId) => effectiveIds.includes(toolId),
    toggleFavorite,
  }), [account, effectiveIds, ready, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider.");
  return context;
}
