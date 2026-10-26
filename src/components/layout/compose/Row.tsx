import type { CSSProperties, ReactNode } from "react";
import type { SpacedByArrangement } from "./Arrangement";
import type { ModifierElement } from "./Modifier";

export type RowProps = {
  children?: ReactNode;
  modifier?: ModifierElement;
  horizontalArrangement?: SpacedByArrangement;
  verticalAlignment?: "top" | "center" | "bottom" | "stretch";
  className?: string;
  style?: CSSProperties;
};

/** Web adaptation of androidx.compose.foundation.layout.Row. */
export function Row({ children, modifier, horizontalArrangement, verticalAlignment = "center", className, style }: RowProps) {
  const alignItems = { top: "flex-start", center: "center", bottom: "flex-end", stretch: "stretch" } as const;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: alignItems[verticalAlignment],
        ...(horizontalArrangement ? { gap: `${horizontalArrangement.space}px` } : {}),
        ...modifier?.toStyle(),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
