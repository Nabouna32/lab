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
    const toolIds = normalizeFavoriteIds(candidate.toolIds, validToolIds);
    return toolIds.length ? { targetUserId: candidate.targetUserId, toolIds } : null;
  } catch {
    return null;
  }
}

export function reconcileMigrationWithAnonymous(
  payload: FavoriteMigrationPayload | null,
  userId: string,
  anonymousIds: readonly string[],
  validToolIds: readonly string[],
): FavoriteMigrationPayload | null {
  if (payload && payload.toolIds.length === 0) payload = null;
  if (payload && payload.targetUserId !== userId) return payload;
  const toolIds = normalizeFavoriteIds([...(payload?.toolIds ?? []), ...anonymousIds], validToolIds);
  if (payload && toolIds.length === payload.toolIds.length && toolIds.every((id, index) => id === payload.toolIds[index])) {
    return payload;
  }
  return toolIds.length ? { targetUserId: userId, toolIds } : null;
}

export function getVisibleFavoriteIds({
  userId,
  remoteIds,
  anonymousIds,
  migration,
  catalogOrder,
}: {
  userId: string | null;
  remoteIds: readonly string[];
  anonymousIds: readonly string[];
  migration: FavoriteMigrationPayload | null;
  catalogOrder: readonly string[];
}): string[] {
  if (!userId) return sortFavoriteIds(anonymousIds, catalogOrder);
  const pending = migration?.targetUserId === userId ? migration.toolIds : [];
  return mergeFavoriteIds(pending, remoteIds, catalogOrder);
}

export function reconcileVerifiedMigration(
  payload: FavoriteMigrationPayload | null,
  userId: string,
  attemptedIds: readonly string[],
  verifiedRemoteIds: readonly string[],
): FavoriteMigrationPayload | null {
  if (!payload || payload.targetUserId !== userId || !attemptedIds.every((id) => verifiedRemoteIds.includes(id))) {
    return payload;
  }
  const remaining = payload.toolIds.filter((id) => !attemptedIds.includes(id));
  return remaining.length ? { targetUserId: userId, toolIds: remaining } : null;
}

export function reconcileAnonymousAfterMerge(
  anonymousIds: readonly string[],
  attemptedIds: readonly string[],
  verifiedRemoteIds: readonly string[],
): string[] {
  if (!attemptedIds.every((id) => verifiedRemoteIds.includes(id))) return [...anonymousIds];
  return anonymousIds.filter((id) => !attemptedIds.includes(id));
}
