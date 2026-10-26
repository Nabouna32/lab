import type { CSSProperties, ReactNode } from "react";
import { Alignment, type VerticalAlignment } from "./Alignment";
import { Arrangement, type HorizontalArrangement } from "./Arrangement";
import type { Modifier } from "./Modifier";

export type RowProps = {
  children?: ReactNode;
  modifier?: Modifier;
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
  const justifyContent = (() => {
    if (horizontalArrangement.kind === "spacedBy" || horizontalArrangement.kind === "spacedByCss") {
      if (horizontalArrangement.kind === "spacedBy" && horizontalArrangement.alignment) {
        return ({
          start: "flex-start",
          centerHorizontally: "center",
          end: "flex-end",
        } as const)[horizontalArrangement.alignment];
      }
      return "flex-start";
    }

    if (horizontalArrangement.kind === "aligned") {
      return ({
        start: "flex-start",
        centerHorizontally: "center",
        end: "flex-end",
      } as const)[horizontalArrangement.alignment];
    }

    return ({
      start: "flex-start",
      end: "flex-end",
      center: "center",
      spaceBetween: "space-between",
      spaceAround: "space-around",
      spaceEvenly: "space-evenly",
    } as const)[horizontalArrangement.kind];
  })();

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
        ...(horizontalArrangement.kind === "spacedBy" ? { gap: `${horizontalArrangement.space}px` } : horizontalArrangement.kind === "spacedByCss" ? { gap: horizontalArrangement.space } : {}),
        ...modifier?.toStyle(),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
