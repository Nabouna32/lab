import assert from "node:assert/strict";
import { test } from "node:test";
import { compareJsonDocuments, JsonDiffError } from "./json-diff.ts";

test("ignores whitespace and object key order", () => {
  const result = compareJsonDocuments(
    '{ "name": "Loculary", "settings": { "dark": true, "count": 2 } }',
    '{ "settings": { "count": 2, "dark": true }, "name": "Loculary" }',
  );
  assert.equal(result.identical, true);
  assert.deepEqual(result.changes, []);
});

test("reports added, removed, and changed values with stable paths", () => {
  const result = compareJsonDocuments(
    '{"name":"old","count":2,"obsolete":true}',
    '{"name":"new","count":2,"active":false}',
  );
  assert.deepEqual(result.changes, [
    { path: '$["name"]', kind: "changed", before: "old", after: "new" },
    { path: '$["obsolete"]', kind: "removed", before: true },
    { path: '$["active"]', kind: "added", after: false },
  ]);
});

test("compares arrays by index and reports length changes", () => {
  const result = compareJsonDocuments("[1,2]", "[1,3,4]");
  assert.deepEqual(result.changes, [
    { path: "$[1]", kind: "changed", before: 2, after: 3 },
    { path: "$[2]", kind: "added", after: 4 },
  ]);
});

test("treats a change in JSON value type as a replacement", () => {
  const result = compareJsonDocuments('{"value":null}', '{"value":0}');
  assert.deepEqual(result.changes, [
    { path: '$["value"]', kind: "changed", before: null, after: 0 },
  ]);
});

test("rejects invalid JSON and oversized inputs with typed errors", () => {
  assert.throws(() => compareJsonDocuments("{", "{}"),
    (error) => error instanceof JsonDiffError && error.code === "invalid-json");
  assert.throws(() => compareJsonDocuments("x".repeat(200_001), "{}"),
    (error) => error instanceof JsonDiffError && error.code === "input-too-large");
});

test("bounds deeply nested comparisons", () => {
  const nested = '{"a":'.repeat(82) + "0" + "}".repeat(82);
  assert.throws(() => compareJsonDocuments(nested, nested),
    (error) => error instanceof JsonDiffError && error.code === "depth-limit");
});

test("caps large differences and marks the result as truncated", () => {
  const left = JSON.stringify(Object.fromEntries(Array.from({ length: 520 }, (_, i) => ["k" + i, i])));
  const result = compareJsonDocuments(left, "{}");
  assert.equal(result.changes.length, 500);
  assert.equal(result.truncated, true);
});
