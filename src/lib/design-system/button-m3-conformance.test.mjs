import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const buttonRipple = readFileSync(new URL("../../components/ui/ButtonRipple.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const auditPreview = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentLivePreview.tsx", import.meta.url), "utf8");
const favoriteButton = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const baseConverter = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
const themeToggle = readFileSync(new URL("../../components/theme/ThemeToggle.tsx", import.meta.url), "utf8");
const languageSelector = readFileSync(new URL("../../components/layout/LanguageSelector.tsx", import.meta.url), "utf8");
const mobileHeaderSearch = readFileSync(new URL("../../components/layout/MobileHeaderSearch.tsx", import.meta.url), "utf8");
const collectionsView = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");
const favoritesView = readFileSync(new URL("../../components/favorites/FavoritesView.tsx", import.meta.url), "utf8");
const toolSearch = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");

test("shared Button exposes canonical variants, stable default labels, opt-in multiline and semantic disabled states", () => {
  for (const required of [
    'const filled = "border', 'const elevated = "border', 'const filledTonal = "border', 'const outlined = "border', 'const text = "border',
    '"filled-tonal": filledTonal', "min-h-10", "min-w-[58px]", "whitespace-nowrap", "whitespace-pre-line", "multiline = false",
    "leadingIcon?: boolean", 'const isTextVariant = variant === "text" || variant === "ghost"', "pl-3 pr-4", "pl-4 pr-6",
    "transition-[background-color,border-color,color,box-shadow]", "motion-reduce:transition-none", "shrink-0",
    "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]", "disabled:bg-[color-mix(in_srgb,var(--on-surface)_12%,transparent)]", "disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]", "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]", "disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)]", "disabled:shadow-none",
    "primary: filled", "tonal: filledTonal", "secondary: outlined", "ghost: text", 'variant = "filled"',
  ]) assert.ok(button.includes(required), "missing Button conformance rule: " + required);
  for (const required of [
    "hover:shadow-[var(--button-elevation-1)]",
    "hover:shadow-[var(--button-elevation-2)]",
    "focus-visible:shadow-[var(--button-elevation-1)]",
    "focus-visible:bg-[color-mix(in_srgb,var(--primary)_90%,var(--on-primary))]",
    "focus-visible:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
    "disabled:shadow-none",
  ]) assert.ok(button.includes(required), "missing Button interaction-state rule: " + required);
  assert.ok(globalCss.includes("--button-elevation-1:") && globalCss.includes("--button-elevation-2:"));
  assert.ok(globalCss.includes("0 1px 2px rgb(25 27 35 / 0.12)") && globalCss.includes("0 2px 6px rgb(0 0 0 / 0.38)"));
  assert.ok(!button.includes("active:rounded-[var(--shape-corner-small)]"), "pressed state must not morph the shape in the Fidelity direction");
  assert.ok(!button.includes("active:bg-[color-mix"), "pressed background color must be represented by the ripple rather than a second static color layer");
  assert.ok(button.includes("<ButtonRipple />") && button.includes("relative isolate"));
});

test("shared IconButton preserves 48px touch target and supports accessible toggle state", () => {
  const filledIconButton = iconButton.match(/const filled = "([^"]+)"/)?.[1] ?? "";
  assert.ok(!filledIconButton.includes("shadow-"), "M3 filled icon buttons should not inherit elevation");
  for (const required of [
    'type IconButtonVariant = "standard" | "filled" | "filled-tonal"',
    'const filledTonal = "border',
    '"filled-tonal": filledTonal',
    "h-12 min-h-12 w-12 min-w-12",
    "h-10 min-h-10 w-10 min-w-10",
    "group inline-flex shrink-0 items-center justify-center",
    "aria-hidden=\"true\"",
    "selected?: boolean",
    "aria-pressed={selected}",
    "var(--secondary-container)",
    "var(--on-secondary-container)",
    'standard: "text-[var(--primary)] group-hover:text-[var(--primary)]',
    "group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] group-hover:bg-",
    'outlined: "border-transparent bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] group-hover:bg-',
    "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    "label: string",
    "ref?: Ref<HTMLButtonElement>",
  ]) {
    assert.ok(iconButton.includes(required), "missing IconButton conformance rule: " + required);
  }
});

