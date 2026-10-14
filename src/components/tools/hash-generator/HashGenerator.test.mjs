import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const componentFile = fileURLToPath(new URL("./HashGenerator.tsx", import.meta.url));

test("hash generation ignores stale results after input or algorithm changes", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /const requestId = \+\+requestRef\.current/);
  assert.match(source, /if \(requestId !== requestRef\.current\) return;/);
  assert.match(source, /requestRef\.current \+= 1; setBusy\(false\); setInput/);
  assert.match(source, /requestRef\.current \+= 1; setBusy\(false\); setAlgorithm/);
});

test("clearing or unmounting invalidates in-flight hash requests", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /function clear\(\) \{\s*requestRef\.current \+= 1;/);
  assert.match(source, /useEffect\(\(\) => \(\) => \{ requestRef\.current \+= 1; \}, \[\]\)/);
  assert.match(source, /if \(requestId === requestRef\.current\) setBusy\(false\)/);
});
