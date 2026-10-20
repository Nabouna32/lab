import assert from "node:assert/strict";
import { test } from "node:test";
import { convertJsonYaml, MAX_JSON_YAML_INPUT_LENGTH } from "./json-yaml-converter.ts";

test("converts JSON objects and arrays to YAML and back without changing values", () => {
  const json = JSON.stringify({ name: "Loculary", enabled: true, count: 3, tools: ["JSON", "YAML"] }, null, 2);
  const yaml = convertJsonYaml(json, "json-to-yaml");
  assert.equal(yaml.ok, true);
  if (!yaml.ok) return;
  assert.match(yaml.value, /name: Loculary/);

  const roundTrip = convertJsonYaml(yaml.value, "yaml-to-json");
  assert.equal(roundTrip.ok, true);
  if (!roundTrip.ok) return;
  assert.deepEqual(JSON.parse(roundTrip.value), JSON.parse(json));
});

test("supports JSON scalar roots and null", () => {
  for (const json of ["null", "true", "42", '"hello"']) {
    const yaml = convertJsonYaml(json, "json-to-yaml");
    assert.equal(yaml.ok, true, json);
    if (!yaml.ok) continue;
    const back = convertJsonYaml(yaml.value, "yaml-to-json");
    assert.equal(back.ok, true, json);
    if (back.ok) assert.deepEqual(JSON.parse(back.value), JSON.parse(json));
  }
});

test("rejects malformed JSON and YAML with actionable positions", () => {
  const json = convertJsonYaml('{"name": }', "json-to-yaml");
  assert.equal(json.ok, false);
  if (!json.ok) {
    assert.equal(json.error.kind, "invalid");
    assert.ok(json.error.column > 1);
  }

  const yaml = convertJsonYaml("name: [", "yaml-to-json");
  assert.equal(yaml.ok, false);
  if (!yaml.ok) assert.equal(yaml.error.kind, "invalid");
});

test("rejects YAML values that JSON cannot represent without loss", () => {
  const result = convertJsonYaml("value: .inf", "yaml-to-json");
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.kind, "unsupported");
});

test("enforces a shared input size limit and rejects empty input", () => {
  assert.equal(convertJsonYaml("  ", "yaml-to-json").ok, false);
  const oversized = convertJsonYaml("x".repeat(MAX_JSON_YAML_INPUT_LENGTH + 1), "json-to-yaml");
  assert.equal(oversized.ok, false);
  if (!oversized.ok) assert.equal(oversized.error.kind, "resource");
});

test("rejects duplicate YAML keys instead of silently losing a value", () => {
  const result = convertJsonYaml("name: first\nname: second", "yaml-to-json");
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.kind, "invalid");
});
