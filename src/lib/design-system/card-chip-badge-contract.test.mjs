import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const card = read("../../components/ui/Card.tsx");
const chip = read("../../components/ui/Chip.tsx");
const chipCss = read("../../components/ui/Chip.module.css");
const badge = read("../../components/ui/Badge.tsx");
const badgeCss = read("../../components/ui/Badge.module.css");

test("Card variants use shared semantic surfaces and keep navigation separate", () => {
  assert.match(card, /bg-\[var\(--surface-container-highest\)\]/);
  assert.match(card, /bg-\[var\(--surface-container-low\)\]/);
  assert.match(card, /border-\[var\(--outline-variant\)\]/);
  assert.match(card, /rounded-\[var\(--m3-card-shape\)\]/);
  assert.match(card, /export function CardLink\([\s\S]*?return <Link href=\{href\}/);
  for (const name of ["Card", "ElevatedCard", "OutlinedCard"]) {
    const start = card.indexOf(`export function ${name}(`);
    const end = card.indexOf("\nexport function ", start + 1);
    const implementation = card.slice(start, end < 0 ? undefined : end);
    assert.match(implementation, /return <div\b/);
    assert.doesNotMatch(implementation, /<Link\b|<button\b/);
  }
});

test("Chip keeps caller click handlers and exposes selectable state accessibly", () => {
  assert.match(chip, /onClick\?\.\(event\)/);
  assert.match(chip, /if \(filter && onSelectedChange && !props\.disabled\) onSelectedChange\(!selected\)/);
  assert.match(chip, /aria-pressed=\{filter \|\| input \? selected : undefined\}/);
  assert.match(chip, /dismissLabel = `Remove \$\{label\}`/);
  assert.match(chip, /disabled=\{props\.disabled\}/);
  assert.match(chipCss, /:disabled/);
  assert.match(chipCss, /var\(--secondary-container/);
  assert.match(chipCss, /var\(--primary/);
  assert.match(chipCss, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(chipCss, /--lab-(?:primary|text|outline|surface-container)/);
});

test("Badge has explicit accessible semantics and uses theme roles", () => {
  assert.match(badge, /role=\{accessibleLabel \? "img" : undefined\}/);
  assert.match(badge, /aria-hidden=\{accessibleLabel \? undefined : true\}/);
  assert.match(badge, /aria-label=\{accessibleLabel\}/);
  assert.match(badgeCss, /color: var\(--on-error\)/);
  assert.match(badgeCss, /background: var\(--error\)/);
  assert.doesNotMatch(badgeCss, /#(?:fff|b3261e)/i);
  assert.doesNotMatch(badge, /aria-label=\{accessibleLabel\}[\s\S]{0,100}data-has-content/);
});
