import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getLocularyThemeStyle } from "../design-system/rainbow-tones.ts";
import { categoryColorIds, getCategoryColor, getCategoryContainerColor } from "./category-colors.ts";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const generatedTokens = getLocularyThemeStyle() as unknown as Record<string, string>;

function luminance(hex: string): number {
  const channels = hex.replace("#", "").match(/.{2}/g)?.map((value) => parseInt(value, 16) / 255);
  assert.ok(channels && channels.length === 3, `expected a generated hex color, got ${hex}`);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground: string, background: string): number {
  const fg = luminance(foreground);
  const bg = luminance(background);
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

test("every category uses distinct official MCU Rainbow colors in light and dark themes", () => {
  const lightColors = new Set<string>();
  const darkColors = new Set<string>();

  for (const categoryId of categoryColorIds) {
    const token = `--category-${categoryId}`;
    assert.ok(globalCss.includes(`${token}: var(--m3-light-category-${categoryId}`), `${token} should use generated light-theme color`);
    assert.ok(globalCss.includes(`${token}: var(--m3-dark-category-${categoryId}`), `${token} should use generated dark-theme color`);
    assert.ok(globalCss.includes(`${token}-container: var(--m3-light-category-${categoryId}-container`), `${token} should have a generated light container`);
    assert.ok(globalCss.includes(`${token}-container: var(--m3-dark-category-${categoryId}-container`), `${token} should have a generated dark container`);
    assert.equal(getCategoryColor(categoryId), `var(${token})`);
    assert.equal(getCategoryContainerColor(categoryId), `var(${token}-container)`);

    for (const theme of ["light", "dark"] as const) {
      const prefix = theme === "light" ? "--m3-light" : "--m3-dark";
      const color = generatedTokens[`${prefix}-category-${categoryId}`];
      const foreground = generatedTokens[`${prefix}-category-${categoryId}-foreground`];
      assert.match(color, /^#[0-9a-f]{6}$/i);
      assert.match(foreground, /^#[0-9a-f]{6}$/i);
      assert.ok(contrastRatio(foreground, color) >= 4.5, `${categoryId} ${theme} accent must meet WCAG AA text contrast`);
      (theme === "light" ? lightColors : darkColors).add(color);
    }
  }

  assert.equal(lightColors.size, categoryColorIds.length, "light category colors should be unique");
  assert.equal(darkColors.size, categoryColorIds.length, "dark category colors should be unique");
});

test("category colors stay separate from semantic status colors", () => {
  const statusTokens = ["--success", "--warning", "--error", "--info"];

  for (const categoryId of categoryColorIds) {
    const categoryColor = generatedTokens[`--m3-light-category-${categoryId}`];
    for (const statusToken of statusTokens) {
      const statusValues = [...globalCss.matchAll(new RegExp(`^\\s*${statusToken}:\\s*(#[0-9a-f]{6});`, "gim"))]
        .map((match) => match[1]?.toLowerCase());
      assert.ok(!statusValues.includes(categoryColor), `${categoryId} category accent must not reuse ${statusToken}`);
    }
  }
});

test("unknown category IDs fall back to the shared primary tokens", () => {
  assert.equal(getCategoryColor("unknown"), "var(--accent)");
  assert.equal(getCategoryContainerColor("unknown"), "var(--accent-soft)");
});
