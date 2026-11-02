import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const MAX_CHARACTERS = 8000;
const promptFiles = ["COLLABORATIF.md", "PILOTAGE.md", "AUTONOME.md"];

test("each persistent ChatGPT instruction stays within the 8,000-character limit", () => {
  for (const file of promptFiles) {
    const content = readFileSync(new URL(`../chatgpt-instructions/${file}`, import.meta.url), "utf8");
    const codePoints = [...content].length;
    const utf16Units = content.length;
    assert.ok(
      codePoints <= MAX_CHARACTERS && utf16Units <= MAX_CHARACTERS,
      `${file} exceeds ${MAX_CHARACTERS} characters: ${codePoints} Unicode code points; ${utf16Units} UTF-16 code units.`,
    );
  }
});

test("persistent instructions preserve the AndroidX-first contract", () => {
  for (const file of promptFiles) {
    const content = readFileSync(new URL(`../chatgpt-instructions/${file}`, import.meta.url), "utf8");
    assert.match(content, /PRIORITÉ ABSOLUE|priorité absolue/i, file);
    assert.match(content, /action-humaine/, file);
    assert.match(content, /typographie/, file);
    assert.doesNotMatch(content, /point de départ, pas une contrainte absolue/i, file);
  }
});
