export const SIZE_UNITS = ["o", "ko", "mo", "go", "to", "kio", "mio", "gio", "tio"] as const;

export type SizeUnit = (typeof SIZE_UNITS)[number];

const SIZE_UNIT_SET = new Set<string>(SIZE_UNITS);

const BYTES_PER_UNIT: Record<SizeUnit, number> = {
  o: 1, ko: 1_000, mo: 1_000_000, go: 1_000_000_000, to: 1_000_000_000_000,
  kio: 1024, mio: 1024 ** 2, gio: 1024 ** 3, tio: 1024 ** 4,
};

export function convertFileSize(value: number, from: SizeUnit, to: SizeUnit): number | null {
  if (!SIZE_UNIT_SET.has(from) || !SIZE_UNIT_SET.has(to)) return null;
  if (!Number.isFinite(value) || value < 0) return null;
  const result = (value * BYTES_PER_UNIT[from]) / BYTES_PER_UNIT[to];
  return Number.isFinite(result) ? result : null;
}
