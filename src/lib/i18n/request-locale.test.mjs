import test from "node:test";
import assert from "node:assert/strict";
import { getPreferredLocale } from "./request-locale.ts";

test("uses English when Accept-Language is missing", () => {
  assert.equal(getPreferredLocale(null), "en");
});

test("prefers French for a French browser", () => {
  assert.equal(getPreferredLocale("fr-FR,fr;q=0.9,en;q=0.8"), "fr");
});

test("recognizes regional English locales", () => {
  assert.equal(getPreferredLocale("en-US,en;q=0.9"), "en");
});

test("uses the highest-quality supported language", () => {
  assert.equal(getPreferredLocale("de-DE,de;q=0.8,fr-FR;q=0.7,en;q=0.6"), "fr");
});

test("ignores languages explicitly disabled with q=0", () => {
  assert.equal(getPreferredLocale("fr-FR;q=0,en-US;q=0.8"), "en");
});

test("falls back to English for unsupported languages", () => {
  assert.equal(getPreferredLocale("de-DE,de;q=0.9"), "en");
});