test("selected filled-tonal IconButton keeps official tonal color roles", () => {
  const selectedStyles = iconButton.slice(iconButton.indexOf("const selectedStyles:"));
  const tonalStyles = selectedStyles.split("\n").filter((line) =>
    line.trim().startsWith('"filled-tonal":') || line.trim().startsWith("tonal:"),
  );

  assert.equal(tonalStyles.length, 2, "canonical and compatibility names both need selected-state coverage");
  for (const line of tonalStyles) {
    assert.ok(
      line.includes("bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"),
      "selected tonal IconButton must use secondary-container / on-secondary-container",
    );
    assert.ok(!line.includes("bg-[var(--secondary)] text-[var(--on-secondary)]"));
  }
  assert.ok(selectedStyles.includes("group-hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))]"));
  assert.ok(selectedStyles.includes("group-active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))]"));
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
  for (const required of ["buttonDisabled", "buttonLongLabel", "buttonLeadingIcon", "buttonTrailingArrow", "buttonNarrow", "buttonMultiline", "buttonManualBreak", "multiline={multiline}", "arrow_forward", "Disabled state"]) {
    assert.ok(auditPreview.includes(required), "Button audit preview is missing control or state coverage: " + required);
  }
  assert.ok(labSource.includes("<IconButton"));
  assert.ok(labSource.includes('variant="filled-tonal"><MaterialIcon name="search" size={24}'));
  assert.ok(toolSearch.includes('<IconButton') && toolSearch.includes('label={t.tools.clearSearch}'));
  assert.ok(readFileSync(new URL("../../components/ui/CopyButton.tsx", import.meta.url), "utf8").includes("leadingIcon"));
  assert.ok(readFileSync(new URL("../../components/ui/ClearButton.tsx", import.meta.url), "utf8").includes("leadingIcon"));
  assert.ok(!toolSearch.includes('className="min-h-10 w-10 shrink-0 rounded-full p-0"'));
  assert.ok(toolSearch.includes('<MaterialIcon name="close" size={24} />'));
  assert.ok(toolSearch.includes('<MaterialIcon name="arrow_forward" size={24} />'));
});

test("Button audit preview provides contextual verification guidance in French and English", () => {
  for (const required of [
    "buttonScenarios",
    "Référence Android Material 3",
    "Android Material 3 baseline",
    "MDUI and MUI are secondary Web comparisons only",
    "buttonLongLabel",
    "buttonLeadingIcon || buttonTrailingArrow",
    "leadingIcon={buttonLeadingIcon}",
    "buttonNarrow",
    "buttonMultiline || buttonManualBreak",
    "buttonManualBreak",
    "200 %",
    "200%",
    "Réduction des animations",
    "Reduced motion",
    "Consignes de vérification",
    "What to verify",
    "l’aperçu seul ne prouve pas la conformité",
    "preview alone does not prove conformance",
  ]) {
    assert.ok(auditPreview.includes(required), "missing contextual Button verification guidance: " + required);
  }
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

test("Button ripple is pointer-origin, bounded, cleans up after release and respects reduced motion", () => {
  for (const required of [
    "event.clientX - rect.left",
    "event.clientY - rect.top",
    "Math.hypot(width - x, height - y)",
    "setPointerCapture(event.pointerId)",
    "onPointerCancel={releasePointer}",
    "onLostPointerCapture={releasePointer}",
    'event.key !== " " && event.key !== "Enter"',
    "button.addEventListener(\"keydown\", handleKeyDown)",
    "button.addEventListener(\"keyup\", handleKeyUp)",
    "button.addEventListener(\"blur\", handleBlur)",
    'event.animationName !== "button-ripple-fade"',
  ]) {
    assert.ok(buttonRipple.includes(required), "missing ripple interaction behavior: " + required);
  }
  for (const required of [
    ".button-ripple-layer {",
    "button:disabled > .button-ripple-layer",
    "border-radius: inherit",
    "button-ripple-expand",
    "button-ripple-fade",
    ".button-ripple { display: none; }",
    "button:active > .button-ripple-layer::after { opacity: 0.1; }",
  ]) {
    assert.ok(globalCss.includes(required), "missing ripple rendering rule: " + required);
  }
  assert.ok(auditPreview.includes("bounded ripple") && auditPreview.includes("onde contenue"));
});
