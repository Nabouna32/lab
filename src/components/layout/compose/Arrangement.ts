/**
 * Web adaptation of androidx.compose.foundation.layout.Arrangement.
 *
 * API reference: https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/Arrangement
 * Upstream source baseline: AndroidX androidx-main is intentionally not treated as a
 * pinned release. See docs/material3/sources.md before claiming release-level parity.
 *
 * This port currently implements only the spacing contract needed by Loculary.
 * It is not a complete port of AndroidX Arrangement.
 */

export type SpacedByArrangement = {
  readonly kind: "spacedBy";
  /** CSS pixels in this Web port, not Android Dp. */
  readonly space: number;
};

export const Arrangement = {
  /**
   * Places a consistent CSS gap between adjacent layout children.
   * Unlike AndroidX, space is expressed in CSS pixels by this Web adapter.
   */
  spacedBy(space: number): SpacedByArrangement {
    if (!Number.isFinite(space) || space < 0) {
      throw new RangeError("Arrangement.spacedBy(space) requires a finite, non-negative CSS pixel value.");
    }

    return { kind: "spacedBy", space };
  },
} as const;
