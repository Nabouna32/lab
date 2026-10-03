import { convertColor, formatHex, hslToRgb, type HslColor } from "./color-converter.ts";

export type PaletteColor = { hex: string; hsl: HslColor };
export type Palette = {
  base: PaletteColor;
  analogous: PaletteColor[];
  complementary: PaletteColor[];
  triadic: PaletteColor[];
  splitComplementary: PaletteColor[];
  monochromatic: PaletteColor[];
};

function colorFromHsl(h: number, s: number, l: number): PaletteColor {
  const hsl = { h: ((h % 360) + 360) % 360, s, l };
  return { hex: formatHex(hslToRgb(hsl)), hsl };
}

function harmony(base: HslColor, offsets: number[]): PaletteColor[] {
  return offsets.map((offset) => colorFromHsl(base.h + offset, base.s, base.l));
}

export function generatePalette(value: string): Palette | null {
  const color = convertColor(value);
  if (!color) return null;

  const { h, s, l } = color.hsl;
  return {
    base: { hex: color.hex, hsl: color.hsl },
    analogous: harmony(color.hsl, [-30, -15, 0, 15, 30]),
    complementary: [
      colorFromHsl(h, s, Math.max(0, l - 18)),
      colorFromHsl(h, s, l),
      colorFromHsl(h + 180, s, l),
      colorFromHsl(h + 180, s, Math.min(100, l + 18)),
    ],
    triadic: harmony(color.hsl, [0, 120, 240]),
    splitComplementary: harmony(color.hsl, [0, 150, 210]),
    monochromatic: [
      colorFromHsl(h, s, 20),
      colorFromHsl(h, s, 35),
      colorFromHsl(h, s, l),
      colorFromHsl(h, s, 65),
      colorFromHsl(h, s, 80),
    ],
  };
}
