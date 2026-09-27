export function calculateDiscountAmount(price: number, discountRate: number): number | null {
  const result = (price * discountRate) / 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateDiscountedPrice(
  price: number,
  discountRate: number,
): number | null {
  const discountAmount = calculateDiscountAmount(price, discountRate);
  if (discountAmount === null) return null;

  const result = price - discountAmount;
  return Number.isFinite(result) ? result : null;
}

export function isValidDiscountRate(discountRate: number): boolean {
  return Number.isFinite(discountRate) && discountRate >= 0 && discountRate <= 100;
}

export function isValidReductionPrice(price: number): boolean {
  return Number.isFinite(price) && price > 0;
}
