import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const component = readFileSync(new URL("./SearchResultsClient.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../lib/i18n/messages.ts", import.meta.url), "utf8");

test("empty search page offers the localized quick-start tools instead of a blank area", () => {
  assert.match(component, /!query \? \([\s\S]*?search-results-start-title/);
  assert.match(component, /suggestedTools\.map\(\(tool\) =>/);
  assert.match(component, /getPublishedTools\(\)/);
  assert.match(messages, /searchLandingTitle: "Pour commencer"/);
  assert.match(messages, /searchLandingTitle: "Start with a popular task"/);
  assert.match(messages, /searchLandingDescription:/);
});


test("search results expose localized category filters and keep filtered counts aligned", () => {
  assert.match(component, /const availableCategories = categories\\.filter/);
  assert.match(component, /const filteredResults = selectedCategory/);
  assert.match(component, /aria-pressed=\\{selectedCategory === category\\.id\\}/);
  assert.match(component, /\\{filteredResults\\.map\\(\\(\\{ tool \\}\\) =>/);
  assert.match(component, /filterByCategory: string/);
  assert.match(messages, /filterByCategory: "Filtrer par catégorie"/);
  assert.match(messages, /filterByCategory: "Filter by category"/);
  assert.match(messages, /allCategories: "Toutes"/);
  assert.match(messages, /allCategories: "All"/);
});
