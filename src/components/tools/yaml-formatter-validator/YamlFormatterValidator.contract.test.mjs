import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const component = readFileSync(new URL("./YamlFormatterValidator.tsx", import.meta.url), "utf8");
const messages = readFileSync(new URL("../../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");

test("YAML syntax errors expose parser diagnostics with localized labels", () => {
  assert.match(component, /error\\.message/);
  assert.match(component, /errorDetailLabel/);
  assert.match(messages, /errorDetailLabel: "Détail technique :"/);
  assert.match(messages, /errorDetailLabel: "Parser detail:"/);
});

test("resource-limit errors keep the generic localized safety message", () => {
  assert.match(component, /error\\.kind === "resource" \\? \\([\\s\\S]*?t\\.resourceLimit/);
});
