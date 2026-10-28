import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const clientSource = readFileSync(fileURLToPath(new URL("./SearchResultsClient.tsx", import.meta.url)), "utf8").replace(/\r\n/g, "\n");
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

test("search result count, loading and errors are announced through one live status", () => {
  assert.match(
    clientSource,
    /<p role="status" aria-live="polite" aria-atomic="true" className="m3-type-label-large mt-4 text-\[var\(--muted\)\]">\s*\{isSearching \? t\.tools\.searching : searchError \? t\.tools\.searchError : formatPlural/,
  );
  assert.match(clientSource, /<p className="m3-type-body-medium text-\\[var\\(--foreground\\)\\]">\\{t\\.tools\\.searching\\}<\\/p>/);
  assert.doesNotMatch(clientSource, /<section[^>]*role="status">/);
});

test("search page remains usable without a fragment and syncs query history", () => {
  assert.match(clientSource, /<ToolSearch[\s\S]*?initialQuery=\{query\}/);
  assert.ok(clientSource.includes('if (!nextQuery) {\n        requestId.current += 1;\n        setQuery("");'));
  assert.match(clientSource, /addEventListener\("hashchange", syncFromHash\)/);
  assert.match(clientSource, /addEventListener\("popstate", syncFromHash\)/);
});
