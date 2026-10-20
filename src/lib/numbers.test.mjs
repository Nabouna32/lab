import assert from "node:assert/strict";
import { test } from "node:test";
import { formatToolNumber, parseLocalizedNumber } from "./numbers.ts";

test("parses decimals in French and English", () => {
  assert.equal(parseLocalizedNumber("1234,56", "fr"), 1234.56);
  assert.equal(parseLocalizedNumber("1234.56", "fr"), 1234.56);
  assert.equal(parseLocalizedNumber("1234.56", "en"), 1234.56);
  assert.equal(parseLocalizedNumber("1234,56", "en"), 1234.56);
  assert.equal(parseLocalizedNumber(" 1234.56 ", "en"), 1234.56);
  assert.equal(parseLocalizedNumber("", "fr"), null);
  assert.equal(parseLocalizedNumber("not-a-number", "en"), null);
  assert.equal(parseLocalizedNumber("Infinity", "en"), null);
});

test("parses grouped values copied from localized results", () => {
  assert.equal(parseLocalizedNumber("1\u202f234,57", "fr"), 1234.57);
  assert.equal(parseLocalizedNumber("1\u00a0234,57", "fr"), 1234.57);
  assert.equal(parseLocalizedNumber("1,234.57", "en"), 1234.57);
  assert.equal(parseLocalizedNumber("1.234,57", "fr"), 1234.57);
  assert.equal(parseLocalizedNumber("1,234", "en"), 1234);
  assert.equal(parseLocalizedNumber("12,5", "en"), 12.5);
});

test("rejects malformed grouping and repeated decimal separators", () => {
  assert.equal(parseLocalizedNumber("12 34,56", "fr"), null);
  assert.equal(parseLocalizedNumber("1,23,4.5", "en"), null);
  assert.equal(parseLocalizedNumber("1.2.3", "en"), null);
  assert.equal(parseLocalizedNumber("1,234 567.89", "en"), null);
  assert.equal(parseLocalizedNumber("1 234,567.89", "fr"), null);
  assert.equal(parseLocalizedNumber("1,234\\u202f567.89", "en"), null);
});

test("formatToolNumber preserves the tool locale and precision", () => {
  assert.equal(formatToolNumber(1234.567, "fr", 2), "1 234,57");
  assert.equal(formatToolNumber(1234.567, "en", 2), "1,234.57");
  assert.equal(formatToolNumber(12.34567, "en", 4), "12.3457");
});
