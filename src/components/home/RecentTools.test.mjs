import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = new URL(".", import.meta.url);
const component = readFileSync(fileURLToPath(new URL("./RecentTools.tsx", here)), "utf8");
const tracker = readFileSync(fileURLToPath(new URL("../tools/ToolPage/RecentToolTracker.tsx", here)), "utf8");
const provider = readFileSync(fileURLToPath(new URL("./RecentToolsProvider.tsx", here)), "utf8");
const layout = readFileSync(fileURLToPath(new URL("../../app/[locale]/layout.tsx", here)), "utf8");
const home = readFileSync(fileURLToPath(new URL("../../app/[locale]/page.tsx", here)), "utf8");
const messages = readFileSync(fileURLToPath(new URL("../../lib/i18n/messages.ts", here)), "utf8");

test("recent tools are recorded by the shared tool page and rendered on the home page", () => {
  assert.match(tracker, /recordTool\(toolId\)/);
  assert.match(provider, /recordRecentTool\(current, toolId, validIds\)/);
  assert.match(layout, /<RecentToolsProvider toolIds=\{toolIds\}>/);
  assert.match(home, /<RecentTools locale=\{locale\} tools=\{recentTools\} \/>/);
  assert.match(home, /getPublishedTools\(\)\.map/);
});

test("recent tools stay in memory for the current tab and can be cleared", () => {
  assert.match(provider, /useState<ToolId\[\]>\(\[\]\)/);
  assert.match(provider, /localStorage\.removeItem\(LEGACY_RECENT_TOOLS_STORAGE_KEY\)/);
  assert.doesNotMatch(provider, /localStorage\.(getItem|setItem)|sessionStorage|fetch\(|createClient\(|supabase/);
  assert.doesNotMatch(tracker, /localStorage|sessionStorage|fetch\(|createClient\(|supabase/);
  assert.doesNotMatch(component, /localStorage|sessionStorage/);
  assert.match(component, /clearRecentTools/);
  assert.match(component, /getToolPath\(locale, tool\.id\)/);
});

test("recent tools labels explain their session scope in French and English", () => {
  assert.match(messages, /recentToolsDescription: "Outils ouverts pendant cette session\."/);
  assert.match(messages, /recentToolsDescription: "Opened during this session\."/);
  assert.match(messages, /clearRecentTools: "Effacer les récents"/);
  assert.match(messages, /clearRecentTools: "Clear recent tools"/);
});
