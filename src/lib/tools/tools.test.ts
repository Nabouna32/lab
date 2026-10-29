import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getPublishedTools } from "./catalog.ts";

const materialIconSource = readFileSync(
  new URL("../../components/ui/MaterialIcon.tsx", import.meta.url),
  "utf8",
);

test("every published tool references an icon in the shared Material Symbols registry", () => {
  const tools = getPublishedTools();
  assert.ok(tools.length > 0, "the published catalog should not be empty");

  for (const tool of tools) {
    assert.match(tool.icon, /^[a-z][a-z0-9_]*$/, `${tool.id} must use a Material Symbols identifier`);
    assert.ok(
      materialIconSource.includes(`  ${tool.icon}: "`),
      `${tool.id} references an icon absent from the shared registry: ${tool.icon}`,
    );
  }
});
