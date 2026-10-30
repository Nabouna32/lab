"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LEGACY_RECENT_TOOLS_STORAGE_KEY, recordRecentTool } from "@/lib/tools/recent-tools";
import type { ToolId } from "@/lib/tools/types";

type RecentToolsContextValue = {
  recentIds: ToolId[];
  recordTool: (toolId: ToolId) => void;
  clearRecentTools: () => void;
};

const RecentToolsContext = createContext<RecentToolsContextValue | null>(null);

export function RecentToolsProvider({ children, toolIds }: { children: ReactNode; toolIds: readonly ToolId[] }) {
  const [recentIds, setRecentIds] = useState<ToolId[]>([]);
  const validIds = useMemo(() => [...toolIds], [toolIds]);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_RECENT_TOOLS_STORAGE_KEY);
    } catch {
      // Removing the legacy value must never affect tool usage.
    }
  }, []);

  const recordTool = useCallback((toolId: ToolId) => {
    setRecentIds((current) => recordRecentTool(current, toolId, validIds));
  }, [validIds]);

  const clearRecentTools = useCallback(() => setRecentIds([]), []);

  const value = useMemo(() => ({
    recentIds,
    recordTool,
    clearRecentTools,
  }), [recentIds, recordTool, clearRecentTools]);

  return <RecentToolsContext.Provider value={value}>{children}</RecentToolsContext.Provider>;
}

export function useRecentTools() {
  const context = useContext(RecentToolsContext);
  if (!context) throw new Error("useRecentTools must be used within RecentToolsProvider.");
  return context;
}
