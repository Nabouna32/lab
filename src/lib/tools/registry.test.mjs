import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const registryFile = fileURLToPath(new URL("./registry.ts", import.meta.url));
const toolsCatalogFile = fileURLToPath(new URL("./tools.ts", import.meta.url));
const toolRendererFile = fileURLToPath(
  new URL("../../components/tools/ToolRenderer.tsx", import.meta.url),
);

async function readPublishedToolIds() {
  const source = await readFile(toolsCatalogFile, "utf8");
  const ids = [];
  for (const entry of source.split(/\n\s*\{\n/).slice(1)) {
    const id = entry.match(/\bid:\s*"([^"]+)"/)?.[1];
    const lifecycle = entry.match(/\blifecycle:\s*"([^"]+)"/)?.[1];
    if (id && lifecycle === "published") ids.push(id);
  }
  return ids;
}

test("every published tool has exactly one registry module", async () => {
  const source = await readFile(registryFile, "utf8");
  const publishedIds = await readPublishedToolIds();
  const registeredIds = [...source.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): createToolModule\(/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.equal(new Set(registeredIds).size, registeredIds.length);
  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
});

test("every registered module exposes runtime and editorial loaders", async () => {
  const source = await readFile(registryFile, "utf8");
  const moduleBlocks = [...source.matchAll(/(?:^|\n)\s+(?:"([^"]+)"|([a-z0-9-]+)): createToolModule\(([\s\S]*?)\n\s+\),/g)];

  assert.equal(moduleBlocks.length, (await readPublishedToolIds()).length);

  for (const [, quotedId, bareId, block] of moduleBlocks) {
    const toolId = quotedId ?? bareId;
    const imports = [...block.matchAll(/import\("([^"]+)"\)/g)].map((match) => match[1]);

    assert.equal(imports.length, 2, `Tool "${toolId}" must declare runtime and editorial loaders.`);
    assert.match(imports[0], /\/components\/tools\//);
    assert.match(imports[1], /\/components\/tools\/.*\/ToolEditorial$/);
  }
});

test("ToolRenderer resolves runtime components through the registry", async () => {
  const source = await readFile(toolRendererFile, "utf8");

  assert.match(source, /getToolRegistryEntry/);
  assert.match(source, /entry\.module\.runtime/);
  assert.doesNotMatch(source, /toolComponents/);
  assert.doesNotMatch(source, /next\/dynamic/);
  assert.doesNotMatch(source, /@\/components\/tools\//);
});


test("registry module ids are valid ToolIds", async () => {
  const registrySource = await readFile(registryFile, "utf8");
  const typesSource = await readFile(fileURLToPath(new URL("./types.ts", import.meta.url)), "utf8");
  const toolIds = [...typesSource.matchAll(/\|\s*"([^"]+)"/g)].map(([, id]) => id);
  const registeredIds = [...registrySource.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): createToolModule\(/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  for (const toolId of registeredIds) {
    assert.ok(toolIds.includes(toolId), `Registry module "${toolId}" must be a declared ToolId.`);
  }
});

test("registry module contract contains both runtime and editorial loaders", async () => {
  const source = await readFile(registryFile, "utf8");
  const modules = [...source.matchAll(/createToolModule\(\s*([\s\S]*?)\n\s*\),/g)];

  assert.equal(modules.length, (await readPublishedToolIds()).length);
  for (const [, block] of modules) {
    const imports = [...block.matchAll(/import\("([^"]+)"\)/g)].map((match) => match[1]);
    assert.equal(imports.length, 2);
  }
});