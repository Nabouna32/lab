import type { CSSProperties, ReactNode } from "react";
import type { SpacedByArrangement } from "./Arrangement";
import type { ModifierElement } from "./Modifier";

export type ColumnProps = {
  children?: ReactNode;
  modifier?: ModifierElement;
  verticalArrangement?: SpacedByArrangement;
  horizontalAlignment?: "start" | "center" | "end" | "stretch";
  className?: string;
  style?: CSSProperties;
};

/** Web adaptation of androidx.compose.foundation.layout.Column. */
export function Column({ children, modifier, verticalArrangement, horizontalAlignment = "stretch", className, style }: ColumnProps) {
  const alignItems = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: alignItems[horizontalAlignment],
        ...(verticalArrangement ? { gap: `${verticalArrangement.space}px` } : {}),
        ...modifier?.toStyle(),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
