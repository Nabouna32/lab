"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import styles from "./DatePicker.module.css";

export type DateRangeValue = { start: string; end: string };

export type DatePickerProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: "single" | "range";
  rangeValue?: DateRangeValue;
  onRangeChange?: (value: DateRangeValue) => void;
  displayMode?: "calendar" | "input";
  min?: string;
  max?: string;
  locale?: string;
};

/** Shared Web adaptation of AndroidX DatePicker / DateRangePicker.
 * The input mode intentionally uses native HTML date inputs; it is not the
 * AndroidX modal-input implementation. Calendar/dialog parity remains under audit.
 */
function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function moveMonth(date: Date, offset: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + offset;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(date.getDate(), lastDay));
}

export function DatePicker({
  label,
  value = "",
  onChange,
  mode = "single",
  rangeValue = { start: "", end: "" },
  onRangeChange,
  displayMode = "calendar",
  min,
  max,
  locale = "en",
}: DatePickerProps) {
  const selectedDate = parseDate(value);
  const rangeStart = parseDate(rangeValue.start);
  const [focusedDate, setFocusedDate] = useState(() => toIsoDate(selectedDate ?? rangeStart ?? new Date()));
  const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const shouldFocusDate = useRef(false);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const selected = selectedDate ?? rangeStart ?? new Date();
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const today = toIsoDate(new Date());
  const weekdayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const weekdays = useMemo(() => {
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return weekdayFormatter.format(date);
    });
  }, [weekdayFormatter]);
  const days = useMemo(() => {
    const first = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [displayedMonth]);

  useEffect(() => {
    if (!shouldFocusDate.current) return;
    dayRefs.current[focusedDate]?.focus();
    shouldFocusDate.current = false;
  }, [focusedDate, days]);

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const nextDate = new Date(date);
    if (event.key === "ArrowLeft") nextDate.setDate(date.getDate() - 1);
    else if (event.key === "ArrowRight") nextDate.setDate(date.getDate() + 1);
    else if (event.key === "ArrowUp") nextDate.setDate(date.getDate() - 7);
    else if (event.key === "ArrowDown") nextDate.setDate(date.getDate() + 7);
    else if (event.key === "Home") nextDate.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    else if (event.key === "End") nextDate.setDate(date.getDate() + (6 - ((date.getDay() + 6) % 7)));
    else if (event.key === "PageUp") nextDate.setTime(moveMonth(date, -1).getTime());
    else if (event.key === "PageDown") nextDate.setTime(moveMonth(date, 1).getTime());
    else return;
    event.preventDefault();
    const nextIso = toIsoDate(nextDate);
    if ((min && nextIso < min) || (max && nextIso > max)) return;
    setFocusedDate(nextIso);
    shouldFocusDate.current = true;
    if (!sameMonth(nextDate, displayedMonth)) setDisplayedMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  }

  function chooseDate(date: Date) {
    const iso = toIsoDate(date);
    if (min && iso < min || max && iso > max) return;
    if (mode === "single") {
      onChange?.(iso);
      return;
    }
    if (!rangeValue.start || rangeValue.end || iso < rangeValue.start) {
      onRangeChange?.({ start: iso, end: "" });
    } else {
      onRangeChange?.({ start: rangeValue.start, end: iso });
    }
  }

  function changeMonth(offset: number) {
    setDisplayedMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  if (displayMode === "input") {
    return (
      <fieldset className={styles.inputMode}>
        <legend>{label}</legend>
        {mode === "single" ? (
          <label className={styles.inputLabel}>
            <span>{label}</span>
            <input type="date" value={value} min={min} max={max} onChange={(event) => onChange?.(event.target.value)} />
          </label>
        ) : (
          <>
            <label className={styles.inputLabel}>
              <span>{locale.startsWith("fr") ? "Date de début" : "Start date"}</span>
              <input type="date" value={rangeValue.start} min={min} max={rangeValue.end || max} onChange={(event) => onRangeChange?.({ start: event.target.value, end: rangeValue.end })} />
            </label>
            <label className={styles.inputLabel}>
              <span>{locale.startsWith("fr") ? "Date de fin" : "End date"}</span>
              <input type="date" value={rangeValue.end} min={rangeValue.start || min} max={max} onChange={(event) => onRangeChange?.({ start: rangeValue.start, end: event.target.value })} />
            </label>
          </>
        )}
      </fieldset>
    );
  }

  return (
    <section className={styles.root} aria-label={label} style={{ "--date-picker-columns": 7 } as CSSProperties}>
      <div className={styles.header}>
        <strong>{monthFormatter.format(displayedMonth)}</strong>
        <div className={styles.monthActions}>
          <button type="button" onClick={() => changeMonth(-1)} aria-label={locale.startsWith("fr") ? "Mois précédent" : "Previous month"}>‹</button>
          <button type="button" onClick={() => changeMonth(1)} aria-label={locale.startsWith("fr") ? "Mois suivant" : "Next month"}>›</button>
        </div>
      </div>
      <div className={styles.calendar} role="grid" aria-label={monthFormatter.format(displayedMonth)}>
        {weekdays.map((day, index) => <span key={`${day}-${index}`} className={styles.weekday} role="columnheader">{day}</span>)}
        {days.map((date) => {
          const iso = toIsoDate(date);
          const inMonth = sameMonth(date, displayedMonth);
          const isSelected = mode === "single" ? iso === value : iso === rangeValue.start || iso === rangeValue.end;
          const inRange = mode === "range" && Boolean(rangeValue.start && rangeValue.end && iso >= rangeValue.start && iso <= rangeValue.end);
          const disabled = Boolean((min && iso < min) || (max && iso > max));
          return (
            <button
              key={iso}
              ref={(node) => { dayRefs.current[iso] = node; }}
              tabIndex={iso === focusedDate ? 0 : -1}
              type="button"
              role="gridcell"
              aria-label={new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date)}
              aria-pressed={isSelected}
              aria-current={iso === today ? "date" : undefined}
              disabled={disabled}
              className={[styles.day, !inMonth ? styles.outsideMonth : "", isSelected ? styles.selected : "", inRange ? styles.inRange : ""].filter(Boolean).join(" ")}
              onClick={() => { setFocusedDate(iso); chooseDate(date); }}
              onKeyDown={(event) => handleDayKeyDown(event, date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      {mode === "range" && <p className={styles.helper}>{rangeValue.start ? (rangeValue.end ? `${rangeValue.start} – ${rangeValue.end}` : (locale.startsWith("fr") ? "Choisissez la date de fin" : "Choose an end date")) : (locale.startsWith("fr") ? "Choisissez la date de début" : "Choose a start date")}</p>}
    </section>
  );
}
