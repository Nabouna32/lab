import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const component = readFileSync(new URL("./YamlFormatterValidator.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");

test("YAML syntax errors expose parser diagnostics with localized labels", () => {
  assert.ok(component.includes("error.message"));
  assert.ok(component.includes("errorDetailLabel"));
  assert.ok(messages.includes('errorDetailLabel: "Détail technique :"'));
  assert.ok(messages.includes('errorDetailLabel: "Parser detail:"'));
});

test("resource-limit errors keep the generic localized safety message", () => {
  assert.ok(component.includes('error.kind === "resource"'));
  assert.ok(component.includes("t.resourceLimit"));
});

test("JSON/YAML conversion actions are exposed with localized labels and explicit data-loss handling", () => {
  assert.ok(component.includes('value="yaml-to-json"'));
  assert.ok(component.includes('value="json-to-yaml"'));
  assert.ok(component.includes("convertJsonYaml"));
  assert.ok(component.includes("t.unsupportedValue"));
  assert.ok(messages.includes('yamlToJson: "Convertir YAML → JSON"'));
  assert.ok(messages.includes('yamlToJson: "Convert YAML → JSON"'));
});
