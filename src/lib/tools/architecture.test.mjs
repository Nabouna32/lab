import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const routeFile = fileURLToPath(new URL("../../app/[locale]/[section]/[slug]/page.tsx", import.meta.url));
const toolRendererFile = fileURLToPath(new URL("../../components/tools/ToolRenderer.tsx", import.meta.url));
const toolSearchFile = fileURLToPath(new URL("../../components/tools/ToolSearch.tsx", import.meta.url));
const toolSearchRequestFile = fileURLToPath(new URL("./search-request.ts", import.meta.url));

test("the tool platform exposes one dynamic route", async () => {
  const source = await readFile(routeFile, "utf8");
  assert.match(source, /getToolByRoute/);
  assert.match(source, /generateStaticParams/);
});

test("ToolRenderer resolves implementations through the registry", async () => {
  const source = await readFile(toolRendererFile, "utf8");

  assert.match(source, /"use client"/);
  assert.match(source, /getToolRegistryEntry/);
  assert.match(source, /entry\.module\.runtime/);
  assert.doesNotMatch(source, /toolComponents/);
  assert.doesNotMatch(source, /next\/dynamic/);
  assert.doesNotMatch(source, /@\/components\/tools\//);
});

test("the tool route renders through the client tool renderer", async () => {
  const source = await readFile(routeFile, "utf8");
  assert.match(source, /import ToolRenderer from "@\/components\/tools\/ToolRenderer";/);
  assert.match(source, /<ToolRenderer toolId=\{entry\.tool\.id\} \/>/);
  assert.doesNotMatch(source, /entry\.module\.load\(\)/);
});

test("tool search loads the catalog and search engine only when search is used", async () => {
  const source = await readFile(toolSearchFile, "utf8");
  const requestSource = await readFile(toolSearchRequestFile, "utf8");
  assert.ok(requestSource.includes('import("./search-client")'));
  assert.equal(source.includes('from "@/lib/tools/catalog"'), false);
  assert.equal(source.includes('from "@/lib/tools/search"'), false);
  assert.equal(source.includes('from "@/lib/tools/search-client"'), false);
});
