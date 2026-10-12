import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const clientSource = readFileSync(fileURLToPath(new URL("./SearchResultsClient.tsx", import.meta.url)), "utf8");
const englishRoute = readFileSync(fileURLToPath(new URL("../../app/[locale]/search/page.tsx", import.meta.url)), "utf8");
const frenchRoute = readFileSync(fileURLToPath(new URL("../../app/[locale]/recherche/page.tsx", import.meta.url)), "utf8");
const pageSource = readFileSync(fileURLToPath(new URL("./SearchResultsPage.tsx", import.meta.url)), "utf8");

test("localized search routes share the existing search page and validate their locale", () => {
  assert.match(englishRoute, /locale === "en" \? getSearchResultsMetadata\("en"\) : \{\}/);
  assert.match(englishRoute, /if \(locale !== "en"\) notFound\(\)/);
  assert.match(frenchRoute, /locale === "fr" \? getSearchResultsMetadata\("fr"\) : \{\}/);
  assert.match(frenchRoute, /if \(locale !== "fr"\) notFound\(\)/);
  assert.match(englishRoute, /<SearchResultsPage locale="en" \/>/);
  assert.match(frenchRoute, /<SearchResultsPage locale="fr" \/>/);
  assert.match(pageSource, /robots: \{ index: false, follow: true \}/);
  assert.match(pageSource, /getSearchResultsPagePath\(availableLocale\)/);
});

test("search page remains usable without a fragment and syncs query history", () => {
  assert.match(clientSource, /<ToolSearch[\s\S]*?initialQuery=\{query\}/);
  assert.match(clientSource, /if \(!nextQuery\) \{\s*setQuery\("\")/);
});
