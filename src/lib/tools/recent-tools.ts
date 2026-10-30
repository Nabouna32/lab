import type { ToolId } from "./types.ts";

export const MAX_RECENT_TOOLS = 5;
export const LEGACY_RECENT_TOOLS_STORAGE_KEY = "loculary:recent-tools:v1";

export function recordRecentTool(
  current: readonly ToolId[],
  toolId: ToolId,
  validIds: readonly string[],
): ToolId[] {
  const valid = new Set(validIds);
  const seen = new Set<string>();
  const normalized: ToolId[] = [];

  for (const id of current) {
    if (!valid.has(id) || seen.has(id)) continue;
    seen.add(id);
    normalized.push(id);
    if (normalized.length === MAX_RECENT_TOOLS) break;
  }

  if (!valid.has(toolId)) return normalized;
  return [toolId, ...normalized.filter((id) => id !== toolId)].slice(0, MAX_RECENT_TOOLS);
}
