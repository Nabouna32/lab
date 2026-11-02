import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const page = read("./ToolPage.tsx");
const header = read("./ToolPageHeader.tsx");
const status = read("./ToolProcessingStatus.tsx");
const related = read("../RelatedTools.tsx");
const route = read("../../../app/[locale]/[section]/[slug]/page.tsx");
const favorite = read("../../favorites/FavoriteButton.tsx");
const share = read("./ShareToolButton.tsx");
const tooltip = read("../../ui/Tooltip.tsx");

test("tool page separates the runtime, next actions and editorial content", () => {
  assert.ok(page.includes("runtime: ReactNode"));
  assert.ok(page.includes("<ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>"));
  assert.ok(page.includes("{runtime}"));
  assert.doesNotMatch(page, /data-tool-surface|<ToolProcessingStatus/);
  assert.ok(page.includes('aria-labelledby="tool-page-title"'));
  assert.ok(route.includes('runtime={<ToolRenderer toolId={entry.tool.id} />}'));
  assert.ok(route.includes('<NextActions toolId={entry.tool.id} locale={locale} />'));
});

test("tool header owns the single semantic header and compact processing status", () => {
  assert.match(header, /<header/);
  assert.match(header, /id="tool-page-title"/);
  assert.match(header, /<ToolProcessingStatus processing=\{processing\}/);
  assert.doesNotMatch(page, /<header/);
  assert.doesNotMatch(status, /<details|<summary|<section/);
  assert.match(status, /openOnClick/);
  assert.match(status, /<IconButton label=\{t\.more\}/);
});

test("next actions render their registered Material icon instead of the raw identifier", () => {
  assert.match(related, /<MaterialIcon name=\{nextAction\.icon\} size=\{24\}/);
  assert.ok(!related.includes('aria-hidden="true">{nextAction.icon}</span>'));
});

test("tool favorites use the official outlined and filled heart symbols", () => {
  assert.match(favorite, /name=\{active \? "favorite_fill" : "favorite"\}/);
});

test("share action uses the official share symbol and Tooltip supports explicit touch activation", () => {
  assert.match(share, /MaterialIcon name="share"/);
  assert.match(share, /<IconButton label=\{messages\.shareTool\}/);
  assert.match(tooltip, /openOnClick\?: boolean/);
  assert.match(tooltip, /event\.key === "Escape"/);
});
