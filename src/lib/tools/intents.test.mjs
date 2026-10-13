import assert from "node:assert/strict";
import { test } from "node:test";
import { getPublishedTools } from "./catalog.ts";
import {
  getIntentDefinition,
  getToolsForIntent,
  intentDefinitions,
  intentIds,
  isIntentId,
} from "./intents.ts";

const publishedTools = getPublishedTools();

test("every stable intent ID has one non-empty curated definition", () => {
  assert.equal(new Set(intentIds).size, intentIds.length);
  assert.deepEqual(intentDefinitions.map((intent) => intent.id), [...intentIds]);

  for (const intent of intentDefinitions) {
    assert.ok(intent.toolIds.length > 0, `${intent.id} must have at least one tool`);
    assert.equal(new Set(intent.toolIds).size, intent.toolIds.length, `${intent.id} must not repeat tools`);
  }
});

test("every intent association resolves to a published tool", () => {
  const publishedIds = new Set(publishedTools.map((tool) => tool.id));

  for (const intent of intentDefinitions) {
    for (const toolId of intent.toolIds) {
      assert.ok(publishedIds.has(toolId), `${intent.id} references missing or unpublished tool ${toolId}`);
    }
    assert.deepEqual(
      getToolsForIntent(intent.id, publishedTools).map((tool) => tool.id),
      [...intent.toolIds],
      `${intent.id} should preserve its curated order and include every target`,
    );
  }
});

test("an intent can span multiple categories instead of resolving to one category", () => {
  const calculationTools = getToolsForIntent("calculate", publishedTools);
  const categories = new Set(calculationTools.flatMap((tool) => tool.categories));

  assert.ok(calculationTools.length > 1);
  assert.ok(categories.size > 1, "calculate should include tools from more than one category");
  assert.ok(calculationTools.some((tool) => tool.id === "percentage"));
  assert.ok(calculationTools.some((tool) => tool.id === "ip-subnet-calculator"));
});

test("intent lookup is stable and unknown IDs are rejected", () => {
  assert.equal(isIntentId("calculate"), true);
  assert.equal(isIntentId("not-an-intent"), false);
  assert.equal(isIntentId(undefined), false);
  assert.equal(getIntentDefinition("convert").id, "convert");
});
