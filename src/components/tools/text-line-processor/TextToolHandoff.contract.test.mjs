import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./TextLineProcessor.tsx", import.meta.url), "utf8");
const receiver = readFileSync(new URL("../text-diff-checker/TextDiffChecker.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");
const transfer = readFileSync(new URL("../../../lib/tools/text-transfer.ts", import.meta.url), "utf8");

test("cleaned text can be sent directly to the text comparator", () => {
  assert.match(source, /writePendingTextToolTransfer\(window\.sessionStorage, result\)/);
  assert.match(source, /getToolPath\(locale, "text-diff-checker"\)/);
  assert.match(source, /t\.sendToCompare/);
  assert.match(receiver, /consumePendingTextToolTransfer\(window\.sessionStorage\)/);
  assert.match(receiver, /setOriginal\(transferred\)/);
  assert.match(receiver, /t\.receivedFromTool/);
});

test("text handoff stays bounded, local, one-time and short-lived", () => {
  assert.match(transfer, /TEXT_TOOL_TRANSFER_MAX_CHARS = 200_000/);
  assert.match(transfer, /TEXT_TOOL_TRANSFER_TTL_MS = 5 \* 60 \* 1000/);
  assert.match(transfer, /storage\.removeItem\(TEXT_TOOL_TRANSFER_KEY\)/);
  assert.match(transfer, /target: "text-diff-checker"/);
});

test("handoff labels and receiver notice are localized", () => {
  assert.match(messages, /sendToCompare: "Comparer ce résultat"/);
  assert.match(messages, /sendToCompare: "Compare this result"/);
  assert.match(messages, /receivedFromTool: "Résultat nettoyé reçu/);
  assert.match(messages, /receivedFromTool: "Cleaned result received/);
});
