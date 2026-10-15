import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const favoriteButton = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const baseConverter = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
const themeToggle = readFileSync(new URL("../../components/theme/ThemeToggle.tsx", import.meta.url), "utf8");
const languageSelector = readFileSync(new URL("../../components/layout/LanguageSelector.tsx", import.meta.url), "utf8");
const mobileHeaderSearch = readFileSync(new URL("../../components/layout/MobileHeaderSearch.tsx", import.meta.url), "utf8");
const collectionsView = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");
const favoritesView = readFileSync(new URL("../../components/favorites/FavoritesView.tsx", import.meta.url), "utf8");
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
    "active:rounded-[var(--shape-corner-small)]",
    "shrink-0",
    "px-6",
    "text-sm font-medium leading-5",
    "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
    "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)] disabled:shadow-none",
    "disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]",
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
  const filledIconButton = iconButton.match(/const filled = "([^"]+)"/)?.[1] ?? "";
  assert.ok(!filledIconButton.includes("shadow-"), "M3 filled icon buttons should not inherit elevation");
  for (const required of [
    'type IconButtonVariant = "standard" | "filled" | "filled-tonal"',
    'const filledTonal = "border',
    '"filled-tonal": filledTonal',
    "h-12 min-h-12 w-12 min-w-12",
    "selected?: boolean",
    "aria-pressed={selected}",
    "var(--secondary-container)",
    "var(--on-secondary-container)",
    'standard: "text-[var(--primary)] hover:text-[var(--primary)]',
    'outlined: "bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)]',
    "disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]",
    "label: string",
    "ref?: Ref<HTMLButtonElement>",
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
  assert.ok(labCss.includes("--error:var(--lab-error)"));
  assert.ok(labCss.includes("--on-error:var(--lab-on-error)"));
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
  assert.ok(favoriteButton.includes('<StarIcon filled={active} size={24} className="h-6 w-6 shrink-0" />'));
  assert.ok(readFileSync(new URL("../../components/ui/StarIcon.tsx", import.meta.url), "utf8").includes("size = 20"));
  assert.ok(favoriteButton.includes('variant={active ? "filled-tonal" : "outlined"}'));
  assert.ok(favoriteButton.includes("selected={active}"));
  assert.ok(!favoriteButton.includes("min-h-10 min-w-10"));
});

test("number-base swap action uses the shared M3 IconButton with a 24px icon", () => {
  assert.ok(baseConverter.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(baseConverter.includes('<IconButton label={t.swap} title={t.swap} variant="outlined" onClick={swapBases}'));
  assert.ok(baseConverter.includes('<MaterialIcon name="swap_horiz" size={24} />'));
  assert.ok(!baseConverter.includes('<button type="button" onClick={swapBases}'));
});

test("icon-only theme and language menu triggers meet the 48px M3 target", () => {
  assert.ok(themeToggle.includes("h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full"));
  assert.ok(languageSelector.includes("h-12 w-12 shrink-0 cursor-pointer list-none items-center justify-center rounded-full"));
  assert.ok(themeToggle.includes('aria-label={labels.choose + ": " + currentLabel}'));
  assert.ok(languageSelector.includes('aria-label={t.nav.language + ": " + currentLanguage.nativeLabel}'));
});

test("mobile header search uses the shared ref-capable M3 IconButton", () => {
  assert.ok(mobileHeaderSearch.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(mobileHeaderSearch.includes("<IconButton"));
  assert.ok(mobileHeaderSearch.includes("ref={triggerRef}"));
  assert.ok(mobileHeaderSearch.includes('selected={open}'));
  assert.ok(!mobileHeaderSearch.includes('const iconButton ='));
});

test("collection and favorites action buttons use the shared M3 Button", () => {
  assert.ok(collectionsView.includes('import { Button } from "@/components/ui/Button"'));
  for (const variant of ['variant="filled"', 'variant="filled-tonal"', 'variant="outlined"', 'variant="text"']) {
    assert.ok(collectionsView.includes(variant), "missing collection action variant: " + variant);
  }
  assert.ok(!collectionsView.includes('<button type="submit"'));
  assert.ok(!collectionsView.includes('<button type="button" onClick={() => void data.removeTool'));
  assert.ok(!collectionsView.includes('<button type="button" onClick={() => void data.toggleSharing'));
  assert.ok(collectionsView.includes('className="!text-[var(--error)]"'));
  assert.ok(collectionsView.includes('className="!text-[var(--muted)]"'));
  assert.ok(favoritesView.includes('import { Button } from "@/components/ui/Button"'));
  assert.ok(favoritesView.includes('<Button type="button" variant="text" disabled={favorites.loading || favorites.error}'));
  assert.ok(!favoritesView.includes('min-h-11 rounded-full px-3 text-sm font-bold text-[var(--primary)]'));
});
