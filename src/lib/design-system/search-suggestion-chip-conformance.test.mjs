import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toolSearch = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");
const chip = readFileSync(new URL("../../components/ui/Chip.tsx", import.meta.url), "utf8");
const chipCss = readFileSync(new URL("../../components/ui/Chip.module.css", import.meta.url), "utf8");

test("les suggestions dynamiques de recherche utilisent le SuggestionChip partagé", () => {
  assert.ok(toolSearch.includes('import { Chip } from "@/components/ui/Chip"'));
  assert.match(toolSearch, /noResultsSuggestions\.map\(\(suggestion\) => \([\s\S]*?variant="suggestion"[\s\S]*?label=\{suggestion\}/);
  assert.match(toolSearch, /variant="suggestion"[\s\S]*?onMouseDown=\{\(event\) => event\.preventDefault\(\)\}/);
  assert.match(toolSearch, /setQuery\(suggestion\)[\s\S]*?setActiveIndex\(-1\)[\s\S]*?inputRef\.current\?\.focus\(\)/);
  assert.match(toolSearch, /variant="suggestion"[\s\S]*?className="min-h-10"/);
});

test("SuggestionChip reste une action native non sélectionnable avec les rôles AndroidX", () => {
  assert.ok(chip.includes('type={props.type ?? "button"}'));
  assert.ok(chip.includes("aria-pressed={filter || input ? selected : undefined}"));
  assert.ok(chipCss.includes(".suggestion,.elevated-suggestion { border-color: var(--outline-variant); color: var(--on-surface-variant); }"));
});
