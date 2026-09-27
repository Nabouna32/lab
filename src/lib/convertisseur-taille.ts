export const SIZE_UNITS = ["o", "ko", "mo", "go", "to"] as const;

export type SizeUnit = (typeof SIZE_UNITS)[number];

const SIZE_UNIT_SET = new Set<string>(SIZE_UNITS);

const BYTES_PER_UNIT: Record<SizeUnit, number> = {
  o: 1,
  ko: 1024,
  mo: 1024 ** 2,
  go: 1024 ** 3,
  to: 1024 ** 4,
};

export function convertFileSize(
  value: number,
  from: SizeUnit,
  to: SizeUnit,
): number {
  if (!SIZE_UNIT_SET.has(from) || !SIZE_UNIT_SET.has(to)) {
    throw new RangeError("Les unités de taille sont invalides.");
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("La valeur doit être un nombre positif ou nul.");
  }

  const result = (value * BYTES_PER_UNIT[from]) / BYTES_PER_UNIT[to];
  if (!Number.isFinite(result)) throw new RangeError("Le résultat dépasse la plage numérique supportée.");
  return result;
}
