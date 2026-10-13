import { Hct } from "@material/material-color-utilities";

/**
 * Loculary-specific hue anchors, not a hard-coded color palette.
 * Material Color Utilities generates the actual colors and their light/dark roles.
 */
export const rainbowCategoryHueSeeds = {
  calculations: 8,
  dates: 48,
  computing: 88,
  images: 142,
  files: 205,
  video: 255,
  development: 305,
} as const;

export function createRainbowCategorySeed(hue: number): Hct {
  return Hct.from(hue, 72, 50);
}
