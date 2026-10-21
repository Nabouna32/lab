import assert from "node:assert/strict";
import { test } from "node:test";
import { consumePendingJsonComparison, writePendingJsonComparison } from "./json-transfer.ts";

const key = "loculary:json-comparison-transfer:v1";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => values.set(name, String(value)),
    removeItem: (name) => values.delete(name),
  };
}

test("writes valid JSON for a same-tab handoff", () => {
  const storage = createStorage();
  assert.equal(writePendingJsonComparison(storage, '{ "ready": true }'), true);
  assert.equal(storage.values.get(key), '{ "ready": true }');
});

test("rejects invalid, empty, and oversized JSON before storing", () => {
  const storage = createStorage();
  assert.equal(writePendingJsonComparison(storage, ""), false);
  assert.equal(writePendingJsonComparison(storage, "{broken"), false);
  assert.equal(writePendingJsonComparison(storage, JSON.stringify("x".repeat(200_001))), false);
  assert.equal(storage.values.has(key), false);
});

test("consumes valid JSON exactly once and removes it from storage", () => {
  const storage = createStorage({ [key]: '{ "value": 42 }' });
  assert.equal(consumePendingJsonComparison(storage), '{ "value": 42 }');
  assert.equal(storage.values.has(key), false);
  assert.equal(consumePendingJsonComparison(storage), null);
});

test("removes invalid or oversized pending content without returning it", () => {
  for (const value of ["not JSON", JSON.stringify("x".repeat(200_001))]) {
    const storage = createStorage({ [key]: value });
    assert.equal(consumePendingJsonComparison(storage), null);
    assert.equal(storage.values.has(key), false);
  }
});

test("fails closed when session storage cannot be read or written", () => {
  const blockedStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  };
  assert.equal(writePendingJsonComparison(blockedStorage, '{"ok":true}'), false);
  assert.equal(consumePendingJsonComparison(blockedStorage), null);
});
