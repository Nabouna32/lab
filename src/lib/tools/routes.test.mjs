import assert from "node:assert/strict";
import { test } from "node:test";
import { getPublishedTools } from "./catalog.ts";
import {
  getCategoriesPath,
  getSearchResultsPagePath,
  getSearchResultsPath,
  getCategoryIdBySlug,
  getCategoryPath,
  getLocalizedPath,
  getToolIdBySlug,
  getToolPath,
  getToolSlug,
  getToolsPath,
} from "./routes.ts";

test("tool and category routes use distinct localized namespaces", () => {
  assert.equal(getToolsPath("en"), "/en/tools");
  assert.equal(getToolsPath("fr"), "/fr/outils");
  assert.equal(getSearchResultsPagePath("en"), "/en/search");
  assert.equal(getSearchResultsPagePath("fr"), "/fr/recherche");
  assert.equal(getSearchResultsPath("fr", "taille de fichier"), "/fr/recherche#q=taille%20de%20fichier");
  assert.equal(getSearchResultsPath("en", "json"), "/en/search#q=json");
  assert.equal(getCategoriesPath("en"), "/en/categories");
  assert.equal(getCategoriesPath("fr"), "/fr/categories");
  assert.equal(getCategoryPath("en", "development"), "/en/categories/development");
  assert.equal(getCategoryPath("fr", "development"), "/fr/categories/developpement");
  assert.equal(getToolPath("en", "json-formatter"), "/en/tools/json-formatter");
  assert.equal(getToolPath("fr", "json-formatter"), "/fr/outils/formateur-json");
});

test("published tool slugs are explicit and localized", () => {
  assert.equal(getToolSlug("fr", "number-base-converter"), "convertisseur-de-bases");
  assert.equal(getToolIdBySlug("en", "image-metadata-viewer"), "image-metadata");
  assert.equal(getToolIdBySlug("fr", "formateur-validateur-yaml"), "yaml-formatter-validator");
  assert.equal(getToolIdBySlug("fr", "comparateur-de-texte"), "text-diff-checker");
});

test("every published tool has a unique reversible slug in each locale", () => {
  const publishedTools = getPublishedTools();
  for (const locale of ["en", "fr"]) {
    const slugs = publishedTools.map((tool) => getToolSlug(locale, tool.id));
    assert.equal(new Set(slugs).size, slugs.length, `Tool slugs must be unique in ${locale}.`);
    for (const tool of publishedTools) {
      assert.equal(getToolIdBySlug(locale, getToolSlug(locale, tool.id)), tool.id);
    }
  }
});

test("localized paths resolve back to the same resource", () => {
  assert.equal(getCategoryIdBySlug("fr", "developpement"), "development");
  assert.equal(getLocalizedPath("/en/tools/json-formatter", "fr"), "/fr/outils/formateur-json");
  assert.equal(getLocalizedPath("/fr/outils/formateur-json", "en"), "/en/tools/json-formatter");
  assert.equal(getLocalizedPath("/en/categories/development", "fr"), "/fr/categories/developpement");
  assert.equal(getLocalizedPath("/fr/categories/developpement", "en"), "/en/categories/development");
  assert.equal(getLocalizedPath("/en/tools", "fr"), "/fr/outils");
  assert.equal(getLocalizedPath("/fr/recherche", "en"), "/en/search");
  assert.equal(getLocalizedPath("/en/search", "fr"), "/fr/recherche");
});

test("unknown tool and category routes fall back to the target locale root", () => {
  assert.equal(getLocalizedPath("/en/tools/unknown-tool", "fr"), "/fr");
  assert.equal(getLocalizedPath("/en/categories/unknown-category", "fr"), "/fr");
});

test("non-tool routes keep their suffix when switching locale", () => {
  assert.equal(getLocalizedPath("/en/compte", "fr"), "/fr/compte");
});
