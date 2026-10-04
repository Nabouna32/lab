import assert from "node:assert/strict";
import { test } from "node:test";
import { diffText, MAX_DIFF_LINES, splitLines } from "./text-diff.ts";

test("splitLines normalizes CRLF and keeps meaningful empty lines", () => {
  assert.deepEqual(splitLines("one\r\ntwo\rthree"), ["one", "two", "three"]);
  assert.deepEqual(splitLines("one\n\ntwo"), ["one", "", "two"]);
  assert.deepEqual(splitLines(""), []);
});

test("diffText reports additions, removals, and unchanged lines", () => {
  const result = diffText("one\ntwo\nthree", "one\nchanged\nthree\nfour");

  assert.equal(result.added, 2);
  assert.equal(result.removed, 1);
  assert.equal(result.unchanged, 2);
  assert.deepEqual(result.lines.map((line) => line.type), ["equal", "removed", "added", "equal", "added"]);
});

test("diffText handles empty inputs", () => {
  const result = diffText("", "one\ntwo");

  assert.equal(result.added, 2);
  assert.equal(result.removed, 0);
  assert.equal(result.unchanged, 0);
  assert.deepEqual(result.lines.map((line) => line.text), ["one", "two"]);
});

test("diffText rejects inputs that exceed the safety limit", () => {
  const large = Array.from({ length: MAX_DIFF_LINES + 1 }, (_, index) => String(index)).join("\n");
  assert.throws(() => diffText(large, ""), RangeError);
});
