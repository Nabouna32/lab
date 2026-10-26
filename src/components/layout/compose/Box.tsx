import type { CSSProperties, ReactNode } from "react";
import type { ModifierElement } from "./Modifier";

export type BoxProps = {
  children?: ReactNode;
  modifier?: ModifierElement;
  contentAlignment?: "topStart" | "topCenter" | "centerStart" | "center" | "centerEnd" | "bottomStart" | "bottomCenter" | "bottomEnd";
  className?: string;
  style?: CSSProperties;
};

/** Limited Web adaptation of androidx.compose.foundation.layout.Box. */
export function Box({ children, modifier, contentAlignment = "topStart", className, style }: BoxProps) {
  const alignment: Record<NonNullable<BoxProps["contentAlignment"]>, CSSProperties> = {
    topStart: { justifyContent: "flex-start", alignItems: "flex-start" },
    topCenter: { justifyContent: "flex-start", alignItems: "center" },
    centerStart: { justifyContent: "center", alignItems: "flex-start" },
    center: { justifyContent: "center", alignItems: "center" },
    centerEnd: { justifyContent: "center", alignItems: "flex-end" },
    bottomStart: { justifyContent: "flex-end", alignItems: "flex-start" },
    bottomCenter: { justifyContent: "flex-end", alignItems: "center" },
    bottomEnd: { justifyContent: "flex-end", alignItems: "flex-end" },
  };

  return (
    <div
      className={className}
      style={{ display: "flex", ...alignment[contentAlignment], ...modifier?.toStyle(), ...style }}
    >
      {children}
    </div>
  );
}
