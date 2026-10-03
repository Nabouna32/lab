import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeJwt, formatDecodedJwt } from "./jwt-decoder.ts";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE3MDAwMDAwMDB9.signature";

describe("decodeJwt", () => {
  it("decodes the header and payload without verifying the signature", () => {
    const result = decodeJwt(token);
    assert.deepEqual(result.header, { alg: "HS256", typ: "JWT" });
    assert.deepEqual(result.payload, { sub: "123", exp: 1700000000 });
    assert.equal(result.signature, "signature");
  });

  it("accepts surrounding whitespace", () => {
    assert.equal(decodeJwt(`  ${token}  `).payload.sub, "123");
  });

  it("rejects tokens with the wrong number of segments", () => {
    assert.throws(() => decodeJwt("one.two"), /three non-empty segments/);
  });

  it("rejects malformed Base64URL JSON", () => {
    assert.throws(() => decodeJwt("abc.@@@.sig"), /base64url|JSON/);
  });

  it("rejects non-object JSON payloads", () => {
    const payload = Buffer.from(JSON.stringify(["not", "an", "object"]), "utf8").toString("base64url");
    assert.throws(() => decodeJwt(`eyJhbGciOiJIUzI1NiJ9.${payload}.sig`), /must be an object/);
  });

  it("formats decoded JSON consistently", () => {
    assert.equal(formatDecodedJwt({ sub: "123", active: true }), '{\n  "sub": "123",\n  "active": true\n}');
  });
});
