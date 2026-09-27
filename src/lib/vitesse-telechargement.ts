export const SPEED_UNITS = ["mbps", "gbps", "ko-s", "mo-s", "go-s"] as const;

export type SpeedUnit = (typeof SPEED_UNITS)[number];

const SPEED_UNIT_SET = new Set<string>(SPEED_UNITS);

const BITS_PER_UNIT: Record<SpeedUnit, number> = {
  mbps: 1_000_000,
  gbps: 1_000_000_000,
  "ko-s": 8_000,
  "mo-s": 8_000_000,
  "go-s": 8_000_000_000,
};

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  if (!SPEED_UNIT_SET.has(from) || !SPEED_UNIT_SET.has(to)) {
    throw new RangeError("Les unités de vitesse sont invalides.");
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("La valeur doit être un nombre positif ou nul.");
  }

  const result = (value * BITS_PER_UNIT[from]) / BITS_PER_UNIT[to];
  if (!Number.isFinite(result)) throw new RangeError("Le résultat dépasse la plage numérique supportée.");
  return result;
}
