"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./ModalBottomSheet.module.css";

type ModalBottomSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  dismissLabel: string;
  onDismiss: () => void;
  children: ReactNode;
};

/**
 * Accessible Web adaptation informed by AndroidX Material 3 ModalBottomSheet.
 * It does not claim Compose parity: swipe-to-dismiss, SheetState/partial expansion,
 * Android window insets and Compose motion are not implemented here.
 */
export function ModalBottomSheet({
  open,
  title,
  description,
  dismissLabel,
  onDismiss,
  children,
}: ModalBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const getFocusable = () => {
      const root = sheetRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        sheetRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) {
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
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className={styles.scrim} data-modal-bottom-sheet onMouseDown={(event) => {
      if (event.target === event.currentTarget) onDismiss();
    }}>
      <section
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className={styles.handle} aria-hidden="true" />
        <h2 id={titleId} className={styles.title}>{title}</h2>
        {description && <p id={descriptionId} className={styles.description}>{description}</p>}
        <div className={styles.content}>{children}</div>
        <button type="button" className={styles.dismiss} onClick={onDismiss}>{dismissLabel}</button>
      </section>
    </div>
  );
}
