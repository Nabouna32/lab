import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const metadataFile = fileURLToPath(new URL("./page-metadata.ts", import.meta.url));
const inventoryFile = fileURLToPath(new URL("../seo/public-pages.ts", import.meta.url));
const routeFile = fileURLToPath(new URL("../../app/[locale]/[section]/[slug]/page.tsx", import.meta.url));
const publicRoutes = [
  fileURLToPath(new URL("../../app/[locale]/page.tsx", import.meta.url)),
  fileURLToPath(new URL("../../app/[locale]/[section]/page.tsx", import.meta.url)),
  fileURLToPath(new URL("../../app/[locale]/[section]/[slug]/page.tsx", import.meta.url)),
];

test("tool metadata defines canonical and localized alternate URLs", async () => {
  const source = await readFile(metadataFile, "utf8");

  assert.match(source, /alternates:\s*\{/);
  assert.match(source, /canonical: url\.toString\(\)/);
  assert.match(source, /languages/);
  assert.match(source, /getPublicSeoPage\(locale, seo\.path\)/);
});

test("tool metadata defines Open Graph fields", async () => {
  const source = await readFile(metadataFile, "utf8");

  assert.match(source, /openGraph:/);
  assert.match(source, /type: "website"/);
  assert.match(source, /siteName: "Loculary"/);
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

test("public page inventory is derived from published resources and localized route helpers", async () => {
  const source = await readFile(inventoryFile, "utf8");

  assert.match(source, /getPublishedTools\(\)/);
  assert.match(source, /getToolsByCategory\(category\.id\)\.length > 0/);
  assert.match(source, /getCategoryPath/);
  assert.match(source, /getToolPath/);
  assert.match(source, /getGuidedWorkflowsPath/);
  assert.match(source, /isCategorySeoIndexable\(category\.id\)/);
  assert.match(source, /tool\.seo\[locale\]\.indexable/);
  assert.match(source, /buildPublicSeoInventory\(locales, resources\)/);
});

test("sitemap is generated from the shared inventory and emits localized alternates", async () => {
  const sitemapSource = await readFile(
    fileURLToPath(new URL("../../app/sitemap.ts", import.meta.url)),
    "utf8",
  );

  assert.match(sitemapSource, /getPublicSeoPages\(\)/);
  assert.match(sitemapSource, /alternates:\s*\{/);
  assert.match(sitemapSource, /languages:/);
  assert.doesNotMatch(sitemapSource, /getPublishedTools|categories/);
});

test("SEO exposes a sitemap and robots route using the configured site URL", async () => {
  const sitemapSource = await readFile(
    fileURLToPath(new URL("../../app/sitemap.ts", import.meta.url)),
    "utf8",
  );
  const robotsSource = await readFile(
    fileURLToPath(new URL("../../app/robots.ts", import.meta.url)),
    "utf8",
  );

  assert.match(sitemapSource, /getSiteUrl/);
  assert.match(robotsSource, /MetadataRoute\.Robots/);
  assert.match(robotsSource, /sitemap:/);
  assert.match(robotsSource, /getSiteUrl/);
});

test("private, personalized, and internal pages explicitly opt out of indexing", async () => {
  const nonIndexableFiles = [
    "../../app/[locale]/compte/layout.tsx",
    "../../app/[locale]/admin/layout.tsx",
    "../../app/[locale]/design-lab/layout.tsx",
    "../../app/[locale]/collections/page.tsx",
    "../../app/[locale]/favoris/page.tsx",
    "../../app/[locale]/collection-partagee/[token]/page.tsx",
  ];

  for (const relativePath of nonIndexableFiles) {
    const source = await readFile(
      fileURLToPath(new URL(relativePath, import.meta.url)),
      "utf8",
    );
    assert.match(source, /robots:\s*\{\s*index:\s*false/);
  }

  const robotsSource = await readFile(
    fileURLToPath(new URL("../../app/robots.ts", import.meta.url)),
    "utf8",
  );
  assert.doesNotMatch(robotsSource, /disallow:/);

  const searchSource = await readFile(
    fileURLToPath(new URL("../../components/tools/SearchResultsPage.tsx", import.meta.url)),
    "utf8",
  );
  assert.match(searchSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);

  const toolsRouteSource = await readFile(
    fileURLToPath(new URL("../../app/[locale]/[section]/page.tsx", import.meta.url)),
    "utf8",
  );
  assert.match(toolsRouteSource, /query\.intent\s*\?\s*\{\s*\.\.\.metadata,\s*robots:/);
});
