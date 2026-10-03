import assert from "node:assert/strict";
import { test } from "node:test";
import { generatePalette } from "./color-palette-generator.ts";

test("generates deterministic harmonies from a valid color", () => {
  const palette = generatePalette("#336699");
  assert.equal(palette?.base.hex, "#336699");
  assert.equal(palette?.analogous.length, 5);
  assert.equal(palette?.complementary.length, 4);
  assert.equal(palette?.triadic.length, 3);
  assert.equal(palette?.splitComplementary.length, 3);
  assert.equal(palette?.monochromatic.length, 5);
  assert.equal(palette?.triadic[1].hex, "#993366");
});

test("wraps hues across the 0/360 boundary", () => {
  const palette = generatePalette("hsl(350, 100%, 50%)");
  assert.ok(Math.abs((palette?.analogous[0].hsl.h ?? 0) - 320) < 0.2);
  assert.ok(Math.abs((palette?.analogous[4].hsl.h ?? 0) - 20) < 0.2);
});

test("handles achromatic colors without inventing saturation", () => {
  const palette = generatePalette("#808080");
  assert.ok(palette?.analogous.every((color) => color.hsl.s === 0));
  assert.ok(palette?.triadic.every((color) => color.hsl.s === 0));
});

test("rejects invalid colors", () => {
  assert.equal(generatePalette("not-a-color"), null);
  assert.equal(generatePalette("rgb(256, 0, 0)"), null);
});
