const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function parseNumber(value: string, base: number): bigint | null {
  if (!Number.isInteger(base) || base < 2 || base > 36) return null;
  const normalized = value.trim().toUpperCase();
  if (!/^[+-]?[0-9A-Z]+$/.test(normalized)) return null;

  const sign = normalized.startsWith("-") ? BigInt(-1) : BigInt(1);
  const digits = normalized.replace(/^[+-]/, "");
  let result = BigInt(0);

  for (const character of digits) {
    const digit = DIGITS.indexOf(character);
    if (digit < 0 || digit >= base) return null;
    result = result * BigInt(base) + BigInt(digit);
  }

  return result * sign;
}

export function formatNumber(value: bigint, base: number): string {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new RangeError("Base must be an integer between 2 and 36.");
  }
  return value.toString(base).toUpperCase();
}

export function convertNumber(value: string, fromBase: number, toBase: number): string | null {
  const parsed = parseNumber(value, fromBase);
  return parsed === null ? null : formatNumber(parsed, toBase);
}

export function isValidBase(base: number): boolean {
  return Number.isInteger(base) && base >= 2 && base <= 36;
}
