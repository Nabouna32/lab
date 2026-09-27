export function calculatePercentage(percentage: number, value: number): number | null {
  const result = (percentage / 100) * value;
  return Number.isFinite(result) ? result : null;
}

export function calculateEvolution(
  finalValue: number,
  startingValue: number,
): number | null {
  if (startingValue === 0) {
    return null;
  }

  const result = ((finalValue - startingValue) / startingValue) * 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateDifference(
  firstValue: number,
  secondValue: number,
): number | null {
  const average = (Math.abs(firstValue) + Math.abs(secondValue)) / 2;

  if (average === 0) {
    return null;
  }

  const result = (Math.abs(firstValue - secondValue) / average) * 100;
  return Number.isFinite(result) ? result : null;
}
