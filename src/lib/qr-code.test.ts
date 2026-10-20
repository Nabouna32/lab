import assert from "node:assert/strict";
import test from "node:test";
import { generateQrCode, getQrPayloadHeaderBits } from "./qr-code.ts";

test("generates a valid-size QR matrix for a short URL", () => {
  const result = generateQrCode("https://example.com");
  assert.equal(result.version, 2);
  assert.equal(result.matrix.length, 25);
  assert.equal(result.matrix.every((row) => row.length === 25 && row.every((cell) => typeof cell === "boolean")), true);
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

test("declares UTF-8 with ECI 26 for non-ASCII byte-mode payloads", () => {
  assert.equal(getQrPayloadHeaderBits("é").join(""), "011100011010010000000010");
  assert.equal(getQrPayloadHeaderBits("A").join(""), "010000000001");
});

test("accounts for the UTF-8 ECI header when selecting QR capacity", () => {
  const maximum = generateQrCode("a".repeat(103) + "é");
  assert.equal(maximum.version, 6);
  assert.equal(maximum.byteLength, 105);
  assert.throws(() => generateQrCode("a".repeat(104) + "é"), RangeError);
});
