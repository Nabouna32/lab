const TEXT_TOOL_TRANSFER_KEY = "loculary:text-tool-transfer:v1";
const TEXT_TOOL_TRANSFER_MAX_CHARS = 200_000;
const TEXT_TOOL_TRANSFER_TTL_MS = 5 * 60 * 1000;

type SessionStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type PendingTransfer = { target: "text-diff-checker"; value: string; createdAt: number };

/** Keep text handoffs local, bounded, targeted and short-lived. */
export function writePendingTextToolTransfer(storage: SessionStorageLike, value: string): boolean {
  if (!value.trim() || value.length > TEXT_TOOL_TRANSFER_MAX_CHARS) return false;

  try {
    const transfer: PendingTransfer = { target: "text-diff-checker", value, createdAt: Date.now() };
    storage.setItem(TEXT_TOOL_TRANSFER_KEY, JSON.stringify(transfer));
    return true;
  } catch {
    return false;
  }
}

/** Consume the intended handoff once; expired, malformed or oversized values are discarded. */
export function consumePendingTextToolTransfer(storage: SessionStorageLike): string | null {
  let raw: string | null;

  try {
    raw = storage.getItem(TEXT_TOOL_TRANSFER_KEY);
    if (raw === null) return null;
    storage.removeItem(TEXT_TOOL_TRANSFER_KEY);
  } catch {
    return null;
  }

  try {
    const transfer = JSON.parse(raw) as Partial<PendingTransfer>;
    const age = Date.now() - (transfer.createdAt ?? Number.NaN);
    if (
      transfer.target !== "text-diff-checker" ||
      typeof transfer.value !== "string" ||
      !transfer.value.trim() ||
      transfer.value.length > TEXT_TOOL_TRANSFER_MAX_CHARS ||
      !Number.isFinite(transfer.createdAt) ||
      age < 0 ||
      age > TEXT_TOOL_TRANSFER_TTL_MS
    ) return null;

    return transfer.value;
  } catch {
    return null;
  }
}
