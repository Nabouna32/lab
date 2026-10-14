import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const providerFile = fileURLToPath(new URL("./FavoritesProvider.tsx", import.meta.url));

test("favorites account loading is deferred outside the Supabase auth callback", async () => {
  const source = await readFile(providerFile, "utf8");
  const authChangeBranch = source.match(/onAuthStateChange\(\(_event, session\) => \{([\s\S]*?)\n    \}\);/)?.[1];

  assert.ok(authChangeBranch, "auth state change handler exists");
  assert.match(authChangeBranch, /setTimeout\(\(\) =>/);
  assert.match(authChangeBranch, /clearTimeout\(authChangeTimer\)/);
  assert.ok(authChangeBranch.indexOf("setTimeout(") < authChangeBranch.indexOf("void loadAccount(nextUserId)"));
});
