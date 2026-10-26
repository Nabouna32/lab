import { Children, type CSSProperties, type ReactNode } from "react";
import { Alignment, type BoxAlignment } from "./Alignment";
import type { Modifier } from "./Modifier";

export type BoxProps = {
  children?: ReactNode;
  modifier?: Modifier;
  contentAlignment?: BoxAlignment;
  className?: string;
  style?: CSSProperties;
};

/**
 * Web adaptation of androidx.compose.foundation.layout.Box.
 * Children share one CSS grid cell to approximate Compose's stacking behavior.
 * Compose's constraint and measurement rules are not fully reproduced.
 */
export function Box({
  children,
  modifier,
  contentAlignment = Alignment.TopStart,
  className,
  style,
}: BoxProps) {
  const alignment: Record<BoxAlignment, { justifySelf: CSSProperties["justifySelf"]; alignSelf: CSSProperties["alignSelf"] }> = {
    topStart: { justifySelf: "start", alignSelf: "start" },
    topCenter: { justifySelf: "center", alignSelf: "start" },
    topEnd: { justifySelf: "end", alignSelf: "start" },
    centerStart: { justifySelf: "start", alignSelf: "center" },
    center: { justifySelf: "center", alignSelf: "center" },
    centerEnd: { justifySelf: "end", alignSelf: "center" },
    bottomStart: { justifySelf: "start", alignSelf: "end" },
    bottomCenter: { justifySelf: "center", alignSelf: "end" },
    bottomEnd: { justifySelf: "end", alignSelf: "end" },
  };

  return (
    <div
      className={className}
      style={{ display: "grid", ...modifier?.toStyle(), ...style }}
    >
      {Children.map(children, (child) => (
        <div style={{ gridArea: "1 / 1", ...alignment[contentAlignment] }}>{child}</div>
      ))}
    </div>
  );
}
