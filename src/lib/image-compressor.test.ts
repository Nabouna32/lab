import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateReductionPercent,
  fitImageWithinDimensions,
  formatBytes,
  getOutputExtension,
  getOutputMimeType,
  normalizeQuality,
} from "./image-compressor.ts";

test("fits an image inside a maximum dimension without distortion", () => {
  assert.deepEqual(fitImageWithinDimensions(4000, 2000, 2000), { width: 2000, height: 1000 });
  assert.deepEqual(fitImageWithinDimensions(1200, 800, 2000), { width: 1200, height: 800 });
});

test("handles portrait images", () => {
  assert.deepEqual(fitImageWithinDimensions(1000, 3000, 1500), { width: 500, height: 1500 });
});

test("normalizes quality to a safe range", () => {
  assert.equal(normalizeQuality(2), 1);
  assert.equal(normalizeQuality(0), 0.1);
  assert.equal(normalizeQuality(Number.NaN), 0.8);
});

test("maps output formats to MIME types", () => {
  assert.equal(getOutputMimeType("webp"), "image/webp");
  assert.equal(getOutputMimeType("jpeg"), "image/jpeg");
  assert.equal(getOutputMimeType("png"), "image/png");
});

test("calculates a non-negative reduction percentage", () => {
  assert.equal(calculateReductionPercent(1000, 750), 25);
  assert.equal(calculateReductionPercent(1000, 1250), 0);
});

test("formats byte counts for readable results", () => {
  assert.equal(formatBytes(800), "800 B");
  assert.equal(formatBytes(10240), "10.0 KB");
  assert.equal(formatBytes(1048576), "1.00 MB");
});

test("uses the actual encoded MIME type to choose the download extension", () => {
  assert.equal(getOutputExtension("image/webp"), "webp");
  assert.equal(getOutputExtension("image/jpeg"), "jpg");
  assert.equal(getOutputExtension("image/png"), "png");
  assert.equal(getOutputExtension(""), "png");
});

import { createZipArchive } from "./zip-archive.ts";

test("creates a valid ZIP archive and sanitizes duplicate file names", async () => {
  const archive = await createZipArchive([
    { name: "../photo.png", blob: new Blob(["first"]) },
    { name: "photo.png", blob: new Blob(["second"]) },
  ]);
  const bytes = new Uint8Array(await archive.arrayBuffer());
  const decoded = new TextDecoder().decode(bytes);
  assert.equal(archive.type, "application/zip");
  assert.deepEqual(Array.from(bytes.slice(0, 4)), [0x50, 0x4b, 0x03, 0x04]);
  assert.ok(decoded.includes("photo.png"));
  assert.ok(decoded.includes("photo (2).png"));
  assert.deepEqual(Array.from(bytes.slice(-22, -18)), [0x50, 0x4b, 0x05, 0x06]);
});

test("rejects an empty ZIP archive", async () => {
  await assert.rejects(() => createZipArchive([]), /empty archive/i);
});
