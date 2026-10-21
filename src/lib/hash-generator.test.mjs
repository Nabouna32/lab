import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertHashFileSize,
  hashFile,
  hashText,
  verifyDigest,
  MAX_HASH_FILE_BYTES,
} from "./hash-generator.ts";

const abcSha256 = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

test("hashes text with the standard SHA-256 test vector", async () => {
  assert.equal(await hashText("abc", "SHA-256"), abcSha256);
});

test("hashes the exact bytes of a local File", async () => {
  const file = new File(["abc"], "sample.txt", { type: "text/plain" });
  assert.equal(await hashFile(file, "SHA-256"), abcSha256);
});

test("verifies reference digests without case sensitivity", () => {
  assert.equal(verifyDigest(abcSha256, abcSha256.toUpperCase(), "SHA-256"), "match");
  assert.equal(verifyDigest(abcSha256, "0".repeat(64), "SHA-256"), "mismatch");
});

test("rejects malformed checksums for the selected algorithm", () => {
  assert.equal(verifyDigest(abcSha256, "not-a-digest", "SHA-256"), "invalid");
  assert.equal(verifyDigest(abcSha256, "a".repeat(40), "SHA-256"), "invalid");
});

test("enforces the file-size limit without reading oversized files", () => {
  assert.doesNotThrow(() => assertHashFileSize(0));
  assert.doesNotThrow(() => assertHashFileSize(MAX_HASH_FILE_BYTES));
  assert.throws(() => assertHashFileSize(MAX_HASH_FILE_BYTES + 1), /100 MiB limit/);
  assert.throws(() => assertHashFileSize(-1), /size is invalid/);
});
