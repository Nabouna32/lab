import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "small" | "large";
  content?: ReactNode;
  accessibleLabel?: string;
};

/** Adaptation Web du badge Material 3 ; son nom accessible est explicite. */
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
      {hasContent ? content : null}
    </span>
  );
}

type BadgedBoxProps = {
  children: ReactNode;
  badge: ReactNode;
  className?: string;
};

/** Composition Loculary qui positionne un badge par rapport à son contenu d’ancrage. */
export function BadgedBox({ children, badge, className = "" }: BadgedBoxProps) {
  return (
    <span className={[styles.badgedBox, className].filter(Boolean).join(" ")}>
      {children}
      <span className={styles.anchor}>{badge}</span>
    </span>
  );
}
