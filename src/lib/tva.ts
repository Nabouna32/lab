export function calculateTtc(ht: number, rate: number): number | null {
  if (!Number.isFinite(ht) || ht < 0 || !isValidVatRate(rate)) return null;
  const result = ht * (1 + rate / 100);
  return Number.isFinite(result) ? result : null;
}

export function calculateHt(ttc: number, rate: number): number | null {
  if (!Number.isFinite(ttc) || ttc < 0 || !isValidVatRate(rate)) return null;
  const result = ttc / (1 + rate / 100);
  return Number.isFinite(result) ? result : null;
}

export function calculateVatAmount(ht: number, rate: number): number | null {
  const ttc = calculateTtc(ht, rate);
  if (ttc === null) return null;

  const result = ttc - ht;
  return Number.isFinite(result) ? result : null;
}

export function isValidVatRate(rate: number): boolean {
  return Number.isFinite(rate) && rate >= 0 && rate <= 100;
}
