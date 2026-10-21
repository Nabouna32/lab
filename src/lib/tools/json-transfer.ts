const JSON_TOOL_TRANSFER_KEY = "loculary:json-tool-transfer:v2";
const JSON_TOOL_TRANSFER_MAX_CHARS = 200_000;
const JSON_TOOL_TRANSFER_TTL_MS = 5 * 60 * 1000;

export type JsonToolTransferTarget = "json-diff-checker" | "json-to-typescript";
type SessionStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type PendingTransfer = { target: JsonToolTransferTarget; value: string; createdAt: number };

export function writePendingJsonToolTransfer(
  storage: SessionStorageLike,
  value: string,
  target: JsonToolTransferTarget,
): boolean {
  if (!value || value.length > JSON_TOOL_TRANSFER_MAX_CHARS) return false;

  try {
    JSON.parse(value);
    const transfer: PendingTransfer = { target, value, createdAt: Date.now() };
    storage.setItem(JSON_TOOL_TRANSFER_KEY, JSON.stringify(transfer));
    return true;
  } catch {
    return false;
  }
}

/** Consumes a validated JSON payload once, only for its intended destination and within five minutes. */
export function consumePendingJsonToolTransfer(
  storage: SessionStorageLike,
  target: JsonToolTransferTarget,
): string | null {
  let raw: string | null;

  try {
    raw = storage.getItem(JSON_TOOL_TRANSFER_KEY);
    if (raw === null) return null;
    storage.removeItem(JSON_TOOL_TRANSFER_KEY);
  } catch {
    return null;
  }

  try {
    const transfer = JSON.parse(raw) as Partial<PendingTransfer>;
    if (
      transfer.target !== target ||
      typeof transfer.value !== "string" ||
      !transfer.value ||
      transfer.value.length > JSON_TOOL_TRANSFER_MAX_CHARS ||
      typeof transfer.createdAt !== "number" ||
      !Number.isFinite(transfer.createdAt) ||
      Date.now() - transfer.createdAt < 0 ||
      Date.now() - transfer.createdAt > JSON_TOOL_TRANSFER_TTL_MS
    ) return null;

    JSON.parse(transfer.value);
    return transfer.value;
  } catch {
    return null;
  }
}

// Keep the original narrow API for the existing formatter → comparator flow.
export function writePendingJsonComparison(storage: SessionStorageLike, value: string): boolean {
  return writePendingJsonToolTransfer(storage, value, "json-diff-checker");
}

export function consumePendingJsonComparison(storage: SessionStorageLike): string | null {
  return consumePendingJsonToolTransfer(storage, "json-diff-checker");
}
