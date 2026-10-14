import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const providerFile = fileURLToPath(new URL("./CollectionsProvider.tsx", import.meta.url));

async function readProvider() {
  return readFile(providerFile, "utf8");
}

test("collection refresh ignores stale identity and collection responses", async () => {
  const source = await readProvider();

  assert.match(source, /const requestId = \+\+refreshRequestRef\.current/);
  assert.equal([...source.matchAll(/if \(!isCurrentRequest\(\)\) return;/g)].length, 2);
  assert.match(source, /refreshRequestRef\.current \+= 1/);
});

test("collection refresh clears previous account data when identity cannot be confirmed", async () => {
  const source = await readProvider();
  const authErrorBranch = source.match(/if \(authError\) \{([\s\S]*?)\n    \}/)?.[1];

  assert.ok(authErrorBranch, "auth error branch exists");
  assert.match(authErrorBranch, /setUserId\(null\)/);
  assert.match(authErrorBranch, /setCollections\(\[\]\)/);
});
