export type CompoundingFrequency = 1 | 2 | 4 | 12 | 365;

export type CompoundInterestInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundingPerYear: CompoundingFrequency;
  contributionPerPeriod: number;
};

export type CompoundInterestResult = {
  finalBalance: number;
  principalGrowth: number;
  totalContributions: number;
  interestEarned: number;
};

const MAX_YEARS = 1000;

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult | null {
  const { principal, annualRatePercent, years, compoundingPerYear, contributionPerPeriod } = input;

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRatePercent) ||
    !Number.isFinite(years) ||
    !Number.isFinite(contributionPerPeriod) ||
    principal < 0 ||
    annualRatePercent < 0 ||
    years <= 0 ||
    years > MAX_YEARS ||
    contributionPerPeriod < 0 ||
    ![1, 2, 4, 12, 365].includes(compoundingPerYear)
  ) {
    return null;
  }

  const periods = years * compoundingPerYear;
  if (!Number.isSafeInteger(periods)) return null;

  const periodicRate = annualRatePercent / 100 / compoundingPerYear;
  const growthFactor = Math.pow(1 + periodicRate, periods);
  if (!Number.isFinite(growthFactor)) return null;

  const principalGrowth = principal * growthFactor;
  const totalContributions = contributionPerPeriod * periods;
  const contributionGrowth =
    periodicRate === 0
      ? totalContributions
      : contributionPerPeriod * ((growthFactor - 1) / periodicRate);
  const finalBalance = principalGrowth + contributionGrowth;
  const interestEarned = finalBalance - principal - totalContributions;

  if (![principalGrowth, totalContributions, finalBalance, interestEarned].every(Number.isFinite)) {
    return null;
  }

  return { finalBalance, principalGrowth, totalContributions, interestEarned };
}
