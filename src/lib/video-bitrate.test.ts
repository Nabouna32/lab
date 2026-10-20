import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateVideoBitrateMbps,
  calculateVideoSizeBytes,
  formatDurationSeconds,
  parseVideoDurationInputs,
  parseVideoNumericInput,
} from "./video-bitrate.ts";

test("calculates total bitrate from duration and decimal file size", () => {
  assert.equal(calculateVideoBitrateMbps(600, 750_000_000), 10);
});

test("calculates decimal file size from duration and bitrate", () => {
  assert.equal(calculateVideoSizeBytes(600, 10), 750_000_000);
  assert.equal(calculateVideoSizeBytes(600, 0.7), 52_500_000);
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

test("does not silently treat malformed duration components as zero", () => {
  assert.deepEqual(parseVideoDurationInputs("invalid", "2", "", "en"), {
    hasInput: true,
    duration: null,
    invalid: true,
  });
  assert.deepEqual(parseVideoDurationInputs("", "", "", "en"), {
    hasInput: false,
    duration: null,
    invalid: false,
  });
  assert.deepEqual(parseVideoDurationInputs("1", "2", "3", "en"), {
    hasInput: true,
    duration: 3723,
    invalid: false,
  });
});

test("parses localized video inputs and identifies non-empty invalid values", () => {
  assert.deepEqual(parseVideoNumericInput("1,5", "fr"), {
    hasInput: true,
    value: 1.5,
    invalid: false,
  });
  assert.deepEqual(parseVideoNumericInput("abc", "en"), {
    hasInput: true,
    value: null,
    invalid: true,
  });
  assert.deepEqual(parseVideoNumericInput("", "en"), {
    hasInput: false,
    value: null,
    invalid: false,
  });
});
