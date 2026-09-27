import assert from "node:assert/strict";
import test from "node:test";
import { convertFileSize } from "./convertisseur-taille.ts";

test("uses decimal units for SI file sizes", () => {
  assert.equal(convertFileSize(1, "ko", "o"), 1_000);
  assert.equal(convertFileSize(1_000_000, "o", "mo"), 1);
  assert.equal(convertFileSize(1, "go", "mo"), 1_000);
});

test("uses binary units for IEC file sizes", () => {
  assert.equal(convertFileSize(1, "kio", "o"), 1_024);
  assert.equal(convertFileSize(1_048_576, "o", "mio"), 1);
  assert.equal(convertFileSize(1, "gio", "mio"), 1_024);
});

test("distinguishes decimal and binary units", () => {
  assert.equal(convertFileSize(1, "ko", "kio"), 1_000 / 1_024);
  assert.equal(convertFileSize(1, "kio", "ko"), 1_024 / 1_000);
});

test("keeps the value when source and target units match", () => {
  assert.equal(convertFileSize(12.5, "go", "go"), 12.5);
});

test("rejects negative values", () => {
  assert.throws(() => convertFileSize(-1, "mo", "go"), RangeError);
});

test("rejects non-finite values", () => {
  assert.throws(() => convertFileSize(Number.NaN, "mo", "go"), RangeError);
});


test("rejects unknown units at runtime", () => {
  assert.throws(() => convertFileSize(1, "ko", "unknown"), RangeError);
});


test("returns null when the result overflows the numeric range", () => {
  assert.equal(convertFileSize(Number.MAX_VALUE, "to", "o"), null);
});
