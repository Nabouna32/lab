import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getCategoryIdBySlug,
  getCategoryPath,
  getLocalizedPath,
  getToolPath,
  getToolSlug,
  getToolsPath,
} from "./routes.ts";

test("English is the reference public URL convention", () => {
  assert.equal(getToolsPath("en"), "/en/tools");
  assert.equal(getCategoryPath("en", "development"), "/en/tools/development");
  assert.equal(getToolPath("en", "development", "json-formatter"), "/en/tools/development/json-formatter");
});

test("French public URLs are fully localized", () => {
  assert.equal(getToolsPath("fr"), "/fr/outils");
  assert.equal(getCategoryPath("fr", "development"), "/fr/outils/developpement");
  assert.equal(getToolSlug("fr", "json-formatter"), "formateur-json");
  assert.equal(getToolSlug("fr", "number-base-converter"), "convertisseur-de-bases");
  assert.equal(getToolPath("en", "development", "number-base-converter"), "/en/tools/development/number-base-converter");
  assert.equal(
    getToolPath("fr", "calculations", "percentage"),
    "/fr/outils/calculs/calculateur-de-pourcentage",
  );
});

test("localized paths resolve back to the same resource", () => {
  assert.equal(getCategoryIdBySlug("fr", "developpement"), "development");
  assert.equal(
    getLocalizedPath("/en/tools/development/json-formatter", "fr"),
    "/fr/outils/developpement/formateur-json",
  );
  assert.equal(
    getLocalizedPath("/fr/outils/developpement/formateur-json", "en"),
    "/en/tools/development/json-formatter",
  );
  assert.equal(getLocalizedPath("/en/tools", "fr"), "/fr/outils");
});

test("non-tool routes keep their suffix when switching locale", () => {
  assert.equal(getLocalizedPath("/en/compte", "fr"), "/fr/compte");
});
