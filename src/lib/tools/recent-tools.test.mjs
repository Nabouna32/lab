import assert from "node:assert/strict";
import test from "node:test";
import { MAX_RECENT_TOOLS, recordRecentTool } from "./recent-tools.ts";

const validIds = ["age", "discount", "vat", "percentage", "uuid-generator", "unit-converter", "duration"];

test("records a tool first, de-duplicates it, and keeps most recent order", () => {
  assert.deepEqual(recordRecentTool(["age", "vat", "discount"], "vat", validIds), [
    "vat", "age", "discount",
  ]);
  assert.deepEqual(recordRecentTool(["age", "vat"], "percentage", validIds), [
    "percentage", "age", "vat",
  ]);
});

test("drops invalid IDs and keeps at most five valid tools", () => {
  const history = recordRecentTool(
    ["unknown", "age", "vat", "discount", "percentage", "uuid-generator"],
    "duration",
    validIds,
  );
  assert.equal(history.length, MAX_RECENT_TOOLS);
  assert.deepEqual(history, ["duration", "age", "vat", "discount", "percentage"]);
});

test("ignores an unknown current tool ID without losing valid history", () => {
  assert.deepEqual(recordRecentTool(["age", "unknown"], "unknown", validIds), ["age"]);
});
