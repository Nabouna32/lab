import assert from "node:assert/strict";
import { test as nodeTest } from "node:test";
import { consumePendingTextToolTransfer, writePendingTextToolTransfer } from "./text-transfer.ts";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

nodeTest("text handoff is bounded, local and consumed once", () => {
  const storage = createStorage();
  assert.equal(writePendingTextToolTransfer(storage, "  cleaned text\n"), true);
  assert.equal(consumePendingTextToolTransfer(storage), "  cleaned text\n");
  assert.equal(consumePendingTextToolTransfer(storage), null);
});

nodeTest("text handoff rejects empty and oversized content", () => {
  const storage = createStorage();
  assert.equal(writePendingTextToolTransfer(storage, "  \n"), false);
  assert.equal(writePendingTextToolTransfer(storage, "x".repeat(200_001)), false);
  assert.equal(consumePendingTextToolTransfer(storage), null);
});

nodeTest("text handoff rejects malformed, wrong-target and expired payloads", () => {
  const storage = createStorage();
  storage.setItem("loculary:text-tool-transfer:v1", JSON.stringify({
    target: "json-diff-checker", value: "text", createdAt: Date.now(),
  }));
  assert.equal(consumePendingTextToolTransfer(storage), null);

  storage.setItem("loculary:text-tool-transfer:v1", "{");
  assert.equal(consumePendingTextToolTransfer(storage), null);

  const originalNow = Date.now;
  try {
    Date.now = () => 1_000_000;
    storage.setItem("loculary:text-tool-transfer:v1", JSON.stringify({
      target: "text-diff-checker", value: "text", createdAt: 1_000_000 - 300_001,
    }));
    assert.equal(consumePendingTextToolTransfer(storage), null);
  } finally {
    Date.now = originalNow;
  }
});
