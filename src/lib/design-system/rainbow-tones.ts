import {
  Hct,
  SchemeFidelity,
  SchemeRainbow,
  argbFromHex,
  hexFromArgb,
  customColor,
  CorePalette,
} from "@material/material-color-utilities";
import type { CSSProperties } from "react";
import { createRainbowCategorySeed, rainbowCategoryHueSeeds } from "./rainbow-palette";

const BRAND_SEED = "#4285F4";
const SPEC_VERSION = "2025" as const;
const PLATFORM = "phone" as const;

const semanticTokens = {
  primary: "primary",
  "on-primary": "onPrimary",
  "primary-container": "primaryContainer",
  "on-primary-container": "onPrimaryContainer",
  secondary: "secondary",
  "on-secondary": "onSecondary",
  "secondary-container": "secondaryContainer",
  "on-secondary-container": "onSecondaryContainer",
  tertiary: "tertiary",
  "on-tertiary": "onTertiary",
  "tertiary-container": "tertiaryContainer",
  "on-tertiary-container": "onTertiaryContainer",
  error: "error",
  "on-error": "onError",
  "error-container": "errorContainer",
  "on-error-container": "onErrorContainer",
  background: "background",
  "on-background": "onBackground",
  surface: "surface",
  "on-surface": "onSurface",
  "surface-dim": "surfaceDim",
  "surface-bright": "surfaceBright",
  "surface-container-lowest": "surfaceContainerLowest",
  "surface-container-low": "surfaceContainerLow",
  "surface-container": "surfaceContainer",
  "surface-container-high": "surfaceContainerHigh",
  "surface-container-highest": "surfaceContainerHighest",
  "surface-tint": "surfaceTint",
  "surface-variant": "surfaceVariant",
  "on-surface-variant": "onSurfaceVariant",
  outline: "outline",
  "outline-variant": "outlineVariant",
  "inverse-surface": "inverseSurface",
  "inverse-on-surface": "inverseOnSurface",
  "inverse-primary": "inversePrimary",
  shadow: "shadow",
  scrim: "scrim",
} as const;

// Semantic status colors generated via MCU customColor
// blend: false for yellow to keep true amber; blend: true for green/blue to harmonize with seed
const statusColorSources = {
  success: { value: "#2e7d32", blend: true },
  warning: { value: "#f9a825", blend: false },
  info: { value: "#0288d1", blend: true },
} as const;

function toHex(argb: number): string {
  return hexFromArgb(argb).toLowerCase();
}

function addSchemeTokens(
  style: Record<string, string>,
  prefix: "light" | "dark",
  scheme: SchemeFidelity,
) {
  for (const [token, role] of Object.entries(semanticTokens)) {
    style[`--m3-${prefix}-${token}`] = toHex(scheme[role as keyof SchemeFidelity] as number);
  }
}

function addCustomColorTokens(
  style: Record<string, string>,
  prefix: "light" | "dark",
  source: ReturnType<typeof Hct.fromInt>,
) {
  for (const [name, { value, blend }] of Object.entries(statusColorSources)) {
    const custom = customColor(source.toInt(), { name, value: argbFromHex(value), blend });
    const group = (prefix === "light" ? custom.light : custom.dark) as {
      color: number;
      onColor: number;
      colorContainer: number;
      onColorContainer: number;
    };
    style[`--m3-${prefix}-${name}`] = toHex(group.color);
    style[`--m3-${prefix}-on-${name}`] = toHex(group.onColor);
    style[`--m3-${prefix}-${name}-container`] = toHex(group.colorContainer);
    style[`--m3-${prefix}-on-${name}-container`] = toHex(group.onColorContainer);
  }
}

function addCategoryTokens(style: Record<string, string>, prefix: "light" | "dark", isDark: boolean) {
  for (const [category, hue] of Object.entries(rainbowCategoryHueSeeds)) {
    const seed = createRainbowCategorySeed(hue);
    const scheme = new SchemeRainbow(seed, isDark, 0, SPEC_VERSION, PLATFORM);
    style[`--m3-${prefix}-category-${category}`] = toHex(scheme.primary);
    style[`--m3-${prefix}-category-${category}-foreground`] = toHex(scheme.onPrimary);
    style[`--m3-${prefix}-category-${category}-container`] = toHex(scheme.primaryContainer);
    style[`--m3-${prefix}-category-${category}-on-container`] = toHex(scheme.onPrimaryContainer);
  }
}

/**
 * Server-generated M3 Fidelity semantic roles, custom status colors (success/warning/info)
 * and official MCU Rainbow category accents. Both light and dark values are emitted together
 * so theme switching remains CSS-only and does not introduce hydration differences.
 */
export function getLocularyThemeStyle(seed: string = BRAND_SEED): CSSProperties {
  if (!/^#[0-9a-f]{6}$/i.test(seed)) {
    throw new TypeError("The Material 3 seed must be a six-digit hexadecimal color.");
  }
  const source = Hct.fromInt(argbFromHex(seed));
  const lightFidelity = new SchemeFidelity(source, false, 0, SPEC_VERSION, PLATFORM);
  const darkFidelity = new SchemeFidelity(source, true, 0, SPEC_VERSION, PLATFORM);
  const style: Record<string, string> = {};
  addSchemeTokens(style, "light", lightFidelity);
  addSchemeTokens(style, "dark", darkFidelity);
  addCustomColorTokens(style, "light", source);
  addCustomColorTokens(style, "dark", source);
  addCategoryTokens(style, "light", false);
  addCategoryTokens(style, "dark", true);
  return style as CSSProperties;
}
