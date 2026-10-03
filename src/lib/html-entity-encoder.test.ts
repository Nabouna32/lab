import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeHtmlEntities, encodeHtmlEntities, transformHtmlEntities } from "./html-entity-encoder.ts";

describe("html entity transformation", () => {
  it("encodes HTML-special characters", () => {
    assert.equal(encodeHtmlEntities(`<p class="note">Tom & Jerry's</p>`), "&lt;p class=&quot;note&quot;&gt;Tom &amp; Jerry&#39;s&lt;/p&gt;");
  });

  it("decodes named entities", () => {
    assert.equal(decodeHtmlEntities("&lt;strong&gt;Hello&nbsp;&amp;&nbsp;goodbye&lt;/strong&gt;"), "<strong>Hello\u00a0&\u00a0goodbye</strong>");
    assert.equal(decodeHtmlEntities("&copy; 2026 &euro;"), "© 2026 €");
  });

  it("decodes decimal and hexadecimal numeric references", () => {
    assert.equal(decodeHtmlEntities("&#60;div&#62;"), "<div>");
    assert.equal(decodeHtmlEntities("&#x1F600;"), "😀");
  });

  it("leaves invalid numeric references unchanged", () => {
    assert.equal(decodeHtmlEntities("&#x110000; &#55296;"), "&#x110000; &#55296;");
  });

  it("supports both explicit modes", () => {
    assert.equal(transformHtmlEntities("<b>&</b>", "encode"), "&lt;b&gt;&amp;&lt;/b&gt;");
    assert.equal(transformHtmlEntities("&lt;b&gt;", "decode"), "<b>");
  });

  it("does not transform ordinary text", () => {
    assert.equal(transformHtmlEntities("hello world", "encode"), "hello world");
    assert.equal(transformHtmlEntities("hello world", "decode"), "hello world");
  });
});
