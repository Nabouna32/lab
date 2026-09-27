import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const metadataFile = fileURLToPath(new URL("./page-metadata.ts", import.meta.url));
const routeFile = fileURLToPath(new URL("../../app/[locale]/outils/[category]/[slug]/page.tsx", import.meta.url));
const publicRoutes = [
  fileURLToPath(new URL("../../app/[locale]/page.tsx", import.meta.url)),
  fileURLToPath(new URL("../../app/[locale]/outils/page.tsx", import.meta.url)),
  fileURLToPath(new URL("../../app/[locale]/outils/[category]/page.tsx", import.meta.url)),
];

test("tool metadata defines canonical and localized alternate URLs", async () => {
  const source = await readFile(metadataFile, "utf8");

  assert.match(source, /alternates:\s*\{/);
  assert.match(source, /canonical: url\.toString\(\)/);
  assert.match(source, /languages: alternates/);
});

test("tool metadata defines Open Graph fields", async () => {
  const source = await readFile(metadataFile, "utf8");

  assert.match(source, /openGraph:/);
  assert.match(source, /type: "website"/);
  assert.match(source, /siteName: "Utiluna"/);
});

test("dynamic tool route resolves SEO metadata from the resolved tool", async () => {
  const source = await readFile(routeFile, "utf8");

  assert.match(source, /getToolPageMetadata\(entry\.tool, locale\)/);
});

test("public localized routes define metadata", async () => {
  for (const routeFile of publicRoutes) {
    const source = await readFile(routeFile, "utf8");
    assert.match(source, /generateMetadata/);
    assert.match(source, /getPublicPageMetadata/);
  }
});

test("public metadata centralizes canonical, alternates and Open Graph fields", async () => {
  const source = await readFile(metadataFile, "utf8");
  assert.match(source, /export function getPublicPageMetadata/);
  assert.match(source, /canonical: url\.toString\(\)/);
  assert.match(source, /languages: alternates/);
  assert.match(source, /openGraph:/);
});
