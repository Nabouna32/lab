import assert from "node:assert/strict";
import test from "node:test";
import { buildPublicSeoInventory } from "./inventory-core.ts";

test("builds reciprocal localized SEO entries for the legal notice", () => {
  const pages = buildPublicSeoInventory(["fr", "en"], [
    {
      id: "legal-notice",
      paths: {
        fr: "/fr/mentions-legales",
        en: "/en/legal-notice",
      },
    },
  ]);

  assert.equal(pages.length, 2);
  assert.deepEqual(
    pages.map(({ locale, path }) => ({ locale, path })),
    [
      { locale: "fr", path: "/fr/mentions-legales" },
      { locale: "en", path: "/en/legal-notice" },
    ],
  );
  assert.deepEqual(pages[0].localizedPaths, {
    fr: "/fr/mentions-legales",
    en: "/en/legal-notice",
  });
  assert.deepEqual(pages[1].localizedPaths, pages[0].localizedPaths);
});
