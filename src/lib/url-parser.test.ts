import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseUrl } from "./url-parser.ts";

describe("parseUrl", () => {
  it("parses an absolute URL and exposes its main components", () => {
    const result = parseUrl("https://user:secret@example.com:8443/docs/page?lang=fr&tag=web&tag=local#intro");

    assert.equal(result.error, null);
    assert.deepEqual(result.value, {
      href: "https://user:secret@example.com:8443/docs/page?lang=fr&tag=web&tag=local#intro",
      origin: "https://example.com:8443",
      protocol: "https:",
      username: "user",
      hasPassword: true,
      host: "example.com:8443",
      hostname: "example.com",
      port: "8443",
      pathname: "/docs/page",
      search: "?lang=fr&tag=web&tag=local",
      hash: "#intro",
      queryParameters: [
        { key: "lang", value: "fr" },
        { key: "tag", value: "web" },
        { key: "tag", value: "local" },
      ],
    });
  });

  it("decodes query parameter values through URLSearchParams", () => {
    const result = parseUrl("https://example.com/search?q=hello%20world&empty=");

    assert.equal(result.error, null);
    assert.deepEqual(result.value?.queryParameters, [
      { key: "q", value: "hello world" },
      { key: "empty", value: "" },
    ]);
  });

  it("accepts non-http URL schemes supported by the URL API", () => {
    const result = parseUrl("mailto:test@example.com");

    assert.equal(result.error, null);
    assert.equal(result.value?.protocol, "mailto:");
  });

  it("rejects empty or malformed input", () => {
    assert.equal(parseUrl("").error, "invalid-url");
    assert.equal(parseUrl("not a URL").error, "invalid-url");
  });

  it("trims surrounding whitespace", () => {
    const result = parseUrl("  https://example.com/path  ");

    assert.equal(result.error, null);
    assert.equal(result.value?.href, "https://example.com/path");
  });
});
