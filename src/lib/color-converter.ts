export type RgbColor = { r: number; g: number; b: number };
export type HslColor = { h: number; s: number; l: number };

export type ColorResult = {
  rgb: RgbColor;
  hsl: HslColor;
  hex: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseHex(value: string): RgbColor | null {
  const hex = value.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(hex)) return null;
  const expanded = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function parseRgb(value: string): RgbColor | null {
  const match = value.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*1(?:\.0*)?)?\s*\)$/i);
  if (!match) return null;
  const [r, g, b] = match.slice(1, 4).map(Number);
  if ([r, g, b].some((channel) => channel < 0 || channel > 255)) return null;
  return { r, g, b };
}

function parseHsl(value: string): HslColor | null {
  const match = value.trim().match(/^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%(?:\s*,\s*1(?:\.0*)?)?\s*\)$/i);
  if (!match) return null;
  const h = Number(match[1]);
  const s = Number(match[2]);
  const l = Number(match[3]);
  if (s > 100 || l > 100) return null;
  return { h: ((h % 360) + 360) % 360, s, l };
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6);
    else if (max === green) h = 60 * ((blue - red) / delta + 2);
    else h = 60 * ((red - green) / delta + 4);
  }

  return { h: (h + 360) % 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - chroma / 2;
  let red = 0, green = 0, blue = 0;

  if (hue < 60) [red, green, blue] = [chroma, x, 0];
  else if (hue < 120) [red, green, blue] = [x, chroma, 0];
  else if (hue < 180) [red, green, blue] = [0, chroma, x];
  else if (hue < 240) [red, green, blue] = [0, x, chroma];
  else if (hue < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return {
    r: Math.round((red + m) * 255),
    g: Math.round((green + m) * 255),
    b: Math.round((blue + m) * 255),
  };
}

export function parseColor(value: string): RgbColor | null {
  return parseHex(value) ?? parseRgb(value) ?? hslToParsedRgb(value);
}

function hslToParsedRgb(value: string): RgbColor | null {
  const hsl = parseHsl(value);
  return hsl ? hslToRgb(hsl) : null;
}

export function formatHex({ r, g, b }: RgbColor): string {
  return "#" + [r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function formatRgb({ r, g, b }: RgbColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl({ h, s, l }: HslColor): string {
  const clean = (value: number) => Number(value.toFixed(1));
  return `hsl(${clean(h)}°, ${clean(s)}%, ${clean(l)}%)`;
}

export function convertColor(value: string): ColorResult | null {
  const rgb = parseColor(value);
  if (!rgb) return null;
  return { rgb, hsl: rgbToHsl(rgb), hex: formatHex(rgb) };
}
