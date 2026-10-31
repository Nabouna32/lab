import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./ToolSearch.tsx", import.meta.url), "utf8");

test("les suggestions du panneau de recherche utilisent SuggestionChip", () => {
  const start = source.indexOf("t.tools.noResultsSuggestions.map((suggestion) => (");
  const end = source.indexOf("</div>", start);
  const suggestions = source.slice(start, end);
  assert.ok(start >= 0);
  assert.ok(source.includes('import { Chip } from "@/components/ui/Chip"'));
  assert.ok(suggestions.includes('variant="suggestion"'));
  assert.ok(suggestions.includes("label={suggestion}"));
  assert.ok(suggestions.includes('className="min-h-10"'));
  assert.ok(suggestions.includes("onMouseDown={(event) => event.preventDefault()}"));
  assert.ok(!suggestions.includes("<button"));
});

test("une suggestion conserve le popup, met à jour la requête et rend le focus au champ", () => {
  assert.ok(source.includes("popupRef.current?.contains(target)"));
  assert.ok(source.includes("searchRequest.current += 1;"));
  assert.ok(source.includes("setQuery(suggestion);"));
  assert.ok(source.includes("inputRef.current?.focus();"));
});
