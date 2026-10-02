import assert from "node:assert/strict";
import { test } from "node:test";
import { transformUrlText } from "./url-encoder.ts";

test("encodes a URL component without preserving reserved characters", () => {
  assert.deepEqual(
    transformUrlText("hello world?name=Loculary&lang=fr", "encode", "component"),
    { value: "hello%20world%3Fname%3DLoculary%26lang%3Dfr", error: null },
  );
});

test("encodes a complete URI while preserving URI syntax", () => {
  assert.deepEqual(
    transformUrlText("https://example.com/search?q=hello world&lang=fr", "encode", "uri"),
    { value: "https://example.com/search?q=hello%20world&lang=fr", error: null },
  );
});

test("decodes Unicode URL text", () => {
  assert.deepEqual(
    transformUrlText("caf%C3%A9%20%F0%9F%8C%8D", "decode", "component"),
    { value: "café 🌍", error: null },
  );
});

test("rejects malformed percent encoding", () => {
  assert.deepEqual(
    transformUrlText("hello%2", "decode", "component"),
    { value: null, error: "invalid-encoding" },
  );
});

test("rejects unencodable lone UTF-16 surrogates", () => {
  assert.deepEqual(
    transformUrlText("\uD800", "encode", "component"),
    { value: null, error: "invalid-text" },
  );
});
