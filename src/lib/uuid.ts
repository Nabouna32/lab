export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  throw new Error("Secure UUID generation is not available in this browser.");
}

export function generateUuids(count: number): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 50) throw new RangeError("UUID count must be an integer between 1 and 50.");
  return Array.from({ length: count }, generateUuid);
}
