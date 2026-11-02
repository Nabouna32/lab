"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./BottomAppBar.module.css";

type BottomAppBarContentPadding = {
  start?: number;
  top?: number;
  end?: number;
};

type BottomAppBarProps = {
  /** AndroidX RowScope action content. */
  actions?: ReactNode;
  /** Optional FAB slot placed at the logical end of the bar. */
  floatingActionButton?: ReactNode;
  /** Compatibility alias for actions; not a separate AndroidX slot. */
  children?: ReactNode;
  containerColor?: string;
  contentColor?: string;
  contentPadding?: BottomAppBarContentPadding;
  className?: string;
  style?: CSSProperties;
};

/**
 * Partial React/Web adaptation of the stable AndroidX Material 3 1.4.0 BottomAppBar overloads.
 * Experimental nested-scroll behavior is intentionally not represented by this component.
 */
export function BottomAppBar({
  actions,
  floatingActionButton,
  children,
  containerColor,
  contentColor,
  contentPadding,
  className = "",
  style,
}: BottomAppBarProps) {
  const resolvedContainerColor =
    containerColor ??
    "var(--lab-surface-container, var(--surface-container, var(--lab-surface, transparent)))";
  const resolvedContentColor =
    contentColor ?? (containerColor ? "currentColor" : "var(--on-surface, currentColor)");

  const barStyle = {
    "--bottom-app-bar-container-color": resolvedContainerColor,
    "--bottom-app-bar-content-color": resolvedContentColor,
    "--bottom-app-bar-padding-start": contentPadding?.start === undefined ? "4px" : `${contentPadding.start}px`,
    "--bottom-app-bar-padding-top": contentPadding?.top === undefined ? "4px" : `${contentPadding.top}px`,
    "--bottom-app-bar-padding-end": contentPadding?.end === undefined ? "4px" : `${contentPadding.end}px`,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={barStyle}
      data-has-fab={floatingActionButton ? "true" : "false"}
      data-component="BottomAppBar"
    >
      <div className={styles.actions}>{actions ?? children}</div>
      {floatingActionButton ? <div className={styles.fab}>{floatingActionButton}</div> : null}
    </div>
  );
}
