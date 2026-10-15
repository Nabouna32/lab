"use client";

import { useEffect } from "react";
import styles from "./Snackbar.module.css";

export type SnackbarVariant = "fidelity" | "expressive";

type SnackbarProps = {
  open: boolean;
  message: string;
  variant?: SnackbarVariant;
  actionLabel?: string;
  onAction?: () => void;
  dismissLabel?: string;
  onDismiss: () => void;
  durationMs?: number;
};

/**
 * Loculary Web adaptation of the AndroidX Material 3 Snackbar.
 *
 * This component reproduces the documented message/action/dismiss lifecycle
 * for the Web. It is not AndroidX Compose and does not provide SnackbarHostState,
 * Scaffold insets, queueing, swipe dismissal, or native Compose motion.
 */
export function Snackbar({
  open,
  message,
  variant = "fidelity",
  actionLabel,
  onAction,
  dismissLabel = "Dismiss",
  onDismiss,
  durationMs = 4000,
}: SnackbarProps) {
  useEffect(() => {
    if (!open || actionLabel || durationMs <= 0) return;
    const timeout = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timeout);
  }, [open, actionLabel, durationMs, onDismiss]);

  if (!open) return null;

  return (
    <div className={styles.snackbar} data-variant={variant} role="status" aria-live="polite" aria-atomic="true">
      <span className={styles.message}>{message}</span>
      <div className={styles.actions}>
        {actionLabel && onAction ? (
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              onAction();
              onDismiss();
            }}
          >
            {actionLabel}
          </button>
        ) : null}
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label={dismissLabel}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7l-1.4-1.4L9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z" fill="currentColor" transform="translate(1.5 0) scale(.9)" />
          </svg>
        </button>
      </div>
    </div>
  );
}
