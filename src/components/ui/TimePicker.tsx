"use client";

import { useMemo, useState } from "react";
import styles from "./TimePicker.module.css";

export type TimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  displayMode?: "dial" | "input";
  is24Hour?: boolean;
  locale?: string;
};

/**
 * Shared Web adaptation of AndroidX TimePicker / TimeInput. Dial and input
 * are represented, but input mode is native HTML type=time and does not claim
 * pixel-level or interaction parity with AndroidX TimeInput.
 */
export function TimePicker({
  label,
  value,
  onChange,
  displayMode = "dial",
  is24Hour = true,
  locale = "en",
}: TimePickerProps) {
  const [selection, setSelection] = useState<"hour" | "minute">("hour");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [hourText, minuteText] = value.split(":");
  const hour24 = Number(hourText || 0) % 24;
  const minute = Number(minuteText || 0) % 60;
  const hour12 = hour24 % 12 || 12;
  const hourLabel = is24Hour ? String(hour24).padStart(2, "0") : String(hour12);
  const dialValues = useMemo(() => {
    if (selection === "minute") return Array.from({ length: 12 }, (_, index) => index * 5);
    return is24Hour ? Array.from({ length: 24 }, (_, index) => index) : Array.from({ length: 12 }, (_, index) => (index + 1) % 12);
  }, [is24Hour, selection]);

  function updateTime(nextHour: number, nextMinute: number) {
    const boundedHour = Math.min(23, Math.max(0, nextHour));
    const boundedMinute = Math.min(59, Math.max(0, nextMinute));
    onChange(`${String(boundedHour).padStart(2, "0")}:${String(boundedMinute).padStart(2, "0")}`);
  }

  function chooseDialValue(number: number) {
    if (selection === "hour") {
      const nextHour = is24Hour ? number : (number % 12) + (ampm === "PM" ? 12 : 0);
      updateTime(nextHour, minute);
      setSelection("minute");
    } else {
      updateTime(hour24, number);
    }
  }

  if (displayMode === "input") {
    return (
      <label className={styles.inputMode}>
        <span>{label}</span>
        <input type="time" value={value} aria-label={label} onChange={(event) => onChange(event.target.value)} />
      </label>
    );
  }

  return (
    <section className={styles.root} aria-label={label}>
      <div className={styles.timeHeader}>
        <div className={styles.digitalTime}>
          <button type="button" aria-pressed={selection === "hour"} className={selection === "hour" ? styles.digitalSelected : ""} onClick={() => setSelection("hour")}>{hourLabel}</button>
          <span>:</span>
          <button type="button" aria-pressed={selection === "minute"} className={selection === "minute" ? styles.digitalSelected : ""} onClick={() => setSelection("minute")}>{String(minute).padStart(2, "0")}</button>
        </div>
        {!is24Hour && <div className={styles.ampm} role="group" aria-label={locale.startsWith("fr") ? "Période" : "AM or PM"}>
          <button type="button" aria-pressed={ampm === "AM"} onClick={() => { setAmpm("AM"); if (hour24 >= 12) updateTime(hour24 - 12, minute); }}>AM</button>
          <button type="button" aria-pressed={ampm === "PM"} onClick={() => { setAmpm("PM"); if (hour24 < 12) updateTime(hour24 + 12, minute); }}>PM</button>
        </div>}
      </div>
      <div className={styles.clock} role="group" aria-label={selection === "hour" ? (locale.startsWith("fr") ? "Choisir l’heure" : "Choose hour") : (locale.startsWith("fr") ? "Choisir les minutes" : "Choose minutes")}>
        <div className={styles.hand} style={{ transform: `rotate(${selection === "hour" ? ((is24Hour ? hour24 % 12 : hour12 % 12) * 30) : minute * 6}deg)` }} />
        {dialValues.map((number) => {
          const isInnerHour = selection === "hour" && is24Hour && (number === 0 || number > 12);
          const ringValue = selection === "hour" ? number % 12 : number / 5;
          const angle = ringValue * 30 - 90;
          const radius = isInnerHour ? 27 : 41;
          const left = 50 + Math.cos((angle * Math.PI) / 180) * radius;
          const top = 50 + Math.sin((angle * Math.PI) / 180) * radius;
          const selected = selection === "hour" ? number === hour24 : number === minute;
          const labelValue = selection === "minute" ? String(number).padStart(2, "0") : is24Hour ? String(number).padStart(2, "0") : String(number || 12);
          return (
            <button
              key={number}
              type="button"
              className={[styles.dialValue, selected ? styles.dialSelected : "", isInnerHour ? styles.innerHour : ""].filter(Boolean).join(" ")}
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={selection === "hour" ? `${locale.startsWith("fr") ? "Heure" : "Hour"} ${labelValue}` : `${locale.startsWith("fr") ? "Minute" : "Minute"} ${labelValue}`}
              aria-pressed={selected}
              onClick={() => chooseDialValue(number)}
            >{labelValue}</button>
          );
        })}
      </div>
      <p className={styles.helper}>{selection === "hour" ? (locale.startsWith("fr") ? "Choisissez une heure, puis les minutes." : "Choose an hour, then choose minutes.") : (locale.startsWith("fr") ? "Choisissez les minutes ; touchez les heures pour revenir." : "Choose minutes; select the hour to return.")}</p>
    </section>
  );
}
