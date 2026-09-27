import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const registryFile = fileURLToPath(new URL("./registry.ts", import.meta.url));
const toolsCatalogFile = fileURLToPath(new URL("./tools.ts", import.meta.url));

async function readPublishedToolIds() {
  const source = await readFile(toolsCatalogFile, "utf8");
  const ids = [];
  for (const entry of source.split(/\n\s*\{\n/).slice(1)) {
    const id = entry.match(/\bid:\s*"([^"]+)"/)?.[1];
    const lifecycle = entry.match(/\blifecycle:\s*"([^"]+)"\b/)?.[1];
    if (id && lifecycle === "published") ids.push(id);
  }
  return ids;
}

test("every published tool has exactly one registry module", async () => {
  const source = await readFile(registryFile, "utf8");
  const publishedIds = await readPublishedToolIds();
  const registeredIds = [...source.matchAll(/^\s+(?:"([^"]+)"|([a-z0-9-]+)): \{[\s\S]*?load:/gm)].map(
    ([, quotedId, bareId]) => quotedId ?? bareId,
  );

  assert.equal(new Set(registeredIds).size, registeredIds.length);
  assert.deepEqual([...registeredIds].sort(), [...publishedIds].sort());
});
