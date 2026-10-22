"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./AlertDialog.module.css";
import { Button, TextButton } from "./Button";

/**
 * Accessible Web adaptation informed by AndroidX Material 3 AlertDialog.
 * It is not the native Compose component; platform-specific window behavior and
 * exact AndroidX layout/motion remain outside this implementation.
 */
type AlertDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  dismissLabel: string;
  onConfirm: () => void;
  onDismiss: () => void;
  icon?: ReactNode;
  destructive?: boolean;
};

export function AlertDialog({
  open,
  title,
  description,
  confirmLabel,
  dismissLabel,
  onConfirm,
  onDismiss,
  icon,
  destructive = false,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismissRef = useRef<HTMLButtonElement>(null);
  const onDismissRef = useRef(onDismiss);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dismissRef.current?.focus();

    const getFocusable = () => {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismissRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.scrim} data-alert-dialog onClick={(event) => {
      if (event.target === event.currentTarget) onDismiss();
    }}>
      <section
        ref={dialogRef}
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <p id={descriptionId} className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <TextButton ref={dismissRef} type="button" onClick={onDismiss}>{dismissLabel}</TextButton>
          <Button type="button" colors={destructive ? { containerColor: "var(--error)", contentColor: "var(--on-error)" } : undefined} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </section>
    </div>
  );
}
