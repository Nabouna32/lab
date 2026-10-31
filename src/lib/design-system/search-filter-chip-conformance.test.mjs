import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const searchResults = readFileSync(new URL("../../components/tools/SearchResultsClient.tsx", import.meta.url), "utf8");
const chip = readFileSync(new URL("../../components/ui/Chip.tsx", import.meta.url), "utf8");
const chipCss = readFileSync(new URL("../../components/ui/Chip.module.css", import.meta.url), "utf8");

test("les filtres de recherche utilisent le FilterChip partagé", () => {
  assert.ok(searchResults.includes('import { Chip } from "@/components/ui/Chip"'));
  assert.ok(searchResults.includes('variant="filter"'));
  assert.ok(searchResults.includes('selected={selectedCategory === null}'));
  assert.ok(searchResults.includes('leadingIcon={category.icon}'));
  assert.ok(!searchResults.includes("<button"));
  assert.ok(!searchResults.includes("MaterialIcon"));
});

test("le FilterChip conserve aria-pressed et les rôles de couleur AndroidX", () => {
  assert.ok(chip.includes("aria-pressed={filter || input ? selected : undefined}"));
  assert.ok(chipCss.includes(".filter { color: var(--on-surface-variant); }"));
  assert.ok(chipCss.includes(".filter:not(.selected) svg { color: var(--primary); }"));
  assert.ok(chipCss.includes("var(--on-secondary-container)"));
  assert.ok(chipCss.includes("var(--secondary-container)"));
  assert.ok(chipCss.includes(".filter { border-color: var(--outline-variant); color: var(--on-surface-variant); }"));
});
