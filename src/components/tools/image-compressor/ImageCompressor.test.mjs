import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const componentFile = fileURLToPath(new URL("./ImageCompressor.tsx", import.meta.url));

test("invalid file selections clear the busy state after cancelling compression", async () => {
  const source = await readFile(componentFile, "utf8");
  const invalidTypeBranch = source.match(/if \(!next\.type\.startsWith\("image\/"\)\) \{([\s\S]*?)\n    \}/)?.[1];
  const oversizedBranch = source.match(/if \(next\.size > MAX_FILE_BYTES\) \{([\s\S]*?)\n    \}/)?.[1];

  assert.ok(invalidTypeBranch, "invalid-type branch exists");
  assert.ok(oversizedBranch, "oversized-file branch exists");
  assert.match(invalidTypeBranch, /setBusy\(false\)/);
  assert.match(oversizedBranch, /setBusy\(false\)/);
});

test("reset clears the busy state when cancelling an in-flight compression", async () => {
  const source = await readFile(componentFile, "utf8");
  const resetBody = source.match(/function reset\(\) \{([\s\S]*?)\n  \}/)?.[1];

  assert.ok(resetBody, "reset handler exists");
  assert.match(resetBody, /setBusy\(false\)/);
});
