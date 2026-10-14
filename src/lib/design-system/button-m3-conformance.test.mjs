import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");

test("shared Button exposes M3 variants and prevents squeezed multi-line labels", () => {
  for (const variant of ["primary", "elevated", "tonal", "outlined", "text"]) {
    assert.ok(button.includes(variant + ":"), "missing button variant: " + variant);
  }
  for (const required of [
    "min-h-10",
    "min-w-16",
    "whitespace-nowrap",
    "shrink-0",
    "px-6",
    "text-sm font-medium leading-5",
    "var(--secondary-container)",
    "var(--on-secondary-container)",
    'secondary: "border border-[var(--outline)] bg-transparent text-[var(--primary)]',
    'ghost: "border border-transparent bg-transparent text-[var(--primary)]',
  ]) {
    assert.ok(button.includes(required), "missing Button conformance rule: " + required);
  }
});

test("shared IconButton preserves 48px touch target and supports accessible toggle state", () => {
  for (const required of [
    "h-12 min-h-12 w-12 min-w-12",
    "selected?: boolean",
    "aria-pressed={selected}",
    "var(--secondary-container)",
    "var(--on-secondary-container)",
    'selected && (variant === "standard" || variant === "outlined")',
    "label: string",
  ]) {
    assert.ok(iconButton.includes(required), "missing IconButton conformance rule: " + required);
  }
});

test("button compatibility variants are explicitly distinguished from canonical M3 variants", () => {
  assert.ok(button.includes("App-specific compatibility variants"));
  assert.ok(button.includes('"primary" is the app\'s compatibility name for M3\'s filled button'));
});
