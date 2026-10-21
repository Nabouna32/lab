export type ContrastResult = {
  foreground: string;
  background: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
};

type Rgb = { r: number; g: number; b: number };

function parseHex(value: string): Rgb | null {
  const hex = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]+$/.test(hex) || ![3, 6].includes(hex.length)) return null;

  const expanded = hex.length === 3
    ? hex.split("").map((part) => part + part).join("")
    : hex;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function parseRgb(value: string): Rgb | null {
  const match = value.trim().match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) return null;

  const channels = match.slice(1, 4).map(Number);
  if (channels.some((channel) => channel < 0 || channel > 255)) return null;
  return { r: channels[0], g: channels[1], b: channels[2] };
}

export function parseColor(value: string): Rgb | null {
  return parseHex(value) ?? parseRgb(value);
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const linearize = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function calculateContrastRatio(foreground: string, background: string): number | null {
  const foregroundRgb = parseColor(foreground);
  const backgroundRgb = parseColor(background);
  if (!foregroundRgb || !backgroundRgb) return null;

  const foregroundLuminance = relativeLuminance(foregroundRgb);
  const backgroundLuminance = relativeLuminance(backgroundRgb);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function evaluateContrast(foreground: string, background: string): ContrastResult | null {
  const ratio = calculateContrastRatio(foreground, background);
  if (ratio === null) return null;

  return {
    foreground,
    background,
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}


/**
 * Finds the closest foreground color along a straight RGB path to black or white
 * that reaches the requested WCAG contrast ratio against a fixed background.
 * Returns a normalized hex color, or null when the target is impossible.
 */
export function suggestAccessibleForeground(
  foreground: string,
  background: string,
  targetRatio: number,
): string | null {
  const source = parseColor(foreground);
  const backdrop = parseColor(background);
  if (!source || !backdrop || !Number.isFinite(targetRatio) || targetRatio < 1 || targetRatio > 21) return null;

  const currentRatio = calculateContrastRatio(foreground, background);
  if (currentRatio !== null && currentRatio >= targetRatio) return toHex(source);

  const candidates: Array<{ color: Rgb; distance: number }> = [];
  for (const endpoint of [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }]) {
    const endpointHex = toHex(endpoint);
    const endpointRatio = calculateContrastRatio(endpointHex, background);
    if (endpointRatio === null || endpointRatio < targetRatio) continue;

    let failing = 0;
    let passing = 1;
    for (let iteration = 0; iteration < 24; iteration += 1) {
      const amount = (failing + passing) / 2;
      const color = interpolate(source, endpoint, amount);
      const ratio = calculateContrastRatio(toHex(color), background);
      if (ratio !== null && ratio >= targetRatio) passing = amount;
      else failing = amount;
    }

    const color = interpolate(source, endpoint, passing);
    const distance = Math.hypot(color.r - source.r, color.g - source.g, color.b - source.b);
    candidates.push({ color, distance });
  }

  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0] ? toHex(candidates[0].color) : null;
}

function interpolate(start: Rgb, end: Rgb, amount: number): Rgb {
  return {
    r: Math.round(start.r + (end.r - start.r) * amount),
    g: Math.round(start.g + (end.g - start.g) * amount),
    b: Math.round(start.b + (end.b - start.b) * amount),
  };
}

function toHex({ r, g, b }: Rgb): string {
  return "#" + [r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase();
}
