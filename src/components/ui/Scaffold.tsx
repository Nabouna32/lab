import type { ReactNode } from "react";

/**
 * Partial Web port of AndroidX Material 3 1.4.0 Scaffold.
 * SnackbarHost, FAB positioning, window insets and content PaddingValues are
 * not implemented yet; do not claim full AndroidX contract parity.
 */
import styles from "./Scaffold.module.css";

type ScaffoldProps = {
  children: ReactNode;
  topBar?: ReactNode;
  bottomBar?: ReactNode;
  navigationRail?: ReactNode;
  floatingActionButton?: ReactNode;
  className?: string;
};

export function Scaffold({ children, topBar, bottomBar, navigationRail, floatingActionButton, className = "" }: ScaffoldProps) {
  return <div className={[styles.root, className].filter(Boolean).join(" ")}>
    {topBar && <div className={styles.topBar}>{topBar}</div>}
    <div className={styles.middle}>
      {navigationRail && <div className={styles.navigation}>{navigationRail}</div>}
      <main className={styles.content}>{children}</main>
    </div>
    {bottomBar && <div className={styles.bottomBar}>{bottomBar}</div>}
    {floatingActionButton && <div className={styles.fab}>{floatingActionButton}</div>}
  </div>;
}
