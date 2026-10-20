"use client";

import { useEffect } from "react";
import { RECENT_TOOLS_EVENT, RECENT_TOOLS_STORAGE_KEY, parseRecentToolIds, recordRecentTool } from "@/lib/tools/recent-tools";
import type { ToolId } from "@/lib/tools/types";


export default function RecentToolTracker({ toolId, validToolIds }: { toolId: ToolId; validToolIds: readonly ToolId[] }) {
  useEffect(() => {
    try {
      const current = parseRecentToolIds(localStorage.getItem(RECENT_TOOLS_STORAGE_KEY), validToolIds);
      const next = recordRecentTool(current, toolId, validToolIds);
      localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(RECENT_TOOLS_EVENT, { detail: next }));
    } catch {
      // Storage may be disabled; opening a tool must always remain possible.
    }
  }, [toolId, validToolIds]);

  return null;
}
