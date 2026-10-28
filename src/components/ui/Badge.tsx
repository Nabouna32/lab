import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "small" | "large";
  content?: ReactNode;
  accessibleLabel?: string;
};

/** Web adaptation of AndroidX Material 3 Badge; its accessible name is explicit. */
export function Badge({ variant = "small", content, accessibleLabel, className = "", ...props }: BadgeProps) {
  const hasContent = content !== undefined && content !== null && (typeof content !== "boolean" || content);
  return (
    <span
      {...props}
      className={["m3-type-label-small", styles.badge, styles[variant], className].filter(Boolean).join(" ")}
      role={accessibleLabel ? "img" : undefined}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
      data-has-content={hasContent ? "true" : "false"}
    >
      {hasContent ? content : <span className={styles.dot} aria-hidden="true" />}
    </span>
  );
}

type BadgedBoxProps = {
  children: ReactNode;
  badge: ReactNode;
  className?: string;
};

/** Loculary Web composition positioning a badge relative to its anchor content. */
export function BadgedBox({ children, badge, className = "" }: BadgedBoxProps) {
  return (
    <span className={[styles.badgedBox, className].filter(Boolean).join(" ")}>
      {children}
      <span className={styles.anchor}>{badge}</span>
    </span>
  );
}
