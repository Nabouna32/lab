import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateVideoBitrateMbps, calculateVideoSizeBytes, formatDurationSeconds } from "./video-bitrate.ts";

test("calculates total bitrate from duration and decimal file size", () => {
  assert.equal(calculateVideoBitrateMbps(600, 750_000_000), 10);
});

test("calculates decimal file size from duration and bitrate", () => {
  assert.equal(calculateVideoSizeBytes(600, 10), 750_000_000);
});

test("rejects invalid duration and negative values", () => {
  assert.equal(formatDurationSeconds(0, 0, 0), null);
  assert.equal(formatDurationSeconds(1, 60, 0), null);
  assert.equal(formatDurationSeconds(1, 0, 60), null);
  assert.equal(calculateVideoBitrateMbps(0, 100), null);
  assert.equal(calculateVideoBitrateMbps(60, -1), null);
  assert.equal(calculateVideoSizeBytes(60, -1), null);
});

test("accepts hour, minute and second duration components", () => {
  assert.equal(formatDurationSeconds(1, 2, 3), 3723);
});
