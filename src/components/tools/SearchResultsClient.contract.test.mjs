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
  assert.ok(component.includes("const availableCategories = categories.filter"));
  assert.ok(component.includes("const filteredResults = selectedCategory"));
  assert.ok(component.includes("aria-pressed={selectedCategory === category.id}"));
  assert.ok(component.includes("{filteredResults.map(({ tool }) =>"));
  assert.ok(component.includes("formatPlural(locale, filteredResults.length"));
  assert.match(messages, /filterByCategory: "Filtrer par catégorie"/);
  assert.match(messages, /filterByCategory: "Filter by category"/);
  assert.match(messages, /allCategories: "Toutes"/);
  assert.match(messages, /allCategories: "All"/);
});
