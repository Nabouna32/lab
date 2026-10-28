import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "small" | "large";
  content?: ReactNode;
  accessibleLabel?: string;
};

/** Source-informed Web adaptation of AndroidX Material 3 Badge. */
export function Badge({ variant = "small", content, accessibleLabel, className = "", ...props }: BadgeProps) {
  const hasContent = content !== undefined && content !== null && (typeof content !== "boolean" || content);
  return <span {...props} className={["m3-type-label-small", styles.badge, styles[variant], className].filter(Boolean).join(" ")}
    aria-label={accessibleLabel} data-has-content={hasContent ? "true" : "false"}>
    {hasContent ? content : <span className={styles.dot} aria-hidden="true"/>}
  </span>;
}

type BadgedBoxProps = {
  children: ReactNode;
  badge: ReactNode;
  className?: string;
};

/** Positions a badge relative to its anchor content, like AndroidX BadgedBox. */
export function BadgedBox({ children, badge, className = "" }: BadgedBoxProps) {
  return <span className={[styles.badgedBox, className].filter(Boolean).join(" ")}>
    {children}<span className={styles.anchor}>{badge}</span>
  </span>;
}
