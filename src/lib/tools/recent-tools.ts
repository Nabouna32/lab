import type { ToolId } from "./types.ts";

export const RECENT_TOOLS_STORAGE_KEY = "loculary:recent-tools:v1";
export const RECENT_TOOLS_EVENT = "loculary:recent-tools-changed";
export const MAX_RECENT_TOOLS = 5;

export function parseRecentToolIds(raw: string | null, validIds: readonly string[]): ToolId[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Set(validIds);
    const seen = new Set<string>();
    const result: ToolId[] = [];
    for (const value of parsed) {
      if (typeof value !== "string" || !valid.has(value) || seen.has(value)) continue;
      seen.add(value);
      result.push(value as ToolId);
      if (result.length === MAX_RECENT_TOOLS) break;
    }
    return result;
  } catch {
    return [];
  }
}

export function recordRecentTool(
  current: readonly ToolId[],
  toolId: ToolId,
  validIds: readonly string[],
): ToolId[] {
  const valid = new Set(validIds);
  if (!valid.has(toolId)) return parseRecentToolIds(JSON.stringify(current), validIds);
  const next = [toolId, ...current.filter((id) => id !== toolId && valid.has(id))];
  return next.slice(0, MAX_RECENT_TOOLS);
}
