"use client";

import { useEffect } from "react";
import { useRecentTools } from "@/components/home/RecentToolsProvider";
import type { ToolId } from "@/lib/tools/types";

export default function RecentToolTracker({ toolId }: { toolId: ToolId }) {
  const { recordTool } = useRecentTools();

  useEffect(() => {
    recordTool(toolId);
  }, [recordTool, toolId]);

  return null;
}
