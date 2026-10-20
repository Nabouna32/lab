import assert from "node:assert/strict";
import test from "node:test";
import { createToolShareUrl } from "./share-url.ts";

test("shares the current localized tool path without query or fragment state", () => {
  assert.equal(
    createToolShareUrl("https://loculary.example", "/fr/outils/formateur-json?draft=1#result"),
    "https://loculary.example/fr/outils/formateur-json",
  );
});

test("resolves a root-relative tool path against the current origin", () => {
  assert.equal(
    createToolShareUrl("https://loculary.example/", "/en/tools/json-formatter"),
    "https://loculary.example/en/tools/json-formatter",
  );
});
