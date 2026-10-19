import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toolSearchSource = readFileSync(
  new URL("../../components/tools/ToolSearch.tsx", import.meta.url),
  "utf8",
);

test("ToolSearch exposes expanded state whenever its popup is actually open", () => {
  assert.match(toolSearchSource, /const isPopupOpen = showResults && overlayPosition !== null;/);
  assert.match(toolSearchSource, /aria-expanded={isPopupOpen}/);
  assert.match(toolSearchSource, /aria-controls={hasVisibleResults \? resultsId : undefined}/);
  assert.match(
    toolSearchSource,
    /aria-activedescendant={hasVisibleResults && activeIndex >= 0 \? instanceId \+ "-result-" \+ activeIndex : undefined}/,
  );
  assert.match(toolSearchSource, /{isPopupOpen && typeof document !== "undefined" && createPortal\(/);
});

test("ToolSearch announces the changing suggestion count to assistive technology", () => {
  assert.match(
    toolSearchSource,
    /<p role="status" aria-live="polite" aria-atomic="true" className="rounded-full bg-\[var\(--surface-soft\)\]/,
  );
});
