export const LOCAL_COLLECTIONS_KEY = "loculary:local-collections:v1";
export const MAX_LOCAL_COLLECTIONS = 50;

export type StoredLocalCollection = {
  id: string;
  name: string;
  created_at: string;
  tool_ids: string[];
};

export function normalizeLocalCollections(
  value: unknown,
  validToolIds: readonly string[],
): StoredLocalCollection[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(validToolIds);
  const seenIds = new Set<string>();
  const result: StoredLocalCollection[] = [];

  for (const candidate of value) {
    if (result.length >= MAX_LOCAL_COLLECTIONS) break;
    if (typeof candidate !== "object" || candidate === null) continue;
    const row = candidate as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id.startsWith("local-") || seenIds.has(row.id)) continue;
    if (typeof row.name !== "string") continue;
    const name = row.name.trim();
    if (!name || name.length > 80) continue;
    if (typeof row.created_at !== "string" || !Number.isFinite(Date.parse(row.created_at))) continue;
    if (!Array.isArray(row.tool_ids)) continue;

    const tool_ids = [...new Set(row.tool_ids.filter(
      (id): id is string => typeof id === "string" && allowed.has(id),
    ))];
    seenIds.add(row.id);
    result.push({ id: row.id, name, created_at: row.created_at, tool_ids });
  }

  return result;
}

export function parseLocalCollections(
  raw: string | null,
  validToolIds: readonly string[],
): StoredLocalCollection[] {
  if (!raw) return [];
  try {
    return normalizeLocalCollections(JSON.parse(raw) as unknown, validToolIds);
  } catch {
    return [];
  }
}
