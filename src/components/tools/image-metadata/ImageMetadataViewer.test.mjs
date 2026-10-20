import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { getToolMessages } from "@/lib/i18n/tool-messages.ts";

const componentFile = fileURLToPath(new URL("./ImageMetadataViewer.tsx", import.meta.url));

test("batch image selection is bounded and rejects oversized selections", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /const MAX_FILE_BYTES = 25 \* 1024 \* 1024/);
  assert.match(source, /const MAX_BATCH_BYTES = 50 \* 1024 \* 1024/);
  assert.match(source, /const MAX_FILES = 10/);
  assert.match(source, /selected.length > MAX_FILES/);
  assert.match(source, /selected.reduce\(\(total, file\) => total \+ file.size, 0\) > MAX_BATCH_BYTES/);
});

test("inspection and cleaning ignore stale results after a new selection or reset", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /const operation = \+\+operationRef.current/);
  assert.match(source, /if \(operation !== operationRef.current\) return;/);
  assert.match(source, /operationRef.current \+= 1/);
  assert.match(source, /previewUrlsRef.current.forEach\(\(url\) => URL.revokeObjectURL\(url\)\)/);
});

test("batch cleaning preserves per-image animated-file errors and GPS warnings", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /cause instanceof AnimatedImageUnsupportedError/);
  assert.match(source, /item.metadata.exif.gps/);
  assert.match(source, /\{t.gpsWarning\}/);
  assert.match(source, /\{item.cleanError\}/);
});

test("cleaned images are exported together in a ZIP archive", async () => {
  const source = await readFile(componentFile, "utf8");
  assert.match(source, /createZipArchive\(entries\)/);
  assert.match(source, /anchor.download = "loculary-images-cleaned\.zip"/);
  assert.match(source, /-cleaned\."/);
});

test("batch metadata cleaning is localized in French and English", () => {
  assert.match(getToolMessages("fr").imageMetadata.inputHint, /10 images/);
  assert.match(getToolMessages("fr").imageMetadata.cleaningHint, /images animées/);
  assert.match(getToolMessages("fr").imageMetadata.completedCount(2, 3), /2 image\(s\) nettoyée\(s\) sur 3/);
  assert.match(getToolMessages("en").imageMetadata.inputHint, /10 images/);
  assert.match(getToolMessages("en").imageMetadata.cleaningHint, /Animated images/);
  assert.match(getToolMessages("en").imageMetadata.completedCount(2, 3), /2 of 3/);
});
