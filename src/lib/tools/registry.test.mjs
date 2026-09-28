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
  const registeredIds = [...source.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): \{[\s\S]*?loadEditorial:/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.equal(new Set(registeredIds).size, registeredIds.length);
  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
});


test("every registered module exposes runtime and editorial loaders", async () => {
  const source = await readFile(registryFile, "utf8");
  const moduleBlocks = [...source.matchAll(/(?:^|\n)\s+(?:"([^"]+)"|([a-z0-9-]+)): createToolModule\(([\s\S]*?)\n\s+\),/g)];

  assert.ok(moduleBlocks.length > 0);

  for (const [, quotedId, bareId, block] of moduleBlocks) {
    const toolId = quotedId ?? bareId;
    const imports = [...block.matchAll(/import\("([^"]+)"\)/g)].map((match) => match[1]);

    assert.equal(imports.length, 2, `Tool "${toolId}" must declare runtime and editorial loaders.`);
    assert.match(imports[0], /\/components\/tools\/.*(?:Calculator|Converter|Counter)$/);
    assert.match(imports[1], /\/components\/tools\/.*\/ToolEditorial$/);
  }
});

test("ToolRenderer resolves runtime components through the registry", async () => {
  const source = await readFile(toolRendererFile, "utf8");

  assert.match(source, /getToolRegistryEntry/);
  assert.match(source, /entry\.module\.runtime/);
  assert.doesNotMatch(source, /toolComponents/);
  assert.doesNotMatch(source, /dynamic\(/);
  assert.doesNotMatch(source, /@\/components\/tools\//);
});
