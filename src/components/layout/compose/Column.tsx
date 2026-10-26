import type { CSSProperties, ReactNode } from "react";
import { Alignment, type HorizontalAlignment } from "./Alignment";
import { Arrangement, type VerticalArrangement } from "./Arrangement";
import type { Modifier } from "./Modifier";

export type ColumnProps = {
  children?: ReactNode;
  modifier?: Modifier;
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
  const justifyContent = (() => {
    if (verticalArrangement.kind === "spacedBy" || verticalArrangement.kind === "spacedByCss") {
      if (verticalArrangement.kind === "spacedBy" && verticalArrangement.alignment) {
        return ({
          top: "flex-start",
          centerVertically: "center",
          bottom: "flex-end",
        } as const)[verticalArrangement.alignment];
      }
      return "flex-start";
    }

    if (verticalArrangement.kind === "aligned") {
      return ({
        top: "flex-start",
        centerVertically: "center",
        bottom: "flex-end",
      } as const)[verticalArrangement.alignment];
    }

    return ({
      top: "flex-start",
      bottom: "flex-end",
      center: "center",
      spaceBetween: "space-between",
      spaceAround: "space-around",
      spaceEvenly: "space-evenly",
    } as const)[verticalArrangement.kind];
  })();

  const hasNegativeGap = verticalArrangement.kind === "spacedBy" && verticalArrangement.space < 0;
  const layoutClassName = [
    className,
    hasNegativeGap ? "compose-layout-negative-gap-column" : "",
  ].filter(Boolean).join(" ");
  const spacingStyle: CSSProperties = verticalArrangement.kind === "spacedBy"
    ? verticalArrangement.space < 0
      ? ({ gap: 0, "--compose-layout-negative-gap": `${verticalArrangement.space}px` } as CSSProperties)
      : { gap: `${verticalArrangement.space}px` }
    : verticalArrangement.kind === "spacedByCss"
      ? { gap: verticalArrangement.space }
      : {};

  const alignItems = ({
    start: "flex-start",
    centerHorizontally: "center",
    end: "flex-end",
  } as const)[horizontalAlignment];

  const layout = (
    <div
      className={layoutClassName || undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent,
        alignItems,
        ...spacingStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );

  return modifier ? modifier.wrap(layout) : layout;
}
