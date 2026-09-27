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

test("rejects invalid units at runtime", () => {
  assert.throws(() => convertSpeed(1, "invalid", "mbps"), RangeError);
  assert.throws(() => convertSpeed(1, "mbps", "invalid"), RangeError);
});

test("accepts zero and rejects invalid values", () => {
  assert.equal(convertSpeed(0, "mbps", "mo-s"), 0);
  assert.throws(() => convertSpeed(-1, "mbps", "mo-s"), RangeError);
  assert.throws(() => convertSpeed(Number.NaN, "mbps", "mo-s"), RangeError);
  assert.throws(() => convertSpeed(Number.POSITIVE_INFINITY, "mbps", "mo-s"), RangeError);
});
