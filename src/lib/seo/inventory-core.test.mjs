import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPublicSeoInventory } from "./inventory-core.ts";

test("builds one entry per available locale and keeps only real alternate paths", () => {
  const pages = buildPublicSeoInventory(["en", "fr"], [
    { id: "tool:date", paths: { en: "/en/tools/date-calculator", fr: "/fr/outils/calculateur-de-date" } },
    { id: "article:english-only", paths: { en: "/en/notes" } },
  ]);

  assert.deepEqual(
    pages.map(({ id, locale, path, localizedPaths }) => ({ id, locale, path, localizedPaths })),
    [
      {
        id: "tool:date",
        locale: "en",
        path: "/en/tools/date-calculator",
        localizedPaths: { en: "/en/tools/date-calculator", fr: "/fr/outils/calculateur-de-date" },
      },
      {
        id: "tool:date",
        locale: "fr",
        path: "/fr/outils/calculateur-de-date",
        localizedPaths: { en: "/en/tools/date-calculator", fr: "/fr/outils/calculateur-de-date" },
      },
      {
        id: "article:english-only",
        locale: "en",
        path: "/en/notes",
        localizedPaths: { en: "/en/notes" },
      },
    ],
  );
});

test("rejects duplicate resource identifiers and duplicate canonical paths", () => {
  assert.throws(
    () => buildPublicSeoInventory(["en"], [
      { id: "home", paths: { en: "/en" } },
      { id: "home", paths: { en: "/en/other" } },
    ]),
    /Duplicate SEO resource id/,
  );

  assert.throws(
    () => buildPublicSeoInventory(["en"], [
      { id: "home", paths: { en: "/en" } },
      { id: "tools", paths: { en: "/en" } },
    ]),
    /shared by/,
  );
});

test("rejects malformed paths, unsupported locales, and empty resources", () => {
  assert.throws(
    () => buildPublicSeoInventory(["en"], [{ id: "bad", paths: { en: "/en?intent=dates" } }]),
    /Invalid canonical path/,
  );
  assert.throws(
    () => buildPublicSeoInventory(["en"], [{ id: "bad", paths: { de: "/de" } }]),
    /unsupported locale/,
  );
  assert.throws(
    () => buildPublicSeoInventory(["en"], [{ id: "empty", paths: {} }]),
    /no localized paths/,
  );
});
