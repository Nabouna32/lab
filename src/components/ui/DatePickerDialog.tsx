"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { DateRangeValue } from "@/components/ui/DatePicker";
import { DatePicker } from "@/components/ui/DatePicker";
import styles from "./DatePickerDialog.module.css";

export type DatePickerSelection =
  | { mode: "single"; value: string }
  | { mode: "range"; value: DateRangeValue };

export type DatePickerDialogProps = {
  open: boolean;
  title: string;
  label: string;
  value: string;
  rangeValue: DateRangeValue;
  mode?: "single" | "range";
  confirmLabel: string;
  cancelLabel: string;
  locale?: string;
  onConfirm: (selection: DatePickerSelection) => void;
  onDismiss: () => void;
};

/** Modal Web adaptation of AndroidX DatePickerDialog + DatePicker/DateRangePicker. */
export function DatePickerDialog({
  open,
  title,
  label,
  value,
  rangeValue,
  mode = "single",
  confirmLabel,
  cancelLabel,
  locale = "en",
  onConfirm,
  onDismiss,
}: DatePickerDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const onDismissRef = useRef(onDismiss);
  const [draftDate, setDraftDate] = useState(value);
  const [draftRange, setDraftRange] = useState(rangeValue);

  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);

  useEffect(() => {
    if (!open) return;
    setDraftDate(value);
    setDraftRange(rangeValue);
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const getFocusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismissRef.current();
      } else if (event.key === "Tab") {
        const focusable = getFocusable();
        if (!focusable.length) {
          event.preventDefault();
          dialogRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, value, rangeValue]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onDismiss(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={styles.dialog}>
        <h2 id={titleId}>{title}</h2>
        <DatePicker
          label={label}
          value={draftDate}
          onChange={setDraftDate}
          mode={mode}
          rangeValue={draftRange}
          onRangeChange={setDraftRange}
          locale={locale}
        />
        <div className={styles.actions}>
          <button ref={cancelRef} type="button" className={styles.textAction} onClick={onDismiss}>{cancelLabel}</button>
          <button type="button" className={styles.confirmAction} onClick={() => { onConfirm(mode === "single" ? { mode: "single", value: draftDate } : { mode: "range", value: draftRange }); onDismiss(); }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
