import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const MAX_CHARACTERS = 8000;
const promptFiles = ["COLLABORATIF.md", "PILOTAGE.md", "AUTONOME.md"];

test("each persistent ChatGPT instruction stays within the 8,000-character limit", () => {
  for (const file of promptFiles) {
    const content = readFileSync(new URL(`../../docs/chatgpt-instructions/${file}`, import.meta.url), "utf8");
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
    const content = readFileSync(new URL(`../../docs/chatgpt-instructions/${file}`, import.meta.url), "utf8");
    assert.match(content, /PRIORITÉ ABSOLUE|priorité absolue/i, file);
    assert.match(content, /action-humaine/, file);
    assert.match(content, /typographie/, file);
    assert.doesNotMatch(content, /point de départ, pas une contrainte absolue/i, file);
  }
});

test("persistent instructions require general human-action escalation and preserve AndroidX accessibility escalation", () => {
  for (const file of promptFiles) {
    const content = readFileSync(new URL(`../../docs/chatgpt-instructions/${file}`, import.meta.url), "utf8");
    assert.match(content, /action-humaine/i, `${file} must define human-action escalation`);
    assert.match(content, /action, une décision|action, décision|action humaine/i, `${file} must cover general human intervention`);
    assert.match(content, /écart d'accessibilité réel|conflit AndroidX\/accessibilité/i, `${file} must preserve the AndroidX accessibility escalation`);
    assert.match(content, /AndroidX/i, `${file} must retain the AndroidX-first contract`);
  }
});

test("persistent instructions preserve semantic response markers and the Web accessibility objective", () => {
  const requiredMarkers = ["🔍 constats", "⚠️ risques", "❌ problèmes", "💡 propositions/recommandations", "✅ validations/résultats", "🛠️ actions", "🧪 tests/vérifications", "📌 décisions"];
  for (const file of promptFiles) {
    const content = readFileSync(new URL(`../../docs/chatgpt-instructions/${file}`, import.meta.url), "utf8");
    for (const marker of requiredMarkers) {
      assert.ok(content.includes(marker), `${file} is missing the semantic response marker: ${marker}`);
    }
    assert.match(content, /WCAG 2\.2 AA/, `${file} must state the Web accessibility objective`);
    assert.match(content, /ton chaleureux, naturel et clair/i, `${file} must preserve the response tone`);
  }
});
