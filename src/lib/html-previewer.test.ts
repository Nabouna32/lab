import assert from "node:assert/strict";
import test from "node:test";
import { createHtmlPreviewDocument } from "./html-previewer.ts";

test("wraps an HTML fragment in a document", () => {
  const result = createHtmlPreviewDocument("<h1>Hello</h1>");
  assert.ok(result.startsWith("<!doctype html><html>"));
  assert.ok(result.includes("<h1>Hello</h1>"));
  assert.ok(result.includes("Content-Security-Policy"));
});

test("injects the policy into an existing head", () => {
  const result = createHtmlPreviewDocument("<!doctype html><html><head><title>Test</title></head><body>Hello</body></html>");
  assert.equal((result.match(/Content-Security-Policy/g) ?? []).length, 1);
  assert.ok(result.includes('<head><meta http-equiv="Content-Security-Policy"'));
});

test("injects a head when a full HTML document has no head", () => {
  const result = createHtmlPreviewDocument("<html><body><p>Test</p></body></html>");
  assert.ok(result.includes('<html><head><meta http-equiv="Content-Security-Policy"'));
});

test("keeps empty input empty", () => {
  assert.equal(createHtmlPreviewDocument("  "), "");
});

test("restricts network-capable resource types to local data", () => {
  const result = createHtmlPreviewDocument('<img src="https://example.com/image.png">');
  assert.ok(result.includes("img-src data: blob:"));
  assert.ok(result.includes("default-src 'none'"));
});
