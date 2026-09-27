import assert from "node:assert/strict";
import { test } from "node:test";
import { formatToolNumber, parseLocalizedNumber } from "./numbers.ts";

test("parseLocalizedNumber parses localized decimal input", () => {
  assert.equal(parseLocalizedNumber("1234,56"), 1234.56);
  assert.equal(parseLocalizedNumber(" 1234.56 "), 1234.56);
  assert.equal(parseLocalizedNumber(""), null);
  assert.equal(parseLocalizedNumber("not-a-number"), null);
  assert.equal(parseLocalizedNumber("Infinity"), null);
});

test("formatToolNumber preserves the tool locale and precision", () => {
  assert.equal(formatToolNumber(1234.567, "fr", 2), "1 234,57");
  assert.equal(formatToolNumber(1234.567, "en", 2), "1,234.57");
  assert.equal(formatToolNumber(12.34567, "en", 4), "12.3457");
});
