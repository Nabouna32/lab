import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { categoryColorIds, getCategoryColor, getCategoryContainerColor } from "./category-colors.ts";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const rainbowSource = readFileSync(new URL("../design-system/rainbow-tones.ts", import.meta.url), "utf8");
const rainbowPaletteSource = readFileSync(new URL("../design-system/rainbow-palette.ts", import.meta.url), "utf8");

test("semantic theme tokens use the accepted blue M3 Expressive seed", () => {
  assert.ok(rainbowSource.includes('const BRAND_SEED = "#4285F4"'));
  assert.ok(rainbowSource.includes("new SchemeExpressive(source, false"));
  assert.ok(rainbowSource.includes("new SchemeExpressive(source, true"));
  assert.ok(globalCss.includes("--primary: var(--m3-light-primary"));
  assert.ok(globalCss.includes("--primary: var(--m3-dark-primary"));
  assert.ok(!globalCss.toLowerCase().includes("#6750a4"), "the old purple seed must not remain in production CSS");
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
  }

  assert.ok(!globalCss.includes("#d32f2f"), "the old direct Rainbow palette must not remain in production CSS");
  assert.ok(!globalCss.includes("#fb8c00"), "the old direct Rainbow palette must not remain in production CSS");
});

test("semantic status colors stay independent from generated category colors", () => {
  for (const statusToken of ["--success", "--warning", "--error", "--info"]) {
    assert.match(globalCss, new RegExp(`^\\s*${statusToken}:\\s*#[0-9a-f]{6};`, "m"));
    assert.ok(!globalCss.includes(`${statusToken}: var(--m3-light-category-`));
    assert.ok(!globalCss.includes(`${statusToken}: var(--m3-dark-category-`));
  }
});

test("unknown category IDs fall back to the shared primary tokens", () => {
  assert.equal(getCategoryColor("unknown"), "var(--accent)");
  assert.equal(getCategoryContainerColor("unknown"), "var(--accent-soft)");
});
