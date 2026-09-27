import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateDiscountAmount,
  calculateDiscountedPrice,
  isValidDiscountRate,
  isValidReductionPrice,
} from "./reduction.ts";

test("calculates the discount amount", () => {
  assert.equal(calculateDiscountAmount(150, 20), 30);
});

test("calculates the discounted price", () => {
  assert.equal(calculateDiscountedPrice(150, 20), 120);
});

test("supports decimal prices and rates", () => {
  assert.ok(Math.abs(calculateDiscountAmount(99.9, 12.5) - 12.4875) < 1e-12);
  assert.ok(Math.abs(calculateDiscountedPrice(99.9, 12.5) - 87.4125) < 1e-12);
});

test("rejects non-finite calculation results", () => {
  assert.equal(calculateDiscountAmount(Number.MAX_VALUE, 100), null);
  assert.equal(calculateDiscountedPrice(Number.MAX_VALUE, 100), null);
});

test("validates positive reduction prices", () => {
  assert.equal(isValidReductionPrice(0.01), true);
  assert.equal(isValidReductionPrice(150), true);
  assert.equal(isValidReductionPrice(0), false);
  assert.equal(isValidReductionPrice(-1), false);
});

test("validates discount rates between 0 and 100", () => {
  assert.equal(isValidDiscountRate(0), true);
  assert.equal(isValidDiscountRate(100), true);
  assert.equal(isValidDiscountRate(-1), false);
  assert.equal(isValidDiscountRate(100.01), false);
});
