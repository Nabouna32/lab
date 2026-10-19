import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateCompoundInterest, getCompoundingPeriodCount } from "./compound-interest.ts";

test("calculates annual compounding", () => {
  const result = calculateCompoundInterest({ principal: 1000, annualRatePercent: 5, years: 10, compoundingPerYear: 1, contributionPerPeriod: 0 });
  assert.ok(result);
  assert.ok(Math.abs(result.finalBalance - 1628.894626777442) < 1e-9);
});

test("handles zero interest", () => {
  const result = calculateCompoundInterest({ principal: 500, annualRatePercent: 0, years: 3, compoundingPerYear: 12, contributionPerPeriod: 25 });
  assert.deepEqual(result, { finalBalance: 1400, principalGrowth: 500, totalContributions: 900, interestEarned: 0 });
});

test("requires a whole number of compounding periods", () => {
  assert.equal(getCompoundingPeriodCount(0.5, 1), null);
  assert.equal(getCompoundingPeriodCount(0.5, 12), 6);
  assert.equal(getCompoundingPeriodCount(0.1666666667, 12), 2);
});

test("calculates fractional years when they map to whole periods", () => {
  const result = calculateCompoundInterest({
    principal: 1000,
    annualRatePercent: 5,
    years: 0.5,
    compoundingPerYear: 12,
    contributionPerPeriod: 0,
  });
  assert.ok(result);
  assert.ok(Math.abs(result.finalBalance - 1000 * Math.pow(1 + 0.05 / 12, 6)) < 1e-9);
  assert.equal(
    calculateCompoundInterest({
      principal: 1000,
      annualRatePercent: 5,
      years: 0.5,
      compoundingPerYear: 1,
      contributionPerPeriod: 0,
    }),
    null,
  );
});
