/**
 * Limited Web naming adapter for androidx.compose.ui.Alignment.
 * API reference: https://developer.android.com/reference/kotlin/androidx/compose/ui/Alignment
 *
 * This file only exposes alignment constants used by the current layout ports.
 * Their CSS rendering is a documented Web adaptation, not a complete Compose layout engine.
 */
export const Alignment = {
  Start: "start",
  CenterHorizontally: "centerHorizontally",
  End: "end",
  Top: "top",
  CenterVertically: "centerVertically",
  Bottom: "bottom",
  TopStart: "topStart",
  TopCenter: "topCenter",
  TopEnd: "topEnd",
  CenterStart: "centerStart",
  Center: "center",
  CenterEnd: "centerEnd",
  BottomStart: "bottomStart",
  BottomCenter: "bottomCenter",
  BottomEnd: "bottomEnd",
} as const;

/**
 * Direction-independent alignments from androidx.compose.ui.AbsoluteAlignment.
 * These keep left/right fixed in RTL layouts, unlike Alignment.Start/End.
 */
export const AbsoluteAlignment = {
  Left: "left",
  Right: "right",
  TopLeft: "topLeft",
  TopRight: "topRight",
  CenterLeft: "centerLeft",
  CenterRight: "centerRight",
  BottomLeft: "bottomLeft",
  BottomRight: "bottomRight",
} as const;

export type HorizontalAlignment =
  | typeof Alignment.Start
  | typeof Alignment.CenterHorizontally
  | typeof Alignment.End
  | typeof AbsoluteAlignment.Left
  | typeof AbsoluteAlignment.Right;
export type VerticalAlignment =
  | typeof Alignment.Top
  | typeof Alignment.CenterVertically
  | typeof Alignment.Bottom;
export type BoxAlignment =
  | typeof Alignment.TopStart
  | typeof Alignment.TopCenter
  | typeof Alignment.TopEnd
  | typeof Alignment.CenterStart
  | typeof Alignment.Center
  | typeof Alignment.CenterEnd
  | typeof Alignment.BottomStart
  | typeof Alignment.BottomCenter
  | typeof Alignment.BottomEnd
  | typeof AbsoluteAlignment.TopLeft
  | typeof AbsoluteAlignment.TopRight
  | typeof AbsoluteAlignment.CenterLeft
  | typeof AbsoluteAlignment.CenterRight
  | typeof AbsoluteAlignment.BottomLeft
  | typeof AbsoluteAlignment.BottomRight;
