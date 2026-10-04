import test from "node:test";
import assert from "node:assert/strict";
import { convertNumber, formatNumber, isValidBase, parseNumber } from "./number-base-converter.ts";

test("converts hexadecimal to decimal", () => {
  assert.equal(convertNumber("FF", 16, 10), "255");
});

test("converts decimal to binary", () => {
  assert.equal(convertNumber("255", 10, 2), "11111111");
});

test("supports negative integers", () => {
  assert.equal(convertNumber("-101", 2, 16), "-5");
});

test("supports arbitrary precision integers", () => {
  assert.equal(convertNumber("123456789012345678901234567890", 10, 16), "18EE90FF6C373E0EE4E3F0AD2");
});

test("supports bases from 2 through 36", () => {
  assert.equal(convertNumber("Z", 36, 10), "35");
  assert.equal(convertNumber("35", 10, 36), "Z");
});

test("rejects invalid digits", () => {
  assert.equal(parseNumber("102", 2), null);
  assert.equal(convertNumber("1G", 16, 10), null);
});

test("rejects invalid input and bases", () => {
  assert.equal(parseNumber("", 10), null);
  assert.equal(parseNumber("12.5", 10), null);
  assert.equal(parseNumber("+", 10), null);
  assert.equal(parseNumber("10", 1), null);
  assert.equal(parseNumber("10", 37), null);
  assert.equal(isValidBase(2), true);
  assert.equal(isValidBase(36), true);
  assert.equal(isValidBase(1), false);
  assert.equal(isValidBase(37), false);
});

test("formats zero and preserves uppercase digits", () => {
  assert.equal(formatNumber(0n, 2), "0");
  assert.equal(formatNumber(255n, 16), "FF");
});
