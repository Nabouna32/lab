import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(fileURLToPath(new URL(path, root)), "utf8");

test("each localized tool SEO record has an explicit indexability decision", async () => {
  const source = await read("../lib/tools/seo.ts");
  const records = [...source.matchAll(/(?:fr|en): \{ title: "[^"]+", description: "[^"]*", indexable: (?:true|false) \}/g)];
  assert.equal(records.length, 102);
});

test("indexability is enforced by the catalog and reflected in page metadata", async () => {
  const validator = await read("../lib/tools/metadata.ts");
  const metadata = await read("../lib/tools/page-metadata.ts");
  const inventory = await read("seo/public-pages.ts");

  assert.match(validator, /must explicitly declare .* SEO indexability/);
  assert.match(metadata, /seo\.indexable \? metadata : \{ \.\.\.metadata, robots: \{ index: false, follow: true \} \}/);
  assert.match(inventory, /\.filter\(\(locale\) => tool\.seo\[locale\]\.indexable\)/);
});

test("category descriptions and indexability come from the same editorial policy", async () => {
  const route = await read("../app/[locale]/[section]/[slug]/page.tsx");
  const inventory = await read("seo/public-pages.ts");

  assert.match(route, /getCategorySeoDescription\(locale, category\.id\)/);
  assert.match(route, /isCategorySeoIndexable\(category\.id\)/);
  assert.match(inventory, /isCategorySeoIndexable\(category\.id\)/);
});
