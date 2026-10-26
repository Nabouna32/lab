import type { CSSProperties } from "react";
import type { Modifier } from "./Modifier";

export type SpacerProps = {
  modifier?: Modifier;
  className?: string;
  style?: CSSProperties;
};

/**
 * Web adaptation of androidx.compose.foundation.layout.Spacer.
 * It has no intrinsic size; size must come from its modifier or layout constraints.
 */
export function Spacer({ modifier, className, style }: SpacerProps) {
  const layout = (
    <div
      aria-hidden="true"
      className={className}
      style={{ ...style }}
    />
  );

  return modifier ? modifier.wrap(layout) : layout;
}
