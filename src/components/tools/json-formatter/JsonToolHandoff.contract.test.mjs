import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const formatter = readFileSync(new URL("./JsonFormatter.tsx", import.meta.url), "utf8");
const comparator = readFileSync(new URL("../json-diff-checker/JsonDiffChecker.tsx", import.meta.url), "utf8");
const typescript = readFileSync(new URL("../json-to-typescript/JsonToTypeScript.tsx", import.meta.url), "utf8");
const csv = readFileSync(new URL("../csv-json/CsvJsonConverter.tsx", import.meta.url), "utf8");
const yaml = readFileSync(new URL("../yaml-formatter-validator/YamlFormatterValidator.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");
const transfer = readFileSync(new URL("../../../lib/tools/json-transfer.ts", import.meta.url), "utf8");

test("JSON formatter can send its result to either compatible JSON tool", () => {
  assert.match(formatter, /writePendingJsonToolTransfer\(window\.sessionStorage, result, target\)/);
  assert.match(formatter, /sendToTool\("json-diff-checker"\)/);
  assert.match(formatter, /sendToTool\("json-to-typescript"\)/);
  assert.match(formatter, /t\.sendToCompare/);
  assert.match(formatter, /t\.sendToTypescript/);
});

test("CSV-to-JSON output can flow directly to comparison or TypeScript generation", () => {
  assert.match(csv, /operation === "csv-to-json"/);
  assert.match(csv, /sendToTool\("json-diff-checker"\)/);
  assert.match(csv, /sendToTool\("json-to-typescript"\)/);
});

test("YAML-to-JSON output can flow directly to comparison or TypeScript generation", () => {
  assert.match(yaml, /operation === "yaml-to-json"/);
  assert.match(yaml, /sendToTool\("json-diff-checker"\)/);
  assert.match(yaml, /sendToTool\("json-to-typescript"\)/);
});

test("receivers consume only their own targeted, one-time JSON transfer", () => {
  assert.match(comparator, /consumePendingJsonComparison\(window\.sessionStorage\)/);
  assert.match(comparator, /setRight\(transferred\)/);
  assert.match(typescript, /consumePendingJsonToolTransfer\(window\.sessionStorage, "json-to-typescript"\)/);
  assert.match(typescript, /setInput\(transferred\)/);
  assert.match(typescript, /t\.receivedFromTool/);
  assert.match(transfer, /JSON_TOOL_TRANSFER_MAX_CHARS = 200_000/);
  assert.match(transfer, /JSON_TOOL_TRANSFER_TTL_MS/);
  assert.match(transfer, /storage\.removeItem\(JSON_TOOL_TRANSFER_KEY\)/);
  assert.match(transfer, /JSON\.parse\(transfer\.value\)/);
});

test("handoff controls and receiver notices are localized in French and English", () => {
  assert.match(messages, /sendToCompare: "Comparer ce JSON"/);
  assert.match(messages, /sendToCompare: "Compare this JSON"/);
  assert.match(messages, /sendToTypescript: "Générer les types TypeScript"/);
  assert.match(messages, /sendToTypescript: "Generate TypeScript types"/);
  assert.match(messages, /receivedFromFormatter: "Le JSON transmis/);
  assert.match(messages, /receivedFromFormatter: "The transferred JSON/);
  assert.match(messages, /receivedFromTool: "JSON transmis depuis un autre outil/);
  assert.match(messages, /receivedFromTool: "JSON received from another tool/);
});

test("JSON formatter exposes documented path extraction with French and English messages", () => {
  assert.match(formatter, /extractJsonPath\(input, jsonPath\)/);
  assert.match(formatter, /t\.extractTitle/);
  assert.match(formatter, /t\.extractedResult/);
  assert.match(messages, /Extraire une valeur par chemin/);
  assert.match(messages, /Extract a value by path/);
  assert.match(messages, /Syntaxe prise en charge/);
  assert.match(messages, /Supported syntax/);
});
