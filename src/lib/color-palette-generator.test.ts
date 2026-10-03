import { describe, expect, it } from "vitest";
import { generatePalette } from "./color-palette-generator";

describe("generatePalette", () => {
  it("generates deterministic harmonies from a valid color", () => {
    const palette = generatePalette("#336699");
    expect(palette?.base.hex).toBe("#336699");
    expect(palette?.analogous).toHaveLength(5);
    expect(palette?.complementary).toHaveLength(4);
    expect(palette?.triadic).toHaveLength(3);
    expect(palette?.splitComplementary).toHaveLength(3);
    expect(palette?.monochromatic).toHaveLength(5);
  });

  it("wraps hues across the 0/360 boundary", () => {
    const palette = generatePalette("hsl(350, 100%, 50%)");
    expect(palette?.analogous[0].hsl.h).toBe(320);
    expect(palette?.analogous[4].hsl.h).toBe(20);
  });

  it("handles achromatic colors without inventing saturation", () => {
    const palette = generatePalette("#808080");
    expect(palette?.analogous.every((color) => color.hsl.s === 0)).toBe(true);
    expect(palette?.triadic.every((color) => color.hsl.s === 0)).toBe(true);
  });

  it("rejects invalid colors", () => {
    expect(generatePalette("not-a-color")).toBeNull();
    expect(generatePalette("rgb(256, 0, 0)")).toBeNull();
  });
});
