import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const routeFile = fileURLToPath(new URL("../../app/[locale]/outils/[category]/[slug]/page.tsx", import.meta.url));
const registryFile = fileURLToPath(new URL("./registry.ts", import.meta.url));
const toolsCatalogFile = fileURLToPath(new URL("./tools.ts", import.meta.url));

async function readPublishedToolIds() {
  const source = await readFile(toolsCatalogFile, "utf8");
  const ids = [];
  for (const entry of source.split(/\n\s*\{\n/).slice(1)) {
    const id = entry.match(/\bid:\s*"([^"]+)"/)?.[1];
    const lifecycle = entry.match(/\blifecycle:\s*"([^"]+)"/)?.[1];
    if (id && lifecycle === "published") ids.push(id);
  }
  assert.ok(ids.length > 0, "The tool catalog must declare at least one published tool.");
  return ids;
}

test("the tool platform exposes one dynamic route", async () => {
  const source = await readFile(routeFile, "utf8");
  assert.match(source, /getToolByRoute/);
  assert.match(source, /generateStaticParams/);
});

test("published tools have exactly one registry module", async () => {
  const registrySource = await readFile(registryFile, "utf8");
  const publishedIds = await readPublishedToolIds();
  const registeredIds = [...registrySource.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): \{[\s\S]*?load:/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
});

test("published tools have module-owned editorial loaders", async () => {
  const registrySource = await readFile(registryFile, "utf8");
  const publishedIds = await readPublishedToolIds();
  const registeredIds = [...registrySource.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): \{[\s\S]*?loadEditorial: \(\) => import\(/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
});
