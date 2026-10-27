import type { HorizontalAlignment, VerticalAlignment } from "./Alignment";

/**
 * Partial Web adaptation of androidx.compose.foundation.layout.Arrangement.
 * AndroidX API: https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement
 *
 * Numeric spacing follows the Loculary port convention: 1 Android Dp = 1 CSS px.
 * String values are a Web adaptation that accepts semantic CSS tokens through this same API.
 * Browser layout still does not reproduce Compose measurement in every case.
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
  | "aligned"
  | "spacedBy";

export type SpacedByArrangement<AxisAlignment extends string = never> = {
  readonly kind: "spacedBy";
  /** Numeric Dp maps 1:1 to CSS px; strings are a Web extension for semantic CSS tokens. */
  readonly space: number | string;
  readonly alignment?: AxisAlignment;
};

export type AlignedHorizontalArrangement = {
  readonly kind: "aligned";
  readonly alignment: HorizontalAlignment;
};

export type AlignedVerticalArrangement = {
  readonly kind: "aligned";
  readonly alignment: VerticalAlignment;
};

export type HorizontalArrangement =
  | SpacedByArrangement<HorizontalAlignment>
  | AlignedHorizontalArrangement
  | { readonly kind: "start" | "end" | "center" | "spaceBetween" | "spaceAround" | "spaceEvenly" };

export type VerticalArrangement =
  | SpacedByArrangement<VerticalAlignment>
  | CssSpacedByArrangement
  | AlignedVerticalArrangement
  | { readonly kind: "top" | "bottom" | "center" | "spaceBetween" | "spaceAround" | "spaceEvenly" };

function assertFiniteSpacing(space: number): void {
  if (!Number.isFinite(space)) {
    throw new RangeError("Arrangement.spacedBy(space) requires a finite numeric Dp value.");
  }
}

function spacedBy(space: number | string): SpacedByArrangement;
function spacedBy(space: number | string, alignment: HorizontalAlignment): SpacedByArrangement<HorizontalAlignment>;
function spacedBy(space: number | string, alignment: VerticalAlignment): SpacedByArrangement<VerticalAlignment>;
function spacedBy(
  space: number | string,
  alignment?: HorizontalAlignment | VerticalAlignment,
): SpacedByArrangement<HorizontalAlignment | VerticalAlignment> {
  if (typeof space === "number") assertFiniteSpacing(space);
  else if (!space.trim()) throw new TypeError("Arrangement.spacedBy(space) requires a non-empty CSS length or token.");
  return alignment === undefined
    ? { kind: "spacedBy", space }
    : { kind: "spacedBy", space, alignment };
}

function aligned(alignment: HorizontalAlignment): AlignedHorizontalArrangement;
function aligned(alignment: VerticalAlignment): AlignedVerticalArrangement;
function aligned(alignment: HorizontalAlignment | VerticalAlignment): AlignedHorizontalArrangement | AlignedVerticalArrangement {
  return { kind: "aligned", alignment } as AlignedHorizontalArrangement | AlignedVerticalArrangement;
}

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
   * Places adjacent children at a fixed distance.
   * AndroidX also permits negative spacing and exposes alignment overloads. Negative spacing
   * is rendered with negative logical margins because CSS gap cannot be negative. This reproduces
   * overlap but not Compose’s complete constraint and measurement algorithm.
   */
  spacedBy,
  /** Aligns a packed group when the main axis has remaining space, as in AndroidX. */
  aligned,
} as const;
