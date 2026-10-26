import type { CSSProperties, ReactNode } from "react";
import { Alignment, type VerticalAlignment } from "./Alignment";
import { Arrangement, type HorizontalArrangement } from "./Arrangement";
import type { ModifierElement } from "./Modifier";

export type RowProps = {
  children?: ReactNode;
  modifier?: ModifierElement;
  horizontalArrangement?: HorizontalArrangement;
  verticalAlignment?: VerticalAlignment;
  className?: string;
  style?: CSSProperties;
};

/** Partial Web adaptation of androidx.compose.foundation.layout.Row. */
export function Row({
  children,
  modifier,
  horizontalArrangement = Arrangement.Start,
  verticalAlignment = Alignment.CenterVertically,
  className,
  style,
}: RowProps) {
  const justifyContent = horizontalArrangement.kind === "spacedBy"
    ? "flex-start"
    : ({
        start: "flex-start",
        end: "flex-end",
        center: "center",
        spaceBetween: "space-between",
        spaceAround: "space-around",
        spaceEvenly: "space-evenly",
      } as const)[horizontalArrangement.kind];

  const alignItems = ({
    top: "flex-start",
    centerVertically: "center",
    bottom: "flex-end",
  } as const)[verticalAlignment];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent,
        alignItems,
        ...(horizontalArrangement.kind === "spacedBy" ? { gap: `${horizontalArrangement.space}px` } : {}),
        ...modifier?.toStyle(),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
