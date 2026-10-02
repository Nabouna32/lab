import assert from "node:assert/strict";
import { test } from "node:test";
import { generateUuids } from "./uuid.ts";

test("generates the requested number of UUID v4 values", () => {
  const values = generateUuids(5);
  assert.equal(values.length, 5);
  assert.equal(new Set(values).size, 5);
  for (const value of values) assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

test("rejects counts outside the supported range", () => {
  assert.throws(() => generateUuids(0), RangeError);
  assert.throws(() => generateUuids(51), RangeError);
  assert.throws(() => generateUuids(1.5), RangeError);
  assert.equal(generateUuids(1).length, 1);
  assert.equal(generateUuids(50).length, 50);
});
