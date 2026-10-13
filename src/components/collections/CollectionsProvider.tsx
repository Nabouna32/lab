"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export type PersonalCollection = {
  id: string;
  name: string;
  share_token: string | null;
  created_at: string;
  user_collection_items: Array<{ tool_id: string }>;
};

type CollectionsContextValue = {
  collections: PersonalCollection[];
  userId: string | null;
  loading: boolean;
  error: boolean;
  createCollection: (name: string) => Promise<boolean>;
  renameCollection: (id: string, name: string) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
  addTool: (id: string, toolId: string) => Promise<boolean>;
  removeTool: (id: string, toolId: string) => Promise<boolean>;
  toggleSharing: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

const CollectionsContext = createContext<CollectionsContextValue | null>(null);

export function CollectionsProvider({ children, toolIds }: { children: ReactNode; toolIds: string[] }) {
  const [collections, setCollections] = useState<PersonalCollection[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const validToolIds = useMemo(() => new Set(toolIds), [toolIds]);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      setError(true);
      setLoading(false);
      return;
    }
    setUserId(user?.id ?? null);
    setCollections([]);
    if (!user) {
      setCollections([]);
      setError(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("user_collections")
      .select("id,name,share_token,created_at,user_collection_items(tool_id)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (loadError) {
      setError(true);
      setLoading(false);
      return;
    }
    setCollections((data ?? []).map((row) => ({
      ...row,
      user_collection_items: (row.user_collection_items ?? []).filter((item) => validToolIds.has(item.tool_id)),
    })) as PersonalCollection[]);
    setError(false);
    setLoading(false);
  }, [validToolIds]);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    const load = async () => {
      if (!active) return;
      await refresh();
    };
    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (active) void load();
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refresh]);

  const createCollection = useCallback(async (rawName: string) => {
    const name = rawName.trim();
    if (!userId || !name || name.length > 80) return false;
    const { error: writeError } = await createClient().from("user_collections").insert({ user_id: userId, name });
    if (writeError) { setError(true); return false; }
    await refresh();
    return true;
  }, [refresh, userId]);

  const renameCollection = useCallback(async (id: string, rawName: string) => {
    const name = rawName.trim();
    if (!userId || !name || name.length > 80) return false;
    const { error: writeError } = await createClient().from("user_collections").update({ name }).eq("id", id).eq("user_id", userId);
    if (writeError) { setError(true); return false; }
    await refresh();
    return true;
  }, [refresh, userId]);

  const deleteCollection = useCallback(async (id: string) => {
    if (!userId) return false;
    const { error: writeError } = await createClient().from("user_collections").delete().eq("id", id).eq("user_id", userId);
    if (writeError) { setError(true); return false; }
    await refresh();
    return true;
  }, [refresh, userId]);

  const addTool = useCallback(async (id: string, toolId: string) => {
    if (!userId || !validToolIds.has(toolId)) return false;
    const { error: writeError } = await createClient().from("user_collection_items").upsert(
      { collection_id: id, tool_id: toolId }, { onConflict: "collection_id,tool_id", ignoreDuplicates: true },
    );
    if (writeError) { setError(true); return false; }
    await refresh();
    return true;
  }, [refresh, userId, validToolIds]);

  const removeTool = useCallback(async (id: string, toolId: string) => {
    if (!userId) return false;
    const { error: writeError } = await createClient().from("user_collection_items").delete().eq("collection_id", id).eq("tool_id", toolId);
    if (writeError) { setError(true); return false; }
    await refresh();
    return true;
  }, [refresh, userId]);

  const toggleSharing = useCallback(async (id: string) => {
    if (!userId) return false;
    const collection = collections.find((item) => item.id === id);
    if (!collection) return false;
    const { error: writeError } = await createClient().from("user_collections")
      .update({ share_token: collection.share_token ? null : crypto.randomUUID() })
      .eq("id", id).eq("user_id", userId);
    if (writeError) { setError(true); return false; }
    await refresh();
    return true;
  }, [collections, refresh, userId]);

  const value = useMemo(() => ({
    collections, userId, loading, error, createCollection, renameCollection, deleteCollection,
    addTool, removeTool, toggleSharing, refresh,
  }), [collections, userId, loading, error, createCollection, renameCollection, deleteCollection, addTool, removeTool, toggleSharing, refresh]);

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

export function useCollections() {
  const value = useContext(CollectionsContext);
  if (!value) throw new Error("useCollections must be used within CollectionsProvider.");
  return value;
}
