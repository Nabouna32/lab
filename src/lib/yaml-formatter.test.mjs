import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_YAML_ALIAS_COUNT,
  MAX_YAML_INPUT_LENGTH,
  formatYaml,
  getYamlFormatError,
} from "./yaml-formatter.ts";

test("formats YAML with two-space indentation and keeps comments", () => {
  const result = formatYaml("root:\n    name: Loculary # product\n    tools: [JSON, YAML]", 2);

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.match(result.formatted, /root:\n  name: Loculary # product/);
  assert.match(result.formatted, /tools: \[ JSON, YAML \]/);
});

test("supports four-space indentation", () => {
  const result = formatYaml("root:\n  child:\n    value: true", 4);

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.match(result.formatted, /root:\n    child:\n        value: true/);
});

test("reports syntax errors with source position", () => {
  const result = formatYaml("root: [one", 2);

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.kind, "invalid");
  assert.ok(result.error.line >= 1);
  assert.ok(result.error.column >= 1);
  assert.ok(result.error.message.length > 0);
  assert.equal(getYamlFormatError("root: [")?.kind, "invalid");
});

test("rejects empty input", () => {
  assert.equal(getYamlFormatError("   ")?.kind, "empty");
});

test("rejects oversized input before parsing", () => {
  assert.equal(getYamlFormatError("a".repeat(MAX_YAML_INPUT_LENGTH + 1))?.kind, "resource");
});

test("limits alias expansion", () => {
  const aliases = Array.from(
    { length: MAX_YAML_ALIAS_COUNT + 1 },
    (_, index) => "value" + index + ": *base",
  ).join("\n");
  const result = formatYaml("base: &base value\n" + aliases, 2);

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error.kind, "resource");
});
