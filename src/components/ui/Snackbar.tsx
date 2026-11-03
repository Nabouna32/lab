"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import styles from "./Snackbar.module.css";
import { TextButton } from "@/components/ui/Button";

type SnackbarProps = {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  withDismissAction?: boolean;
  dismissLabel?: string;
  onDismiss: () => void;
  durationMs?: number;
  actionOnNewLine?: boolean;
  containerColor?: string;
  contentColor?: string;
  actionContentColor?: string;
  dismissActionContentColor?: string;
  shape?: string;
};

/**
 * Partial visual/controller Web adaptation of AndroidX Material 3 1.4.0 Snackbar.
 * Queueing and SnackbarHostState remain separate, unimplemented contracts.
 */
export function Snackbar({
  open,
  message,
  actionLabel,
  onAction,
  withDismissAction = false,
  dismissLabel = "Dismiss",
  onDismiss,
  durationMs = 4000,
  actionOnNewLine = false,
  containerColor,
  contentColor,
  actionContentColor,
  dismissActionContentColor,
  shape,
}: SnackbarProps) {
  const hasAction = Boolean(actionLabel && onAction);
  const visualStyle = {
    "--snackbar-container-color": containerColor ?? "var(--inverse-surface)",
    "--snackbar-content-color": contentColor ?? "var(--inverse-on-surface)",
    "--snackbar-action-color": actionContentColor ?? "var(--inverse-primary)",
    "--snackbar-dismiss-color": dismissActionContentColor ?? "var(--inverse-on-surface)",
    "--snackbar-shape": shape ?? "var(--shape-corner-extra-small)",
  } as CSSProperties;

  useEffect(() => {
    if (!open || hasAction || durationMs <= 0) return;
    const timeout = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timeout);
  }, [open, hasAction, durationMs, onDismiss]);

  if (!open) return null;

  return (
    <div
      className={[styles.snackbar, actionOnNewLine && hasAction ? styles.actionOnNewLine : ""]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={visualStyle}
    >
      <span className={styles.message}>{message}</span>
      <div className={styles.actions}>
        {hasAction ? (
          <TextButton
            type="button"
            className="min-h-11 min-w-[44px]"
            colors={{ contentColor: "var(--snackbar-action-color)" }}
            onClick={() => {
              onAction?.();
              onDismiss();
            }}
          >
            {actionLabel}
          </TextButton>
        ) : null}
        {withDismissAction ? (
          <button
            type="button"
            className={styles.dismiss}
            onClick={onDismiss}
            aria-label={dismissLabel}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7l-1.4-1.4L9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z" fill="currentColor" transform="translate(1.5 0) scale(.9)" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
