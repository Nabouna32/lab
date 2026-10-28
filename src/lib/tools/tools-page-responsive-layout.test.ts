import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const toolsPageSource = readSource("../../app/[locale]/[section]/page.tsx");
const toolCardSource = readSource("../../components/tools/ToolCard.tsx");

test("tools page constrains its responsive grid to the available inline size", () => {
  assert.ok(
    toolsPageSource.includes("grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]"),
    "the single-column layout must use a zero-minimum track below the desktop breakpoint",
  );
  assert.ok(
    toolsPageSource.includes('className="mt-5 grid min-w-0 gap-2 sm:grid-cols-2"'),
    "the category grid must be allowed to shrink within the page content",
  );
  assert.ok(
    toolsPageSource.includes("group flex min-w-0 min-h-20 items-center"),
    "category cards must not impose their min-content width on the grid",
  );
  assert.equal(
    [...toolsPageSource.matchAll(/className="mt-5 min-w-0 divide-y/g)].length,
    2,
    "both intent and all-tools lists must remain constrained to the available width",
  );
});

test("tools page avoids decorative numbering that adds no information", () => {
  assert.ok(
    !toolsPageSource.includes("String(index + 1).padStart(2, \"0\")"),
    "category cards must not display an index as if it carried meaning",
  );
  assert.ok(
    !toolsPageSource.includes('text-[var(--accent)]">01</p>') && !toolsPageSource.includes('text-[var(--accent)]">02</p>'),
    "section headings and intent results must not display decorative sequence numbers",
  );
});

test("tool cards fill but can shrink within their list container", () => {
  assert.ok(
    toolCardSource.includes("group block w-full min-w-0") && toolCardSource.includes("min-h-40 w-full min-w-0"),
    "tool links should fill their row without imposing an intrinsic minimum width",
  );
});
