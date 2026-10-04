import assert from "node:assert/strict";
import test from "node:test";
import { generateQrCode } from "./qr-code.ts";

test("generates a valid-size QR matrix for a short URL", () => {
  const result = generateQrCode("https://example.com");
  assert.equal(result.version, 1);
  assert.equal(result.matrix.length, 21);
  assert.equal(result.matrix.every((row) => row.length === 21 && row.every((cell) => typeof cell === "boolean")), true);
});

test("supports UTF-8 text and selects a larger version when needed", () => {
  const result = generateQrCode("Hello, café 🌍 — Loculary");
  assert.ok(result.byteLength > 20);
  assert.ok(result.version >= 2);
  assert.equal(result.matrix.length, 17 + result.version * 4);
});

test("rejects input beyond the supported local capacity", () => {
  assert.throws(() => generateQrCode("x".repeat(108)), RangeError);
});
