const JSON_COMPARISON_TRANSFER_KEY = "loculary:json-comparison-transfer:v1";
const JSON_COMPARISON_TRANSFER_MAX_CHARS = 200_000;

type SessionStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** Stores a valid JSON document for a single, same-tab handoff. */
export function writePendingJsonComparison(storage: SessionStorageLike, value: string): boolean {
  if (!value || value.length > JSON_COMPARISON_TRANSFER_MAX_CHARS) return false;

  try {
    JSON.parse(value);
    storage.setItem(JSON_COMPARISON_TRANSFER_KEY, value);
    return true;
  } catch {
    return false;
  }
}

/** Consumes and removes the pending document before returning validated content. */
export function consumePendingJsonComparison(storage: SessionStorageLike): string | null {
  let value: string | null;

  try {
    value = storage.getItem(JSON_COMPARISON_TRANSFER_KEY);
    if (value === null) return null;
    storage.removeItem(JSON_COMPARISON_TRANSFER_KEY);
  } catch {
    return null;
  }

  if (!value || value.length > JSON_COMPARISON_TRANSFER_MAX_CHARS) return null;

  try {
    JSON.parse(value);
    return value;
  } catch {
    return null;
  }
}
