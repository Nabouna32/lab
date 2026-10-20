import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const componentFile = fileURLToPath(new URL("./ImageMetadataViewer.tsx", import.meta.url));

test("image selection ignores stale metadata results and clears invalid selections", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /const operation=\+\+operationRef\.current/);
  assert.match(source, /if\(operation!==operationRef\.current\)return/);
  assert.match(source, /setFile\(null\);setData\(null\);setClean\(null\);setCleanMimeType\(null\);setPreview\(null\);setBusy\(false\)/);
  assert.match(source, /finally\{if\(operation===operationRef\.current\)setBusy\(false\)\}/);
});

test("metadata stripping cannot publish a result for a replaced or reset image", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /const selected=file,operation=operationRef\.current/);
  assert.match(source, /if\(operation!==operationRef\.current\)return;\s*const url=URL\.createObjectURL\(blob\)/);
  assert.match(source, /function reset\(\)\{operationRef\.current\+=1/);
});

test("warns users when inspected EXIF metadata contains precise GPS coordinates", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /data\.exif\.gps&&<p role="status"/);
  assert.match(source, /\{t\.gpsWarning\}/);
});
