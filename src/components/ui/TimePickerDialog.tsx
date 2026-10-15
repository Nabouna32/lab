"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TimePicker } from "@/components/ui/TimePicker";
import styles from "./DatePickerDialog.module.css";

export type TimePickerDialogProps = {
  open: boolean;
  title: string;
  label: string;
  value: string;
  confirmLabel: string;
  cancelLabel: string;
  is24Hour?: boolean;
  locale?: string;
  onConfirm: (value: string) => void;
  onDismiss: () => void;
};

/** Modal Web adaptation inspired by AndroidX TimePickerDialog. */
function TimePickerDialogContent({
  open,
  title,
  label,
  value,
  confirmLabel,
  cancelLabel,
  is24Hour = true,
  locale = "en",
  onConfirm,
  onDismiss,
}: TimePickerDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const onDismissRef = useRef(onDismiss);
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismissRef.current();
      } else if (event.key === "Tab") {
        const controls = focusable();
        if (!controls.length) {
          event.preventDefault();
          dialogRef.current?.focus();
        } else if (event.shiftKey && document.activeElement === controls[0]) {
          event.preventDefault();
          controls[controls.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
          event.preventDefault();
          controls[0].focus();
        }
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
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onDismiss(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={styles.dialog}>
        <h2 id={titleId}>{title}</h2>
        <TimePicker label={label} value={draftValue} onChange={setDraftValue} displayMode="dial" is24Hour={is24Hour} locale={locale}/>
        <div className={styles.actions}>
          <button ref={cancelRef} type="button" className={styles.textAction} onClick={onDismiss}>{cancelLabel}</button>
          <button type="button" className={styles.confirmAction} onClick={() => { onConfirm(draftValue); onDismiss(); }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}


/** Mount a fresh draft for each open session so cancelled edits never leak into the next session. */
export function TimePickerDialog(props: TimePickerDialogProps) {
  if (!props.open) return null;
  return <TimePickerDialogContent key={props.value} {...props} />;
}
