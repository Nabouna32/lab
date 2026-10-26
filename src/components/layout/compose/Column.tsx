import type { CSSProperties, ReactNode } from "react";
import { Alignment, type HorizontalAlignment } from "./Alignment";
import { Arrangement, type VerticalArrangement } from "./Arrangement";
import type { ModifierElement } from "./Modifier";

export type ColumnProps = {
  children?: ReactNode;
  modifier?: ModifierElement;
  verticalArrangement?: VerticalArrangement;
  horizontalAlignment?: HorizontalAlignment;
  className?: string;
  style?: CSSProperties;
};

/** Partial Web adaptation of androidx.compose.foundation.layout.Column. */
export function Column({
  children,
  modifier,
  verticalArrangement = Arrangement.Top,
  horizontalAlignment = Alignment.Start,
  className,
  style,
}: ColumnProps) {
  const justifyContent = verticalArrangement.kind === "spacedBy"
    ? "flex-start"
    : ({
        top: "flex-start",
        bottom: "flex-end",
        center: "center",
        spaceBetween: "space-between",
        spaceAround: "space-around",
        spaceEvenly: "space-evenly",
      } as const)[verticalArrangement.kind];

  const alignItems = ({
    start: "flex-start",
    centerHorizontally: "center",
    end: "flex-end",
  } as const)[horizontalAlignment];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent,
        alignItems,
        ...(verticalArrangement.kind === "spacedBy" ? { gap: `${verticalArrangement.space}px` } : {}),
        ...modifier?.toStyle(),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
