import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getAllTools,
  getPublishedTools,
  getToolById,
  getToolsByCategory,
} from "./catalog.ts";

test("catalog access returns the current tool definitions", () => {
  const allTools = getAllTools();

  assert.ok(allTools.length > 0);
  assert.ok(getToolById("percentage"));
  assert.ok(getPublishedTools().every((tool) => tool.lifecycle === "published"));
});

test("catalog access filters published tools by category", () => {
  const tools = getToolsByCategory("calculations");

  assert.ok(tools.length > 0);
  assert.ok(tools.every((tool) => tool.lifecycle === "published"));
  assert.ok(tools.every((tool) => tool.categories.includes("calculations")));
});
