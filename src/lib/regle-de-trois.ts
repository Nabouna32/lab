export function calculateRuleOfThree(
  firstValue: number,
  firstResult: number,
  secondValue: number,
): number | null {
  if (!Number.isFinite(firstValue) || !Number.isFinite(firstResult) || !Number.isFinite(secondValue)) {
    throw new Error("Les valeurs doivent être des nombres finis.");
  }

  if (firstValue === 0) {
    throw new Error("La première valeur ne peut pas être égale à zéro.");
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
