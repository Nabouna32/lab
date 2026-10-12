"use client";

import { getToolRegistryEntry } from "@/lib/tools/registry";
import { ToolRuntimeProvider } from "@/components/tools/ToolPage/ToolRuntimeProvider";

export default function ToolRenderer({ toolId }: { toolId: string }) {
  const entry = getToolRegistryEntry(toolId);

  if (!entry) {
    throw new Error(`Published tool "${toolId}" has no registered runtime.`);
  }

  const ToolComponent = entry.module.runtime;
  const { access = "anonymous", capabilities = [] } = entry.tool ?? {};

  return (
    <ToolRuntimeProvider access={access} capabilities={capabilities}>
      <ToolComponent />
    </ToolRuntimeProvider>
  );
}
