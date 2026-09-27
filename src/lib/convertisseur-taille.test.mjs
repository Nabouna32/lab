import assert from "node:assert/strict";
import test from "node:test";
import { convertFileSize } from "./convertisseur-taille.ts";

test("converts megabytes to gigabytes", () => {
  assert.equal(convertFileSize(1000, "mo", "go"), 1);
});

test("converts gigabytes to megabytes", () => {
  assert.equal(convertFileSize(1, "go", "mo"), 1000);
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
