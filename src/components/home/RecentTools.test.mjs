import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = new URL(".", import.meta.url);
const component = readFileSync(fileURLToPath(new URL("./RecentTools.tsx", here)), "utf8");
const tracker = readFileSync(fileURLToPath(new URL("../tools/ToolPage/RecentToolTracker.tsx", here)), "utf8");
const home = readFileSync(fileURLToPath(new URL("../../app/[locale]/page.tsx", here)), "utf8");
const messages = readFileSync(fileURLToPath(new URL("../../lib/i18n/messages.ts", here)), "utf8");

test("recent tools are recorded by the shared tool page and rendered on the home page", () => {
  assert.match(tracker, /RECENT_TOOLS_STORAGE_KEY/);
  assert.match(tracker, /recordRecentTool\(current, toolId, validToolIds\)/);
  assert.match(home, /<RecentTools locale=\{locale\} tools=\{recentTools\} \/>/);
  assert.match(home, /getPublishedTools\(\)\.map/);
});

test("recent history stores tool IDs only, stays local, and can be cleared", () => {
  assert.match(tracker, /localStorage\.setItem\(RECENT_TOOLS_STORAGE_KEY, JSON\.stringify\(next\)\)/);
  assert.doesNotMatch(tracker, /fetch\(|createClient\(|supabase/);
  assert.match(component, /localStorage\.removeItem\(RECENT_TOOLS_STORAGE_KEY\)/);
  assert.match(component, /getToolPath\(locale, tool\.id\)/);
});

test("recent tools labels are localized in French and English", () => {
  assert.match(messages, /recentToolsTitle: "Reprendre un outil"/);
  assert.match(messages, /recentToolsTitle: "Pick up where you left off"/);
  assert.match(messages, /clearRecentTools: "Effacer l’historique"/);
  assert.match(messages, /clearRecentTools: "Clear history"/);
});
