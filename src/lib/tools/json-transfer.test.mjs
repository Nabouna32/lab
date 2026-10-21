import assert from "node:assert/strict";
import { test } from "node:test";
import { consumePendingJsonComparison, consumePendingJsonToolTransfer, writePendingJsonComparison, writePendingJsonToolTransfer } from "./json-transfer.ts";

const key = "loculary:json-tool-transfer:v2";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => values.set(name, String(value)),
    removeItem: (name) => values.delete(name),
  };
}

test("writes valid JSON with an explicit same-tab destination", () => {
  const storage = createStorage();
  assert.equal(writePendingJsonToolTransfer(storage, '{ "ready": true }', "json-to-typescript"), true);
  const transfer = JSON.parse(storage.values.get(key));
  assert.equal(transfer.target, "json-to-typescript");
  assert.equal(transfer.value, '{ "ready": true }');
});

test("rejects invalid, empty, and oversized JSON before storing", () => {
  const storage = createStorage();
  assert.equal(writePendingJsonToolTransfer(storage, "", "json-diff-checker"), false);
  assert.equal(writePendingJsonToolTransfer(storage, "{broken", "json-diff-checker"), false);
  assert.equal(writePendingJsonToolTransfer(storage, JSON.stringify("x".repeat(200_001)), "json-diff-checker"), false);
  assert.equal(storage.values.has(key), false);
});

test("consumes valid JSON exactly once and only for the intended destination", () => {
  const storage = createStorage();
  assert.equal(writePendingJsonToolTransfer(storage, '{ "value": 42 }', "json-diff-checker"), true);
  assert.equal(consumePendingJsonToolTransfer(storage, "json-to-typescript"), null);
  assert.equal(storage.values.has(key), false);
  assert.equal(consumePendingJsonToolTransfer(storage, "json-diff-checker"), null);
});

test("legacy comparison helpers use the generalized one-time transfer", () => {
  const storage = createStorage();
  assert.equal(writePendingJsonComparison(storage, '{ "value": 42 }'), true);
  assert.equal(consumePendingJsonComparison(storage), '{ "value": 42 }');
  assert.equal(storage.values.has(key), false);
});

test("removes malformed, invalid, oversized, and expired transfers without returning content", () => {
  const values = [
    "not JSON",
    JSON.stringify({ target: "json-diff-checker", value: "not JSON", createdAt: Date.now() }),
    JSON.stringify({ target: "json-diff-checker", value: JSON.stringify("x".repeat(200_001)), createdAt: Date.now() }),
    JSON.stringify({ target: "json-diff-checker", value: '{"ok":true}', createdAt: Date.now() - 6 * 60 * 1000 }),
  ];
  for (const value of values) {
    const storage = createStorage({ [key]: value });
    assert.equal(consumePendingJsonToolTransfer(storage, "json-diff-checker"), null);
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
