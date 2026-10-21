export const LOCAL_COLLECTIONS_KEY = "loculary:local-collections:v1";
export const MAX_LOCAL_COLLECTIONS = 50;
export const MAX_LOCAL_COLLECTIONS_BACKUP_CHARS = 1_000_000;
export const LOCAL_COLLECTIONS_BACKUP_FORMAT = "loculary-local-collections";
export const LOCAL_COLLECTIONS_BACKUP_VERSION = 1;

export type StoredLocalCollection = {
  id: string;
  name: string;
  created_at: string;
  tool_ids: string[];
};

export type LocalCollectionsBackupResult =
  | { ok: true; collections: StoredLocalCollection[]; ignoredToolCount: number }
  | { ok: false; reason: "too-large" | "invalid-json" | "unsupported-format" | "invalid-collections" | "empty" };

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

export function createLocalCollectionsBackup(
  collections: StoredLocalCollection[],
  exportedAt = new Date().toISOString(),
): string {
  return JSON.stringify({
    format: LOCAL_COLLECTIONS_BACKUP_FORMAT,
    version: LOCAL_COLLECTIONS_BACKUP_VERSION,
    exported_at: exportedAt,
    collections,
  }, null, 2);
}

export function parseLocalCollectionsBackup(
  raw: string,
  validToolIds: readonly string[],
): LocalCollectionsBackupResult {
  if (raw.length > MAX_LOCAL_COLLECTIONS_BACKUP_CHARS) return { ok: false, reason: "too-large" };

  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { ok: false, reason: "unsupported-format" };
  }
  const backup = value as Record<string, unknown>;
  if (
    backup.format !== LOCAL_COLLECTIONS_BACKUP_FORMAT ||
    backup.version !== LOCAL_COLLECTIONS_BACKUP_VERSION ||
    typeof backup.exported_at !== "string" ||
    !Number.isFinite(Date.parse(backup.exported_at))
  ) {
    return { ok: false, reason: "unsupported-format" };
  }
  if (
    !Array.isArray(backup.collections) ||
    backup.collections.length > MAX_LOCAL_COLLECTIONS ||
    backup.collections.some((candidate) => {
      if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) return true;
      const row = candidate as Record<string, unknown>;
      return typeof row.name !== "string" ||
        !row.name.trim() ||
        row.name.trim().length > 80 ||
        typeof row.created_at !== "string" ||
        !Number.isFinite(Date.parse(row.created_at)) ||
        !Array.isArray(row.tool_ids) ||
        row.tool_ids.some((id) => typeof id !== "string");
    })
  ) {
    return { ok: false, reason: "invalid-collections" };
  }
  if (backup.collections.length === 0) return { ok: false, reason: "empty" };

  const allowed = new Set(validToolIds);
  let ignoredToolCount = 0;
  const collections = backup.collections.map((candidate, index) => {
    const row = candidate as Record<string, unknown>;
    const sourceToolIds = row.tool_ids as string[];
    const tool_ids = [...new Set(sourceToolIds.filter((id) => {
      const valid = allowed.has(id);
      if (!valid) ignoredToolCount += 1;
      return valid;
    }))];
    return {
      // Imported identifiers are never trusted or reused; the provider assigns fresh local IDs.
      id: `local-import-${index}`,
      name: (row.name as string).trim(),
      created_at: row.created_at as string,
      tool_ids,
    };
  });

  return { ok: true, collections, ignoredToolCount };
}
