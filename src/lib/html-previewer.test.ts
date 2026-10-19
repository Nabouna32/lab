import assert from "node:assert/strict";
import test from "node:test";
import { createHtmlPreviewDocument } from "./html-previewer.ts";

test("places the security policy before an HTML fragment", () => {
  const result = createHtmlPreviewDocument("<h1>Hello</h1>");
  assert.ok(result.startsWith("<!doctype html><meta http-equiv=\"Content-Security-Policy\""));
  assert.ok(result.includes("<h1>Hello</h1>"));
});

test("places the security policy before an existing document head", () => {
  const result = createHtmlPreviewDocument("<!doctype html><html><head><title>Test</title></head><body>Hello</body></html>");
  assert.equal((result.match(/Content-Security-Policy/g) ?? []).length, 1);
  assert.ok(result.indexOf("Content-Security-Policy") < result.indexOf("<html>"));
  assert.ok(result.includes("<title>Test</title>"));
});

test("places the security policy before a document without an explicit head", () => {
  const result = createHtmlPreviewDocument("<html><body><p>Test</p></body></html>");
  assert.ok(result.startsWith("<!doctype html><meta http-equiv=\"Content-Security-Policy\""));
  assert.ok(result.includes("<p>Test</p>"));
});

test("keeps empty input empty", () => {
  assert.equal(createHtmlPreviewDocument("  "), "");
});

test("restricts network-capable resource types to local data", () => {
  const result = createHtmlPreviewDocument('<img src="https://example.com/image.png">');
  assert.ok(result.includes("img-src data: blob:"));
  assert.ok(result.includes("default-src 'none'"));
  assert.ok(result.includes("script-src 'none'"));
  assert.ok(result.includes("frame-src 'none'"));
});

test("does not let a fake head inside a comment swallow the security policy", () => {
  const result = createHtmlPreviewDocument('<!-- <head> --> <img src="https://example.com/tracker.png">');
  assert.ok(result.indexOf("Content-Security-Policy") < result.indexOf("<!--"));
  assert.ok(result.includes('img-src data: blob:'));
});
