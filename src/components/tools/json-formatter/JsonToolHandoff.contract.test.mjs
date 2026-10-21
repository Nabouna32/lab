import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const formatter = readFileSync(new URL("./JsonFormatter.tsx", import.meta.url), "utf8");
const comparator = readFileSync(new URL("../json-diff-checker/JsonDiffChecker.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");
const transfer = readFileSync(new URL("../../../lib/tools/json-transfer.ts", import.meta.url), "utf8");

test("JSON formatter can pass its valid result directly to the comparator", () => {
  assert.match(formatter, /writePendingJsonComparison\(window\.sessionStorage, result\)/);
  assert.match(formatter, /router\.push\(getToolPath\(locale, "json-diff-checker"\)\)/);
  assert.match(formatter, /t\.sendToCompare/);
});

test("JSON comparator consumes the pending document into the new JSON field", () => {
  assert.match(comparator, /consumePendingJsonComparison\(window\.sessionStorage\)/);
  assert.match(comparator, /setRight\(transferred\)/);
  assert.match(comparator, /t\.receivedFromFormatter/);
});

test("handoff is one-time, bounded, validated and localized in both languages", () => {
  assert.match(transfer, /200_000/);
  assert.match(transfer, /storage\.removeItem\(JSON_COMPARISON_TRANSFER_KEY\)/);
  assert.match(transfer, /JSON\.parse\(value\)/);
  assert.match(messages, /sendToCompare: "Comparer avec un autre JSON"/);
  assert.match(messages, /sendToCompare: "Compare with another JSON"/);
  assert.match(messages, /receivedFromFormatter: "Le JSON formaté/);
  assert.match(messages, /receivedFromFormatter: "The formatted JSON/);
});
