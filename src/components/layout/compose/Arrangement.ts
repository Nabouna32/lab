import type { HorizontalAlignment, VerticalAlignment } from "./Alignment";

/**
 * Partial Web adaptation of androidx.compose.foundation.layout.Arrangement.
 * AndroidX API: https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement
 *
 * Spacing values are CSS pixels, not Android Dp. This adapter intentionally keeps
 * unsupported measurement behavior explicit instead of claiming full Compose parity.
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
  | "spacedBy"
  | "spacedByCss";

export type SpacedByArrangement<AxisAlignment extends string = never> = {
  readonly kind: "spacedBy";
  /** CSS pixels in this Web port, not Android Dp. */
  readonly space: number;
  readonly alignment?: AxisAlignment;
};

export type CssSpacedByArrangement = {
  readonly kind: "spacedByCss";
  /** Explicit Web-only extension; use a shared semantic CSS token where possible. */
  readonly space: string;
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
  | CssSpacedByArrangement
  | AlignedHorizontalArrangement
  | { readonly kind: "start" | "end" | "center" | "spaceBetween" | "spaceAround" | "spaceEvenly" };

export type VerticalArrangement =
  | SpacedByArrangement<VerticalAlignment>
  | CssSpacedByArrangement
  | AlignedVerticalArrangement
  | { readonly kind: "top" | "bottom" | "center" | "spaceBetween" | "spaceAround" | "spaceEvenly" };

function assertFiniteSpacing(space: number): void {
  if (!Number.isFinite(space) || space < 0) {
    throw new RangeError("Arrangement.spacedBy(space) currently requires a finite, non-negative CSS pixel value.");
  }
}

function spacedBy(space: number): SpacedByArrangement;
function spacedBy(space: number, alignment: HorizontalAlignment): SpacedByArrangement<HorizontalAlignment>;
function spacedBy(space: number, alignment: VerticalAlignment): SpacedByArrangement<VerticalAlignment>;
function spacedBy(
  space: number,
  alignment?: HorizontalAlignment | VerticalAlignment,
): SpacedByArrangement<HorizontalAlignment | VerticalAlignment> {
  assertFiniteSpacing(space);
  return alignment === undefined
    ? { kind: "spacedBy", space }
    : { kind: "spacedBy", space, alignment };
}

function aligned(alignment: HorizontalAlignment): AlignedHorizontalArrangement;
function aligned(alignment: VerticalAlignment): AlignedVerticalArrangement;
function aligned(alignment: HorizontalAlignment | VerticalAlignment): AlignedHorizontalArrangement | AlignedVerticalArrangement {
  return { kind: "aligned", alignment } as AlignedHorizontalArrangement | AlignedVerticalArrangement;
}

function spacedByCss(space: string): CssSpacedByArrangement {
  if (!space.trim()) {
    throw new TypeError("Arrangement.spacedByCss(space) requires a non-empty CSS length or variable.");
  }

  return { kind: "spacedByCss", space };
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
   * remains unsupported by this CSS adapter because CSS gap cannot represent it faithfully.
   */
  spacedBy,
  /** Aligns a packed group when the main axis has remaining space, as in AndroidX. */
  aligned,
  /**
   * Web-only extension for shared CSS design tokens; not an AndroidX API.
   * Prefer this for Loculary semantic spacing so page values cannot drift.
   */
  spacedByCss,
} as const;
