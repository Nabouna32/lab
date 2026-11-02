import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const editorial = readFileSync(new URL("./ToolEditorial.tsx", import.meta.url), "utf8");
const accordion = readFileSync(new URL("../ToolPage/ToolEditorialAccordion.tsx", import.meta.url), "utf8");
const listItemStyles = readFileSync(new URL("../../ui/ListItem.module.css", import.meta.url), "utf8");

test("percentage editorial keeps all explanations collapsed by default", () => {
  assert.equal((editorial.match(/<ToolEditorialAccordion title=/g) ?? []).length, 3);
  assert.doesNotMatch(editorial, /<ToolSection/);
  assert.doesNotMatch(editorial, /<details[^>]*\bopen\b/);
});

test("the new disclosure follows the pinned ListItem visual roles without inventing an AndroidX Accordion API", () => {
  assert.match(accordion, /<details/);
  assert.match(accordion, /<summary/);
  assert.match(accordion, /m3-type-body-large/);
  assert.match(accordion, /var\(--on-surface-variant\)/);
  assert.match(accordion, /var\(--m3-size-list-item-one-line-min-height\)/);
  assert.match(accordion, /keyboard_arrow_down/);
  assert.match(accordion, /AndroidX Material 3 does not expose an Accordion component/);
  assert.match(listItemStyles, /m3-type-body-large-size/);
  assert.match(listItemStyles, /--m3-space-4/);
});

test("the new disclosure uses a continuous two-column explanation while the legacy card remains unchanged for comparison", () => {
  assert.match(editorial, /const differenceExplanation =/);
  assert.match(editorial, /const newDifferenceExplanation =/);
  assert.match(editorial, /<ToolEditorialAccordion title={t.difference.title}>\s*\{newDifferenceExplanation\}/);
  assert.match(editorial, /<details className="group rounded-2xl/);
  assert.match(editorial, /\{differenceExplanation\}/);
  assert.match(editorial, /text-xl font-bold sm:text-2xl/);
  assert.match(editorial, /lg:border-l lg:border-\[var\(--outline-variant\)\] lg:pl-8/);
  assert.ok(editorial.indexOf("<ToolEditorialAccordion title={t.difference.title}>") < editorial.indexOf('<details className="group rounded-2xl'));
  const newDisclosure = editorial.slice(editorial.indexOf("const newDifferenceExplanation ="), editorial.indexOf("\n\n  return ("));
  assert.doesNotMatch(newDisclosure, /rounded-2xl border border-\[var\(--border\)\] bg-\[var\(--background\)\]/);
});
