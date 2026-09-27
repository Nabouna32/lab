export function calculateRuleOfThree(
  firstValue: number,
  firstResult: number,
  secondValue: number,
): number | null {
  if (!Number.isFinite(firstValue) || !Number.isFinite(firstResult) || !Number.isFinite(secondValue)) {
    return null;
  }

  if (firstValue === 0) {
    return null;
  }

  const result = (firstResult * secondValue) / firstValue;
  return Number.isFinite(result) ? result : null;
}

export function isValidRuleOfThreeInput(
  firstValue: number,
  firstResult: number,
  secondValue: number,
): boolean {
  return (
    Number.isFinite(firstValue) &&
    Number.isFinite(firstResult) &&
    Number.isFinite(secondValue) &&
    firstValue !== 0
  );
}
