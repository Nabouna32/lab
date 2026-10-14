import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const favoriteButton = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const toolSearch = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");

test("shared Button exposes canonical M3 variants, stable labels and semantic disabled states", () => {
  for (const required of [
    'const filled = "border',
    'const elevated = "border',
    'const filledTonal = "border',
    'const outlined = "border',
    'const text = "border',
    '"filled-tonal": filledTonal',
    "min-h-10",
    "min-w-16",
    "whitespace-nowrap",
    "shrink-0",
    "px-6",
    "text-sm font-medium leading-5",
    "disabled:bg-[color-mix(in_srgb,var(--on-surface)_12%,transparent)]",
    "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    "primary: filled",
    "tonal: filledTonal",
    "secondary: outlined",
    "ghost: text",
    'variant = "filled"',
  ]) {
    assert.ok(button.includes(required), "missing Button conformance rule: " + required);
  }
});

test("shared IconButton preserves 48px touch target and supports accessible toggle state", () => {
  for (const required of [
    'type IconButtonVariant = "standard" | "filled" | "filled-tonal"',
    'const filledTonal = "border',
    '"filled-tonal": filledTonal',
    "h-12 min-h-12 w-12 min-w-12",
    "selected?: boolean",
    "aria-pressed={selected}",
    "var(--secondary-container)",
    "var(--on-secondary-container)",
    'selected && (variant === "standard" || variant === "outlined")',
    "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    "label: string",
  ]) {
    assert.ok(iconButton.includes(required), "missing IconButton conformance rule: " + required);
  }
});

test("legacy names are aliases to canonical M3 treatments", () => {
  assert.ok(button.includes("primary: filled"));
  assert.ok(button.includes("tonal: filledTonal"));
  assert.ok(button.includes("secondary: outlined"));
  assert.ok(button.includes("ghost: text"));
  assert.ok(iconButton.includes("tonal: filledTonal"));
  assert.ok(labCss.includes("--surface-container-low:var(--lab-surface-low)"));
  assert.ok(labCss.includes("--on-surface:var(--lab-text)"));
  for (const variant of ["filled", "elevated", "filled-tonal", "outlined", "text"]) {
    assert.ok(labSource.includes(`variant="${variant}"`), "Design Lab is missing real shared Button variant: " + variant);
  }
  assert.ok(labSource.includes("<IconButton"));
  assert.ok(labSource.includes('variant="filled-tonal"><MaterialIcon name="search" size={24}'));
  assert.ok(toolSearch.includes('<MaterialIcon name="close" size={24} />'));
  assert.ok(toolSearch.includes('<MaterialIcon name="arrow_forward" size={24} />'));
});

test("favorite action uses shared M3 controls and never shrinks icon touch target below 48px", () => {
  assert.ok(favoriteButton.includes('import { Button } from "@/components/ui/Button"'));
  assert.ok(favoriteButton.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(favoriteButton.includes('if (compact)'));
  assert.ok(favoriteButton.includes("<IconButton"));
  assert.ok(favoriteButton.includes('variant={active ? "filled-tonal" : "outlined"}'));
  assert.ok(favoriteButton.includes("selected={active}"));
  assert.ok(!favoriteButton.includes("min-h-10 min-w-10"));
});
