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
  assert.match(authErrorBranch, /setCollections\(local\)/);
});

test("sign-in and sign-out clear the previous account before refreshing", async () => {
  const source = await readProvider();
  const authChangeBranch = source.match(/onAuthStateChange\(\(event\) => \{([\s\S]*?)\n    \}\);/)?.[1];
  assert.ok(authChangeBranch, "auth state change handler exists");
  assert.match(authChangeBranch, /event === "SIGNED_IN" \|\| event === "SIGNED_OUT"/);
  assert.match(authChangeBranch, /setUserId\(null\)/);
  assert.match(authChangeBranch, /setCollections\(\[\]\)/);
  assert.match(authChangeBranch, /setTimeout\(\(\) =>/);
  assert.ok(authChangeBranch.indexOf("setCollections([])") < authChangeBranch.indexOf("void load()"));
});

test("local collections are device-only and all mutations have a local branch", async () => {
  const source = await readProvider();
  assert.match(source, /LOCAL_COLLECTIONS_KEY/);
  assert.match(source, /parseLocalCollections\(localStorage\.getItem\(LOCAL_COLLECTIONS_KEY/);
  assert.match(source, /if \(!synchronize\) \{/);
  assert.match(source, /if \(id\.startsWith\("local-"\)\)/);
  assert.match(source, /collection\.storage !== "account"/);
  assert.match(source, /storage: "account" as const/);
});

test("local collection creation enforces the browser storage cap", async () => {
  const source = await readProvider();
  assert.match(source, /localCollections\.length >= MAX_LOCAL_COLLECTIONS/);
});
