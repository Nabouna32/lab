"use client";

import { getToolRegistryEntry } from "@/lib/tools/registry";

export default function ToolRenderer({ toolId }: { toolId: string }) {
  const entry = getToolRegistryEntry(toolId);

  if (!entry) {
    throw new Error(`Published tool "${toolId}" has no registered runtime.`);
  }

  const ToolComponent = entry.module.runtime;

  return <ToolComponent />;
}
