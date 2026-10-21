import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const component = readFileSync(new URL("./TextLineProcessor.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");

test("line processor exposes accessible cleanup toggles, sort controls, counts, and a resource limit", () => {
  assert.match(component, /type="checkbox"/);
  assert.match(component, /aria-pressed={sortOrder === value}/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /TEXT_LINE_PROCESSOR_MAX_CHARS/);
  assert.match(messages, /textLineProcessor: {/);
  assert.match(messages, /removeDuplicates: "Supprimer les doublons/);
  assert.match(messages, /removeDuplicates: "Remove duplicates/);
});
