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
    /<p role="status" aria-live="polite" aria-atomic="true" className="m3-type-label-medium rounded-full bg-\[var\(--surface-soft\)\]/,
  );
});

test("ToolSearch lets users dismiss suggestions with Escape and reopen them", () => {
  assert.match(toolSearchSource, /const \[isSuggestionsDismissed, setIsSuggestionsDismissed\] = useState\(false\);/);
  assert.match(toolSearchSource, /const showResults = isFocused && !isSuggestionsDismissed && query\.trim\(\)\.length > 0;/);
  assert.match(toolSearchSource, /setIsSuggestionsDismissed\(true\);\s*setActiveIndex\(-1\);\s*setOverlayPosition\(null\);/);
  assert.match(toolSearchSource, /isSuggestionsDismissed && event\.key === "ArrowDown" && query\.trim\(\)/);
  assert.match(toolSearchSource, /setQuery\(nextQuery\); setIsSuggestionsDismissed\(false\); setActiveIndex\(-1\);/);
});
