import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateReductionPercent,
  fitImageWithinDimensions,
  formatBytes,
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
