import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateFileSize } from "./taille-fichier.ts";

test("calculates decimal file size from duration and bitrate", () => {
  assert.equal(calculateFileSize(10, "minutes", 8, "mbps", "mb"), 600);
});

test("supports hours, gigabits and gigabytes", () => {
  assert.equal(calculateFileSize(1, "hours", 1, "gbps", "gb"), 450);
});

test("returns null for invalid values", () => {
  assert.equal(calculateFileSize(-1, "minutes", 8, "mbps", "mb"), null);
  assert.equal(calculateFileSize(10, "minutes", Number.NaN, "mbps", "mb"), null);
});

test("returns null for invalid units", () => {
  assert.equal(calculateFileSize(10, "weeks", 8, "mbps", "mb"), null);
  assert.equal(calculateFileSize(10, "minutes", 8, "bps", "mb"), null);
  assert.equal(calculateFileSize(10, "minutes", 8, "mbps", "tb"), null);
});

test("returns null when the result overflows the numeric range", () => {
  assert.equal(calculateFileSize(Number.MAX_VALUE, "hours", Number.MAX_VALUE, "gbps", "gb"), null);
});

test("zero duration or bitrate produces zero", () => {
  assert.equal(calculateFileSize(0, "minutes", 8, "mbps", "mb"), 0);
  assert.equal(calculateFileSize(10, "minutes", 0, "mbps", "mb"), 0);
});
