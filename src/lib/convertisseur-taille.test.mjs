import assert from "node:assert/strict";
import test from "node:test";
import { convertFileSize } from "./convertisseur-taille.ts";

test("converts 1024 bytes to one kilobyte", () => {
  assert.equal(convertFileSize(1024, "o", "ko"), 1);
});

test("converts 1024 kilobytes to one megabyte", () => {
  assert.equal(convertFileSize(1024, "ko", "mo"), 1);
});

test("converts megabytes to gigabytes", () => {
  assert.equal(convertFileSize(1024, "mo", "go"), 1);
});

test("converts gigabytes to megabytes", () => {
  assert.equal(convertFileSize(1, "go", "mo"), 1024);
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
