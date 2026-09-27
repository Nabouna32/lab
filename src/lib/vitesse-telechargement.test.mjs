import assert from "node:assert/strict";
import test from "node:test";
import { convertSpeed } from "./vitesse-telechargement.ts";

test("converts Mbps to Mo/s", () => {
  assert.equal(convertSpeed(100, "mbps", "mo-s"), 12.5);
});

test("converts Gbps to Mbps", () => {
  assert.equal(convertSpeed(1, "gbps", "mbps"), 1000);
});

test("converts Mo/s to Mbps", () => {
  assert.equal(convertSpeed(12.5, "mo-s", "mbps"), 100);
});

test("keeps the value when units match", () => {
  assert.equal(convertSpeed(42.5, "mo-s", "mo-s"), 42.5);
});

test("returns null for invalid units at runtime", () => {
  assert.equal(convertSpeed(1, "invalid", "mbps"), null);
  assert.equal(convertSpeed(1, "mbps", "invalid"), null);
});

test("accepts zero and returns null for invalid values", () => {
  assert.equal(convertSpeed(0, "mbps", "mo-s"), 0);
  assert.equal(convertSpeed(-1, "mbps", "mo-s"), null);
  assert.equal(convertSpeed(Number.NaN, "mbps", "mo-s"), null);
  assert.equal(convertSpeed(Number.POSITIVE_INFINITY, "mbps", "mo-s"), null);
});

test("returns null when the result overflows the numeric range", () => {
  assert.equal(convertSpeed(Number.MAX_VALUE, "mbps", "go-s"), null);
});
