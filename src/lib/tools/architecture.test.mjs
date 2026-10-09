import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const routeFile = fileURLToPath(new URL("../../app/[locale]/[section]/[slug]/page.tsx", import.meta.url));
const registryFile = fileURLToPath(new URL("./registry.ts", import.meta.url));
const toolRendererFile = fileURLToPath(new URL("../../components/tools/ToolRenderer.tsx", import.meta.url));
const toolsCatalogFile = fileURLToPath(new URL("./tools.ts", import.meta.url));

async function readPublishedToolIds() {
  const source = await readFile(toolsCatalogFile, "utf8");
  const ids = [];
  let entry = null;

  for (const line of source.split(/\r?\n/)) {
    if (/^  \{$/.test(line)) {
      entry = {};
      continue;
    }

    if (!entry) continue;

    const id = line.match(/^\s*id:\s*"([^"]+)"/)?.[1];
    const lifecycle = line.match(/^\s*lifecycle:\s*"([^"]+)"/)?.[1];

    if (id) entry.id = id;
    if (lifecycle) entry.lifecycle = lifecycle;

    if (/^  \},$/.test(line)) {
      if (entry.id && entry.lifecycle === "published") ids.push(entry.id);
      entry = null;
    }
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
  const registeredIds = [...registrySource.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): createToolModule\(/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
});

test("published tools have module-owned runtime and editorial loaders", async () => {
  const registrySource = await readFile(registryFile, "utf8");
  const publishedIds = await readPublishedToolIds();
  const registeredIds = [...registrySource.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): createToolModule\(/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
  assert.equal((registrySource.match(/\(\) => import\(/g) ?? []).length, publishedIds.length * 2);
});

test("ToolRenderer resolves implementations through the registry", async () => {
  const rendererSource = await readFile(toolRendererFile, "utf8");

  assert.match(rendererSource, /"use client"/);
  assert.match(rendererSource, /getToolRegistryEntry/);
  assert.match(rendererSource, /entry\.module\.runtime/);
  assert.doesNotMatch(rendererSource, /toolComponents/);
  assert.doesNotMatch(rendererSource, /next\/dynamic/);
  assert.doesNotMatch(rendererSource, /@\/components\/tools\//);
});

test("the tool route renders through the client tool renderer", async () => {
  const source = await readFile(routeFile, "utf8");
  assert.match(source, /import ToolRenderer from "@\/components\/tools\/ToolRenderer";/);
  assert.match(source, /<ToolRenderer toolId=\{entry\.tool\.id\} \/>/);
  assert.doesNotMatch(source, /entry\.module\.load\(\)/);
});

const toolSearchFile = fileURLToPath(new URL("../../components/tools/ToolSearch.tsx", import.meta.url));
const toolSearchRequestFile = fileURLToPath(new URL("./search-request.ts", import.meta.url));

test("tool search loads the catalog and search engine only when search is used", async () => {
  const source = await readFile(toolSearchFile, "utf8");
  const requestSource = await readFile(toolSearchRequestFile, "utf8");
  assert.ok(requestSource.includes('import("./search-client")'));
  assert.equal(source.includes('from "@/lib/tools/catalog"'), false);
  assert.equal(source.includes('from "@/lib/tools/search"'), false);
  assert.equal(source.includes('from "@/lib/tools/search-client"'), false);
});
