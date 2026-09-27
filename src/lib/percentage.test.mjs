import assert from "node:assert/strict";
import { test } from "node:test";

import {
  calculateDifference,
  calculateEvolution,
  calculatePercentage,
} from "./percentage.ts";

test("calculates a percentage of a value", () => {
  assert.equal(calculatePercentage(20, 150), 30);
  assert.equal(calculatePercentage(12.5, 80), 10);
});

test("rejects non-finite percentage results", () => {
  assert.equal(calculatePercentage(Number.MAX_VALUE, Number.MAX_VALUE), null);
  assert.equal(calculateEvolution(Number.MAX_VALUE, -Number.MAX_VALUE), null);
});

test("calculates percentage evolution", () => {
  assert.equal(calculateEvolution(120, 100), 20);
  assert.equal(calculateEvolution(80, 100), -20);
  assert.equal(calculateEvolution(100, 100), 0);
});

test("rejects percentage evolution from zero", () => {
  assert.equal(calculateEvolution(100, 0), null);
});

test("calculates percentage difference from the average", () => {
  assert.equal(calculateDifference(100, 120), (20 / 110) * 100);
  assert.equal(calculateDifference(-100, 120), (220 / 110) * 100);
});

test("rejects percentage difference when both values are zero", () => {
  assert.equal(calculateDifference(0, 0), null);
});
