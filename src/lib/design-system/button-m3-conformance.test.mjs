import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");

test("shared Button exposes M3 variants and prevents squeezed multi-line labels", () => {
  for (const variant of ["primary", "elevated", "tonal", "outlined", "text"]) {
    assert.ok(button.includes(variant + ":"), "missing button variant: " + variant);
  }
  assert.match(button, /min-h-10/);
  assert.match(button, /min-w-16/);
  assert.match(button, /whitespace-nowrap/);
  assert.match(button, /shrink-0/);
  assert.match(button, /px-6/);
  assert.match(button, /text-sm font-medium leading-5/);
  assert.match(button, /var\(--secondary-container\)/);
  assert.match(button, /var\(--on-secondary-container\)/);
});

test("shared IconButton preserves 48px touch target and supports accessible toggle state", () => {
  assert.match(iconButton, /h-12 min-h-12 w-12 min-w-12/);
  assert.match(iconButton, /selected\?: boolean/);
  assert.match(iconButton, /aria-pressed=\{selected\}/);
  assert.match(iconButton, /var\(--secondary-container\)/);
  assert.match(iconButton, /var\(--on-secondary-container\)/);
  assert.match(iconButton, /label: string/);
});

test("button compatibility variants are explicitly distinguished from canonical M3 variants", () => {
  assert.match(button, /App-specific compatibility variants/);
  assert.match(button, /primary.*compatibility name for M3's filled button/s);
});
