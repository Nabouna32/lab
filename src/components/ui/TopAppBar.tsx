import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./TopAppBar.module.css";

export type TopAppBarVariant = "small" | "center-aligned" | "medium" | "large";
type TopAppBarProps = {
  title: string;
  variant?: TopAppBarVariant;
  navigationIcon?: MaterialIconName;
  navigationLabel?: string;
  onNavigationClick?: () => void;
  actions?: ReactNode;
  collapsed?: boolean;
  className?: string;
};

/** Source-informed Web adaptation of AndroidX small/center-aligned/medium/large top app bars. */
export function TopAppBar({
  title, variant = "small", navigationIcon, navigationLabel = "Open navigation", onNavigationClick, actions, collapsed = false, className = "",
}: TopAppBarProps) {
  const expanded = (variant === "medium" || variant === "large") && !collapsed;
  const showNavigation = Boolean(onNavigationClick);
  return <header className={[styles.root, styles[variant], expanded ? styles.expanded : "", className].filter(Boolean).join(" ")}
    data-variant={variant} data-collapsed={collapsed ? "true" : "false"}>
    <div className={styles.row}>
      {showNavigation ? (
        <button type="button" className={styles.navigation} aria-label={navigationLabel} onClick={onNavigationClick}>
          <MaterialIcon name={navigationIcon ?? "menu"} size={24}/>
        </button>
      ) : null}
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.actions}>{actions}</div>
    </div>
  </header>;
}
