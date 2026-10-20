import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toolSearchSource = readFileSync(
  new URL("../../components/tools/ToolSearch.tsx", import.meta.url),
  "utf8",
);

test("ToolSearch debounces catalog filtering and cancels superseded work", () => {
  assert.match(toolSearchSource, /const SEARCH_DEBOUNCE_MS = 120;/);
  assert.match(toolSearchSource, /const timeoutId = window\.setTimeout\(\(\) => \{/);
  assert.match(toolSearchSource, /\}, SEARCH_DEBOUNCE_MS\);/);
  assert.match(toolSearchSource, /window\.clearTimeout\(timeoutId\);/);
  assert.match(toolSearchSource, /cancelled \|\| requestId !== searchRequest\.current/);
});
