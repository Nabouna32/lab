import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const component = readFileSync(new URL("./JsonDiffChecker.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");

test("JSON diff results can be filtered by change kind and searched by JSON path", () => {
  assert.ok(component.includes('useState<"all" | JsonDiffChange["kind"]>("all")'));
  assert.ok(component.includes('type="search"'));
  assert.ok(component.includes('change.path.toLocaleLowerCase().includes(pathQuery.trim().toLocaleLowerCase())'));
  assert.ok(component.includes('aria-pressed={changeFilter === filter}'));
  assert.ok(component.includes("filteredChanges.map((change) => <ChangeCard"));
  assert.ok(component.includes("createReport(filteredResult, t)"));
});

test("JSON diff explorer exposes localized summaries, filters, and empty states", () => {
  assert.ok(messages.includes('summary: "Résumé des changements"'));
  assert.ok(messages.includes('summary: "Change summary"'));
  assert.ok(messages.includes('searchPath: "Rechercher un chemin JSON"'));
  assert.ok(messages.includes('searchPath: "Search JSON path"'));
  assert.ok(messages.includes('noMatchingChanges: "Aucun changement ne correspond à ces filtres."'));
  assert.ok(messages.includes('noMatchingChanges: "No changes match these filters."'));
});
