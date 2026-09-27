import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateHt,
  calculateTtc,
  calculateVatAmount,
  isValidVatRate,
} from "./tva.ts";

test("calculates TTC from HT", () => {
  assert.ok(Math.abs(calculateTtc(100, 20) - 120) < 1e-10);
});

test("calculates HT from TTC", () => {
  assert.ok(Math.abs(calculateHt(120, 20) - 100) < 1e-10);
});

test("calculates VAT amount", () => {
  assert.ok(Math.abs(calculateVatAmount(150, 20) - 30) < 1e-10);
});

test("rejects non-finite calculation results", () => {
  assert.equal(calculateTtc(Number.MAX_VALUE, 100), null);
  assert.equal(calculateHt(Number.MAX_VALUE, 100), null);
  assert.equal(calculateVatAmount(Number.MAX_VALUE, 100), null);
});

test("accepts VAT rates from 0 to 100", () => {
  assert.equal(isValidVatRate(0), true);
  assert.equal(isValidVatRate(20), true);
  assert.equal(isValidVatRate(100), true);
  assert.equal(isValidVatRate(-1), false);
  assert.equal(isValidVatRate(101), false);
  assert.equal(isValidVatRate(Number.NaN), false);
});
