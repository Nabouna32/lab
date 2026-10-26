/**
 * Partial Web adaptation of androidx.compose.foundation.layout.Arrangement.
 * AndroidX API: https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement
 *
 * Spacing values are CSS pixels, not Android Dp. The implementation covers only the
 * arrangements currently needed by Loculary; it is not a complete AndroidX port.
 */

export type ArrangementKind =
  | "start"
  | "end"
  | "top"
  | "bottom"
  | "center"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly"
  | "spacedBy"
  | "spacedByCss";

export type SpacedByArrangement = {
  readonly kind: "spacedBy";
  /** CSS pixels in this Web port, not Android Dp. */
  readonly space: number;
};

export type CssSpacedByArrangement = {
  readonly kind: "spacedByCss";
  /** Explicit Web-only extension; use a shared semantic CSS token where possible. */
  readonly space: string;
};

export type HorizontalArrangement = SpacedByArrangement | CssSpacedByArrangement | { readonly kind: "start" | "end" | "center" | "spaceBetween" | "spaceAround" | "spaceEvenly" };
export type VerticalArrangement = SpacedByArrangement | CssSpacedByArrangement | { readonly kind: "top" | "bottom" | "center" | "spaceBetween" | "spaceAround" | "spaceEvenly" };

export const Arrangement = {
  Start: { kind: "start" } as const,
  End: { kind: "end" } as const,
  Top: { kind: "top" } as const,
  Bottom: { kind: "bottom" } as const,
  Center: { kind: "center" } as const,
  SpaceBetween: { kind: "spaceBetween" } as const,
  SpaceAround: { kind: "spaceAround" } as const,
  SpaceEvenly: { kind: "spaceEvenly" } as const,
  /**
   * Places a consistent gap between adjacent layout children.
   * Unlike AndroidX, space is expressed in CSS pixels by this Web adapter.
   */
  spacedBy(space: number): SpacedByArrangement {
    if (!Number.isFinite(space) || space < 0) {
      throw new RangeError("Arrangement.spacedBy(space) requires a finite, non-negative CSS pixel value.");
    }

    return { kind: "spacedBy", space };
  },
  /**
   * Web-only extension for shared CSS design tokens; not an AndroidX API.
   * Prefer this for Loculary semantic spacing so page values cannot drift.
   */
  spacedByCss(space: string): CssSpacedByArrangement {
    if (!space.trim()) {
      throw new TypeError("Arrangement.spacedByCss(space) requires a non-empty CSS length or variable.");
    }

    return { kind: "spacedByCss", space };
  },
} as const;
