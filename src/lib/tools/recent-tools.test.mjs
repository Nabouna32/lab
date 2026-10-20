import assert from "node:assert/strict";
import test from "node:test";
import { MAX_RECENT_TOOLS, parseRecentToolIds, recordRecentTool } from "./recent-tools.ts";

const validIds = ["age", "discount", "vat", "percentage", "uuid-generator", "unit-converter", "duration"];

test("parses only known tool IDs and removes duplicates", () => {
  assert.deepEqual(
    parseRecentToolIds(JSON.stringify(["age", "unknown", "age", 42, "vat"]), validIds),
    ["age", "vat"],
  );
});

test("handles malformed or non-array storage without throwing", () => {
  assert.deepEqual(parseRecentToolIds("{broken", validIds), []);
  assert.deepEqual(parseRecentToolIds(JSON.stringify({ tool: "age" }), validIds), []);
  assert.deepEqual(parseRecentToolIds(null, validIds), []);
});

test("records a tool first, de-duplicates it, and keeps most recent order", () => {
  assert.deepEqual(recordRecentTool(["age", "vat", "discount"], "vat", validIds), ["vat", "age", "discount"]);
  assert.deepEqual(recordRecentTool(["age", "vat"], "percentage", validIds), ["percentage", "age", "vat"]);
});

test("caps history to five valid tools", () => {
  const history = recordRecentTool(["age", "vat", "discount", "percentage", "uuid-generator"], "duration", validIds);
  assert.equal(history.length, MAX_RECENT_TOOLS);
  assert.deepEqual(history, ["duration", "age", "vat", "discount", "percentage"]);
});

test("ignores an unknown current tool ID", () => {
  assert.deepEqual(recordRecentTool(["age"], "unknown", validIds), ["age"]);
});
