"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateDateDuration, calculateTimeDuration } from "@/lib/duree";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Mode = "dates" | "horaires";

function toInputDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDurationPart(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

export default function DurationCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).duration;
  const [initialEndDateTime] = useState(() => toInputDateTime(new Date()));
  const [mode, setMode] = useState<Mode>("dates");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState(initialEndDateTime);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const dateDuration = mode === "dates" && startDateTime && endDateTime
    ? calculateDateDuration(new Date(startDateTime), new Date(endDateTime)) : null;
  const timeDuration = mode === "horaires" ? calculateTimeDuration(startTime, endTime) : null;
  const duration = mode === "dates" ? dateDuration : timeDuration;
  const hasValues = mode === "dates"
    ? startDateTime !== "" || endDateTime !== initialEndDateTime
    : startTime !== "" || endTime !== "";
  const invalidRange = mode === "dates" && startDateTime !== "" && endDateTime !== "" && dateDuration === null;

  const modes = [
    { id: "dates" as const, label: t.datesMode },
    { id: "horaires" as const, label: t.timesMode },
  ];

  function clearValues() {
    setStartDateTime("");
    setEndDateTime(initialEndDateTime);
    setStartTime("");
    setEndTime("");
  }

  function switchMode(nextMode: Mode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    clearValues();
  }

  const days = duration === null ? "—" : String(duration.days);
  const hours = duration === null ? "—" : String(duration.hours);
  const minutes = duration === null ? "—" : String(duration.minutes);

  return (
    <CalculatorShell>
      <div className="mb-4">
        <SegmentedControl items={modes} value={mode} onChange={switchMode} ariaLabel={`${t.datesMode} / ${t.timesMode}`} className="grid-cols-2" />
      </div>
      <CalculatorActions showClear={hasValues} onClear={clearValues} />
      <div className="grid gap-5 sm:grid-cols-2">
        {mode === "dates" ? (
          <>
            <CalculatorField label={t.startDate} inputId="duration-start-date" type="datetime-local" value={startDateTime} onChange={(event) => setStartDateTime(event.target.value)}  aria-invalid={invalidRange} aria-describedby="duration-error"/>
            <CalculatorField label={t.endDate} inputId="duration-end-date" type="datetime-local" value={endDateTime} onChange={(event) => setEndDateTime(event.target.value)}  aria-invalid={invalidRange} aria-describedby="duration-error"/>
          </>
        ) : (
          <>
            <CalculatorField label={t.startTime} inputId="duration-start-time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
            <CalculatorField label={t.endTime} inputId="duration-end-time" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
          </>
        )}
      </div>
      <div className={`mt-6 grid gap-4 ${mode === "dates" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {mode === "dates" && <CalculatorResult label={t.days} tone="accent" value={days} />}
        <CalculatorResult label={t.hours} tone={mode === "horaires" ? "accent" : undefined} value={hours} />
        <CalculatorResult label={t.minutes} value={minutes} />
      </div>
      {invalidRange && <p id="duration-error" role="alert" className="mt-4 text-sm font-medium text-[var(--foreground)]">{t.invalidRange}</p>}
      {duration && (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm leading-6 text-[var(--muted)]">
            {mode === "dates"
              ? t.summaryDates(
                  formatDurationPart(duration.days, t.daySingular, t.dayPlural),
                  formatDurationPart(duration.hours, t.hourSingular, t.hourPlural),
                  formatDurationPart(duration.minutes, t.minuteSingular, t.minutePlural),
                )
              : t.summaryTimes(
                  formatDurationPart(duration.hours, t.hourSingular, t.hourPlural),
                  formatDurationPart(duration.minutes, t.minuteSingular, t.minutePlural),
                )}
          </p>
          {mode === "horaires" && endTime < startTime && <p className="mt-2 text-xs text-[var(--muted)]">{t.overnight}</p>}
        </div>
      )}
    </CalculatorShell>
  );
}
