import {
  Hct,
  SchemeExpressive,
  SchemeRainbow,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";
import type { CSSProperties } from "react";
import { createRainbowCategorySeed, rainbowCategoryHueSeeds } from "./rainbow-palette";

const BRAND_SEED = "#4285F4";
const SPEC_VERSION = "2025" as const;
const PLATFORM = "phone" as const;
const source = Hct.fromInt(argbFromHex(BRAND_SEED));
const lightExpressive = new SchemeExpressive(source, false, 0, SPEC_VERSION, PLATFORM);
const darkExpressive = new SchemeExpressive(source, true, 0, SPEC_VERSION, PLATFORM);
const lightRainbow = new SchemeRainbow(source, false, 0, SPEC_VERSION, PLATFORM);
const darkRainbow = new SchemeRainbow(source, true, 0, SPEC_VERSION, PLATFORM);

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
  background: "background",
  foreground: "onBackground",
  surface: "surface",
  "surface-soft": "surfaceContainerLow",
  "surface-elevated": "surfaceContainer",
  "surface-variant": "surfaceVariant",
  "on-surface-variant": "onSurfaceVariant",
  muted: "onSurfaceVariant",
  border: "outlineVariant",
  "border-strong": "outline",
  outline: "outline",
  "outline-variant": "outlineVariant",
  "inverse-surface": "inverseSurface",
  "inverse-on-surface": "inverseOnSurface",
  "inverse-primary": "inversePrimary",
} as const;

function toHex(argb: number): string {
  return hexFromArgb(argb).toLowerCase();
}

function addSchemeTokens(
  style: Record<string, string>,
  prefix: "light" | "dark",
  scheme: SchemeExpressive,
) {
  for (const [token, role] of Object.entries(semanticTokens)) {
    style[`--m3-${prefix}-${token}`] = toHex(scheme[role as keyof SchemeExpressive] as number);
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
 * Server-generated M3 Expressive semantic roles and official MCU Rainbow
 * category accents. Both light and dark values are emitted together so theme
 * switching remains CSS-only and does not introduce hydration differences.
 */
export function getLocularyThemeStyle(): CSSProperties {
  const style: Record<string, string> = {};
  addSchemeTokens(style, "light", lightExpressive);
  addSchemeTokens(style, "dark", darkExpressive);
  addCategoryTokens(style, "light", false);
  addCategoryTokens(style, "dark", true);
  return style as CSSProperties;
}

/**
 * Provides MCU-generated Rainbow tonal containers for the homepage frame.
 * The frame follows the accepted blue seed while retaining Rainbow's expressive
 * tonal range in both themes.
 */
export function getRainbowFrameStyle(): CSSProperties {
  return {
    "--home-rainbow-primary-light": toHex(lightRainbow.primaryContainer),
    "--home-rainbow-secondary-light": toHex(lightRainbow.secondaryContainer),
    "--home-rainbow-tertiary-light": toHex(lightRainbow.tertiaryContainer),
    "--home-rainbow-primary-dark": toHex(darkRainbow.primaryContainer),
    "--home-rainbow-secondary-dark": toHex(darkRainbow.secondaryContainer),
    "--home-rainbow-tertiary-dark": toHex(darkRainbow.tertiaryContainer),
  } as CSSProperties;
}
