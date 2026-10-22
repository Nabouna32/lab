import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categorySeoPolicy,
  getCategorySeoDescription,
  isCategorySeoIndexable,
} from "./category-policy.ts";

test("every current category has explicit, useful French and English descriptions", () => {
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
    assert.equal(typeof policy.indexable, "boolean", id);
    assert.ok(policy.description.fr.trim(), `${id}: French description is missing`);
    assert.ok(policy.description.en.trim(), `${id}: English description is missing`);
    assert.notEqual(policy.description.fr, `Retrouvez les outils disponibles dans la catégorie ${id}.`);
    assert.notEqual(policy.description.en, `Browse the tools available in the ${id}.`);
    assert.equal(getCategorySeoDescription("fr", id), policy.description.fr);
    assert.equal(getCategorySeoDescription("en", id), policy.description.en);
  }
});

test("a category needs an explicit positive editorial decision to be indexable", () => {
  assert.equal(isCategorySeoIndexable("video"), false);
  for (const id of ["calculations", "dates", "computing", "images", "files", "development"]) {
    assert.equal(isCategorySeoIndexable(id), true, id);
  }
  assert.equal(isCategorySeoIndexable("unknown-category"), false);
  assert.throws(() => getCategorySeoDescription("fr", "unknown-category"), /Missing SEO policy/);
});
