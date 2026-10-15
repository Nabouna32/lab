import type { ReactNode } from "react";
import styles from "./BottomAppBar.module.css";

type BottomAppBarProps = {
  actions?: ReactNode;
  floatingActionButton?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Source-informed Web adaptation of AndroidX Material 3 BottomAppBar. */
export function BottomAppBar({ actions, floatingActionButton, children, className = "" }: BottomAppBarProps) {
  return <footer className={[styles.root, className].filter(Boolean).join(" ")} data-has-fab={floatingActionButton ? "true" : "false"}>
    <div className={styles.actions}>{actions}</div>
    {children && <div className={styles.customContent}>{children}</div>}
    {floatingActionButton && <div className={styles.fab}>{floatingActionButton}</div>}
  </footer>;
}
