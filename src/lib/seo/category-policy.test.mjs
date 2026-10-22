import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categorySeoPolicy,
  excludedCategorySeoReasons,
  getCategorySeoDescription,
  isCategorySeoIndexable,
} from "./category-policy.ts";

test("every current category has useful French and English descriptions", () => {
  assert.deepEqual(Object.keys(categorySeoPolicy).sort(), [
    "calculations",
    "computing",
    "dates",
    "development",
    "files",
    "images",
    "video",
  ]);

  for (const [id, policy] of Object.entries(categorySeoPolicy)) {
    assert.ok(policy.description.fr.trim(), `${id}: French description is missing`);
    assert.ok(policy.description.en.trim(), `${id}: English description is missing`);
    assert.notEqual(policy.description.fr, `Retrouvez les outils disponibles dans la catégorie ${id}.`);
    assert.notEqual(policy.description.en, `Browse the tools available in the ${id}.`);
    assert.equal(getCategorySeoDescription("fr", id), policy.description.fr);
    assert.equal(getCategorySeoDescription("en", id), policy.description.en);
  }
});

test("categories with localized editorial content are indexable by default", () => {
  for (const id of Object.keys(categorySeoPolicy)) {
    assert.equal(isCategorySeoIndexable(id), true, id);
  }
  assert.equal(isCategorySeoIndexable("unknown-category"), false);
  assert.throws(() => getCategorySeoDescription("fr", "unknown-category"), /Missing SEO policy/);
});

test("explicit exclusions are exceptional and carry an editorial reason", () => {
  for (const [id, reason] of Object.entries(excludedCategorySeoReasons)) {
    assert.ok(categorySeoPolicy[id], `${id}: excluded category needs localized SEO copy`);
    assert.ok(reason.trim(), `${id}: exclusion reason is missing`);
    assert.equal(isCategorySeoIndexable(id), false, id);
  }
});