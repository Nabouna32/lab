import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateCompoundInterest } from "./compound-interest.ts";

test("calculates annual compounding", () => {
  const result = calculateCompoundInterest({ principal: 1000, annualRatePercent: 5, years: 10, compoundingPerYear: 1, contributionPerPeriod: 0 });
  assert.ok(result);
  assert.ok(Math.abs(result.finalBalance - 1628.894626777442) < 1e-9);
});

test("handles zero interest", () => {
  const result = calculateCompoundInterest({ principal: 500, annualRatePercent: 0, years: 3, compoundingPerYear: 12, contributionPerPeriod: 25 });
  assert.deepEqual(result, { finalBalance: 1400, principalGrowth: 500, totalContributions: 900, interestEarned: 0 });
});
