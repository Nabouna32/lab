import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const page = read("./ToolPage.tsx");
const header = read("./ToolPage.tsx"); // header is now inline in ToolPage.tsx
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
  assert.match(page, /ToolProcessingStatus processing/);
  assert.ok(page.includes('aria-labelledby="tool-page-title"'));
  assert.ok(page.includes("motion-reveal"));
  assert.ok(page.includes("<NextActions toolId={tool.id} locale={locale} />"));
  assert.ok(page.indexOf("{children}") < page.indexOf("</section>"));
  assert.ok(page.indexOf("{content}") > page.indexOf("{children}"));
  assert.ok(page.includes("tool-page-editorial-stack"));
  assert.ok(page.includes('style={{ width: "100%", alignItems: "stretch" }}'), "editorial Column explicitly stretches its sections across the available width");
  assert.match(page, /ToolProcessingStatus processing/);
  assert.ok(route.includes('runtime={<ToolRenderer toolId={entry.tool.id} />}'));
  assert.ok(route.includes('<NextActions toolId={entry.tool.id} locale={locale} />'));
  assert.ok(page.indexOf("{children}") < page.indexOf("{content}"));
});

test("tool header and workspace share one continuous page surface", () => {
  assert.match(header, /<header/);
  assert.match(header, /id="tool-page-title"/);
  assert.match(header, /<ToolProcessingStatus processing/);
  assert.ok(header.indexOf("<ToolProcessingStatus") > header.indexOf("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"));
  assert.ok(status.includes("rounded-full border border-[var(--border)] bg-[var(--surface-soft)]"));
  assert.match(page, /<header/);
  
  assert.match(status, /openOnClick/);
  assert.match(status, /<button[\s\S]*aria-label=\{t\.more\}/);
  
  assert.ok(header.includes("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"));
});

test("next actions render their registered Material icon instead of the raw identifier", () => {
  assert.match(related, /<MaterialIcon name=\{nextAction\.icon\} size=\{24\}/);
  assert.ok(!related.includes('aria-hidden="true">{nextAction.icon}</span>'));
});

test("tool favorites use the official outlined and filled heart symbols", () => {
  assert.match(favorite, /name=\{active \? "favorite_fill" : "favorite"\}/);
  assert.match(favorite, /<Tooltip content=\{label\}>/);
  assert.ok(favorite.includes("IconToggleButton")); assert.ok(favorite.includes("label={label}")); assert.ok(favorite.includes("checked={active}"));
  assert.ok(!favorite.includes(`label={label}\n          title={label}`));
});

test("share action uses the official share symbol and Tooltip supports explicit touch activation", () => {
  assert.match(share, /MaterialIcon name="share"/);
  assert.match(share, /<IconButton label=\{messages\.shareTool\} onClick=\{handleShare\}>/);
  assert.doesNotMatch(share, /title=\{messages\.shareTool\}/);
  assert.ok(!share.includes("{messages.shareTool}</span>"));
  assert.match(tooltip, /openOnClick\?: boolean/);
  assert.match(tooltip, /event\.key === "Escape"/);
  assert.match(tooltip, /useLayoutEffect/);
  assert.match(tooltip, /viewportWidth/);
  assert.match(tooltip, /window\.addEventListener\("scroll", updatePosition, true\)/);
});


test("processing info action is inside the compact badge without using IconButton", () => {
  const badgeStart = status.indexOf('className="inline-flex min-h-9 min-w-0 max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] sm:text-sm"');
  const tooltipEnd = status.indexOf("</Tooltip>", badgeStart);
  const badgeEnd = status.indexOf("</span>", tooltipEnd);
  const tooltipIndex = status.indexOf("<Tooltip", badgeStart);
  const infoButtonIndex = status.indexOf("<button", tooltipIndex);
  assert.ok(badgeStart >= 0);
  assert.ok(tooltipIndex > badgeStart && tooltipIndex < badgeEnd);
  assert.ok(infoButtonIndex > tooltipIndex && infoButtonIndex < badgeEnd);
  assert.match(status, /className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0/);
  
});

test("related-tool icons use the foreground role paired with their primary container", () => {
  assert.match(related, /bg-\[var\(--primary-container\)\] text-\[var\(--on-primary-container\)\]/);
  assert.doesNotMatch(related, /bg-\[var\(--accent-soft\)\] text-\[var\(--on-surface-variant\)\]/);
});
