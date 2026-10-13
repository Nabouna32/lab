export type FavoriteMigrationPayload = {
  targetUserId: string;
  toolIds: string[];
};

export const ANONYMOUS_FAVORITES_KEY = "loculary:anonymous-favorites:v1";
export const FAVORITE_MIGRATION_KEY = "loculary:favorites-migration:v1";

export function normalizeFavoriteIds(values: unknown, validToolIds: readonly string[]): string[] {
  if (!Array.isArray(values)) return [];
  const allowed = new Set(validToolIds);
  return [...new Set(values.filter((value): value is string => typeof value === "string" && allowed.has(value)))];
}

export function sortFavoriteIds(ids: readonly string[], catalogOrder: readonly string[]): string[] {
  const selected = new Set(ids);
  return catalogOrder.filter((id) => selected.has(id));
}

export function mergeFavoriteIds(
  localIds: readonly string[],
  remoteIds: readonly string[],
  catalogOrder: readonly string[],
): string[] {
  return sortFavoriteIds([...localIds, ...remoteIds], catalogOrder);
}

export function parseFavoriteMigrationPayload(
  raw: string | null,
  validToolIds: readonly string[],
): FavoriteMigrationPayload | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || !("targetUserId" in value) || !("toolIds" in value)) return null;
    const candidate = value as { targetUserId?: unknown; toolIds?: unknown };
    if (typeof candidate.targetUserId !== "string" || candidate.targetUserId.length === 0 || !Array.isArray(candidate.toolIds)) return null;
    return { targetUserId: candidate.targetUserId, toolIds: normalizeFavoriteIds(candidate.toolIds, validToolIds) };
  } catch {
    return null;
  }
}
