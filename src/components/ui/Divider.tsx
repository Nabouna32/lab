import type { HTMLAttributes } from "react";
import styles from "./Divider.module.css";

type DividerProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  inset?: "none" | "start" | "middle";
};

/** Source-informed Web adaptation of AndroidX HorizontalDivider / VerticalDivider. */
export function Divider({ orientation = "horizontal", inset = "none", className = "", ...props }: DividerProps) {
  return <div {...props} role="separator" aria-orientation={orientation}
    className={[styles.divider, styles[orientation], styles[`inset-${inset}`], className].filter(Boolean).join(" ")} />;
}
