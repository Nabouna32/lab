import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const viewFile = fileURLToPath(new URL("./CollectionsView.tsx", import.meta.url));

test("collection creation prevents duplicate submissions and restores its button", async () => {
  const source = await readFile(viewFile, "utf8");
  const createBody = source.match(/async function create\(\) \{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(createBody, "create handler exists");
  assert.match(createBody, /creatingRef\.current/);
  assert.match(createBody, /finally \{/);
  assert.match(createBody, /setCreating\(false\)/);
  assert.match(source, /disabled=\{data\.loading \|\| creating \|\| !name\.trim\(\)\}/);
});

test("adding a tool prevents duplicate submissions and reports thrown errors", async () => {
  const source = await readFile(viewFile, "utf8");
  const addBody = source.match(/async function add\(\) \{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(addBody, "add handler exists");
  assert.match(addBody, /addingRef\.current/);
  assert.match(addBody, /catch \{/);
  assert.match(addBody, /finally \{/);
  assert.match(addBody, /setAdding\(false\)/);
  assert.match(source, /disabled=\{!addingTool \|\| adding\}/);
});

test("anonymous users can create local collections and signed-in users can choose sync", async () => {
  const source = await readFile(viewFile, "utf8");
  assert.match(source, /data\.createCollection\(name, Boolean\(data\.userId && synchronize\)\)/);
  assert.match(source, /data\.userId && <label/);
  assert.match(source, /copy\.localNote/);
  assert.match(source, /collection\.storage === "local" \? copy\.localOnly/);
  assert.match(source, /active\.storage === "account" &&/);
});
