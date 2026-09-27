import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateRuleOfThree,
  isValidRuleOfThreeInput,
} from "./regle-de-trois.ts";

test("calculates a proportional value", () => {
  assert.equal(calculateRuleOfThree(4, 10, 6), 15);
});

test("supports decimal values", () => {
  assert.equal(calculateRuleOfThree(2.5, 5, 4), 8);
});

test("rejects a zero reference value", () => {
  assert.equal(isValidRuleOfThreeInput(0, 10, 5), false);
  assert.throws(() => calculateRuleOfThree(0, 10, 5));
});

test("rejects non-finite results", () => {
  assert.equal(calculateRuleOfThree(Number.MAX_VALUE, Number.MAX_VALUE, 2), null);
});

test("rejects non-finite values", () => {
  assert.equal(isValidRuleOfThreeInput(Number.NaN, 10, 5), false);
  assert.equal(isValidRuleOfThreeInput(4, Number.POSITIVE_INFINITY, 5), false);
});
