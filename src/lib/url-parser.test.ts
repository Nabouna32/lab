import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasSensitiveUrlData, parseUrl } from "./url-parser.ts";

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

describe("hasSensitiveUrlData", () => {
  it("warns for embedded username or password credentials", () => {
    assert.equal(hasSensitiveUrlData({ username: "user", hasPassword: false, hash: "", queryParameters: [] }), true);
    assert.equal(hasSensitiveUrlData({ username: "", hasPassword: true, hash: "", queryParameters: [] }), true);
  });

  it("detects common secret-bearing query parameter names", () => {
    for (const key of ["access_token", "refresh-token", "id_token", "api_key", "api-key", "client_secret", "password", "sessionId", "signature", "code_verifier", "accessToken", "apiKey", "clientSecret"]) {
      assert.equal(
        hasSensitiveUrlData({ username: "", hasPassword: false, hash: "", queryParameters: [{ key, value: "example" }] }),
        true,
        `expected ${key} to be considered sensitive`,
      );
    }
  });

  it("does not warn for ordinary query parameters", () => {
    assert.equal(
      hasSensitiveUrlData({
        username: "",
        hasPassword: false,
        hash: "",
        queryParameters: [{ key: "lang", value: "fr" }, { key: "page", value: "2" }, { key: "monkey", value: "banana" }],
      }),
      false,
    );
  });

  it("detects sensitive OAuth-style parameters in the URL fragment", () => {
    assert.equal(
      hasSensitiveUrlData({
        username: "",
        hasPassword: false,
        hash: "#access_token=example&token_type=bearer",
        queryParameters: [],
      }),
      true,
    );
  });

});
