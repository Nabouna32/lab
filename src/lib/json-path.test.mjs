import assert from "node:assert/strict";
import { test } from "node:test";
import { extractJsonPath, JsonPathError } from "./json-path.ts";

const sample = JSON.stringify({
  user: { name: "Ada", "display name": "Ada Lovelace", active: true },
  users: [{ email: "ada@example.com" }, { email: "grace@example.com" }],
  nullable: null,
});

test("extracts root, nested properties, array indices, and quoted keys", () => {
  assert.deepEqual(extractJsonPath(sample, "$"), JSON.parse(sample));
  assert.equal(extractJsonPath(sample, "$.user.name"), "Ada");
  assert.equal(extractJsonPath(sample, "$.users[1].email"), "grace@example.com");
  assert.equal(extractJsonPath(sample, "$['display name']"), undefined);
  assert.equal(extractJsonPath(sample, "$.user['display name']"), "Ada Lovelace");
  assert.equal(extractJsonPath(sample, "$.nullable"), null);
});

test("does not confuse absent properties with falsey JSON values", () => {
  const input = '{"zero":0,"no":false,"empty":"","nil":null}';
  assert.equal(extractJsonPath(input, "$.zero"), 0);
  assert.equal(extractJsonPath(input, "$.no"), false);
  assert.equal(extractJsonPath(input, "$.empty"), "");
  assert.equal(extractJsonPath(input, "$.nil"), null);
});

test("reports unsupported path syntax separately from missing values", () => {
  assert.throws(() => extractJsonPath(sample, "user.name"), (error) => error instanceof JsonPathError && error.code === "invalid-path");
  assert.throws(() => extractJsonPath(sample, "$.users[*]"), (error) => error instanceof JsonPathError && error.code === "invalid-path");
  assert.throws(() => extractJsonPath(sample, "$.missing"), (error) => error instanceof JsonPathError && error.code === "not-found");
  assert.throws(() => extractJsonPath("{", "$"), (error) => error instanceof JsonPathError && error.code === "invalid-json");
});
