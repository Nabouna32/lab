import assert from "node:assert/strict";
import { test } from "node:test";
import { transformBase64 } from "./base64.ts";

test("encodes UTF-8 text", () => {
  assert.deepEqual(transformBase64("Hello, café 🌍", "encode"), {
    value: "SGVsbG8sIGNhZsOpIPCfjI0=",
    error: null,
  });
});

test("decodes UTF-8 Base64", () => {
  assert.deepEqual(transformBase64("SGVsbG8sIGNhZsOpIPCfjI0=", "decode"), {
    value: "Hello, café 🌍",
    error: null,
  });
});

test("accepts Base64 without padding and with whitespace", () => {
  assert.deepEqual(transformBase64("SGVsbG8s\n", "decode"), {
    value: "Hello,",
    error: null,
  });
});

test("rejects malformed Base64", () => {
  assert.deepEqual(transformBase64("not-base64!", "decode"), {
    value: null,
    error: "invalid-base64",
  });
});

test("rejects valid Base64 that is not UTF-8 text", () => {
  assert.deepEqual(transformBase64("/w==", "decode"), {
    value: null,
    error: "invalid-base64",
  });
});

test("rejects malformed explicit padding", () => {
  for (const input of ["Zg=", "Zm8==", "A==="]) {
    assert.deepEqual(transformBase64(input, "decode"), {
      value: null,
      error: "invalid-base64",
    });
  }
});

test("rejects non-zero unused bits in padded Base64", () => {
  for (const input of ["Zh==", "Zm9="]) {
    assert.deepEqual(transformBase64(input, "decode"), {
      value: null,
      error: "invalid-base64",
    });
  }
});

test("accepts correctly padded and unpadded canonical Base64", () => {
  assert.deepEqual(transformBase64("Zg==", "decode"), { value: "f", error: null });
  assert.deepEqual(transformBase64("Zg", "decode"), { value: "f", error: null });
  assert.deepEqual(transformBase64("Zm8=", "decode"), { value: "fo", error: null });
  assert.deepEqual(transformBase64("Zm8", "decode"), { value: "fo", error: null });
});
