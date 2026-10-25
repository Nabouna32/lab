import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { categoryColorIds, getCategoryColor, getCategoryContainerColor, getCategoryOnContainerColor } from "./category-colors.ts";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const rainbowSource = readFileSync(new URL("../design-system/rainbow-tones.ts", import.meta.url), "utf8");
const rainbowPaletteSource = readFileSync(new URL("../design-system/rainbow-palette.ts", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const buttonVariantStyles = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");

test("semantic theme tokens use the accepted blue M3 Fidelity seed", () => {
  assert.ok(rainbowSource.includes('const BRAND_SEED = "#4285F4"'));
  assert.ok(rainbowSource.includes("new SchemeFidelity(source, false"));
  assert.ok(rainbowSource.includes("new SchemeFidelity(source, true"));
  assert.ok(globalCss.includes("--primary: var(--m3-light-primary"));
  assert.ok(globalCss.includes("--primary: var(--m3-dark-primary"));
  assert.ok(rainbowSource.includes('error: "error"'));
  assert.ok(rainbowSource.includes('"on-error": "onError"'));
  assert.ok(globalCss.includes("--error: var(--m3-light-error"));
  assert.ok(globalCss.includes("--error: var(--m3-dark-error"));
  assert.ok(!globalCss.toLowerCase().includes("#6750a4"), "the old purple seed must not remain in production CSS");
});

test("FilledTonalButton uses Material 3 secondary container roles without a Loculary alias", () => {
  assert.ok(buttonVariantStyles.includes('"filled-tonal": ['));
  assert.ok(buttonVariantStyles.includes("bg-[var(--button-container-color,var(--secondary-container))] text-[var(--button-content-color,var(--on-secondary-container))]"));
  assert.ok(buttonSource.includes('variant="filled-tonal"') || buttonSource.includes('variant="filled-tonal"') === false);
  assert.ok(buttonSource.includes('variant="filled-tonal"') === false, "variant selection stays inside the official FilledTonalButton wrapper");
  assert.ok(buttonSource.includes("export function FilledTonalButton("));
  assert.ok(!buttonSource.includes("tonal: filledTonal"), "the legacy tonal alias must not remain in the shared API");
});

test("every category is wired to generated official MCU Rainbow colors for both themes", () => {
  assert.ok(rainbowSource.includes("new SchemeRainbow(seed, isDark"));
  assert.ok(rainbowPaletteSource.includes("Hct.from(hue, 72, 50)"));

  for (const categoryId of categoryColorIds) {
    const token = `--category-${categoryId}`;
    assert.ok(rainbowPaletteSource.includes(`${categoryId}:`), `${categoryId} should have one shared hue anchor`);
    assert.ok(globalCss.includes(`${token}: var(--m3-light-category-${categoryId}`), `${token} should use generated light-theme color`);
    assert.ok(globalCss.includes(`${token}: var(--m3-dark-category-${categoryId}`), `${token} should use generated dark-theme color`);
    assert.ok(globalCss.includes(`${token}-container: var(--m3-light-category-${categoryId}-container`), `${token} should have a generated light container`);
    assert.ok(globalCss.includes(`${token}-container: var(--m3-dark-category-${categoryId}-container`), `${token} should have a generated dark container`);
    assert.equal(getCategoryColor(categoryId), `var(${token})`);
    assert.equal(getCategoryContainerColor(categoryId), `var(${token}-container)`);
    assert.ok(globalCss.includes(`${token}-on-container: var(--m3-light-category-${categoryId}-on-container`), `${token} should have a generated light foreground`);
    assert.ok(globalCss.includes(`${token}-on-container: var(--m3-dark-category-${categoryId}-on-container`), `${token} should have a generated dark foreground`);
    assert.equal(getCategoryOnContainerColor(categoryId), `var(${token}-on-container)`);
  }

  assert.ok(!globalCss.includes("#d32f2f"), "the old direct Rainbow palette must not remain in production CSS");
  assert.ok(!globalCss.includes("#fb8c00"), "the old direct Rainbow palette must not remain in production CSS");
});

test("semantic status colors stay independent from generated category colors", () => {
  for (const statusToken of ["--success", "--warning", "--info"]) {
    assert.match(globalCss, new RegExp(`^\\s*${statusToken}:\\s*#[0-9a-f]{6};`, "m"));
  }
  assert.match(globalCss, new RegExp("^\\s*--error:\\s*var\\(--m3-light-error,", "m"));
  assert.match(globalCss, new RegExp("^\\s*--error:\\s*var\\(--m3-dark-error,", "m"));

  for (const statusToken of ["--success", "--warning", "--error", "--info"]) {
    assert.ok(!globalCss.includes(`${statusToken}: var(--m3-light-category-`));
    assert.ok(!globalCss.includes(`${statusToken}: var(--m3-dark-category-`));
  }
});

test("unknown category IDs fall back to the shared primary tokens", () => {
  assert.equal(getCategoryColor("unknown"), "var(--accent)");
  assert.equal(getCategoryContainerColor("unknown"), "var(--accent-soft)");
  assert.equal(getCategoryOnContainerColor("unknown"), "var(--on-primary-container)");
});
