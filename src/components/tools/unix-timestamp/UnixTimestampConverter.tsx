"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { dateTimeLocalToTimestamp, formatTimestamp, timestampToDate, type TimestampUnit } from "@/lib/unix-timestamp";

type Mode = "timestamp" | "date";

function formatLocalDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "medium" }).format(date);
}

export default function UnixTimestampConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).unixTimestamp;
  const [mode, setMode] = useState<Mode>("timestamp");
  const [timestamp, setTimestamp] = useState("");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [dateTime, setDateTime] = useState("");
  const [result, setResult] = useState<ReturnType<typeof timestampToDate>>(null);
  const [error, setError] = useState(false);

  function convertTimestamp() {
    const next = timestampToDate(Number(timestamp.trim()), unit);
    setResult(next);
    setError(next === null);
  }

  function convertDate() {
    const next = dateTimeLocalToTimestamp(dateTime);
    setResult(next);
    setError(next === null);
  }

  function clear() {
    setTimestamp("");
    setDateTime("");
    setResult(null);
    setError(false);
  }

  const resultText = result
    ? \`\${formatTimestamp(result.timestampSeconds)} \${t.seconds} · \${formatTimestamp(result.timestampMilliseconds)} \${t.milliseconds}\`
    : "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--border)] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={mode === "timestamp" ? "primary" : "secondary"} onClick={() => { setMode("timestamp"); setResult(null); setError(false); }}>
            {t.timestampToDate}
          </Button>
          <Button type="button" variant={mode === "date" ? "primary" : "secondary"} onClick={() => { setMode("date"); setResult(null); setError(false); }}>
            {t.dateToTimestamp}
          </Button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          {mode === "timestamp" ? (
            <>
              <CalculatorField label={t.timestamp} inputId="unix-timestamp-input" value={timestamp}
                onChange={(event) => { setTimestamp(event.target.value); setResult(null); setError(false); }}
                placeholder={t.timestampPlaceholder} type="text" inputMode="decimal" aria-invalid={error} />
              <div className="mt-4">
                <Select label={t.timestampUnit} id="unix-timestamp-unit" value={unit}
                  onChange={(event) => { setUnit(event.target.value as TimestampUnit); setResult(null); setError(false); }}>
                  <option value="seconds">{t.seconds}</option>
                  <option value="milliseconds">{t.milliseconds}</option>
                </Select>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">{t.timestampHint}</p>
              <div className="mt-5"><Button type="button" onClick={convertTimestamp}>{t.convert}</Button></div>
            </>
          ) : (
            <>
              <CalculatorField label={t.dateTime} inputId="unix-date-input" value={dateTime}
                onChange={(event) => { setDateTime(event.target.value); setResult(null); setError(false); }}
                type="datetime-local" aria-invalid={error} />
              <p className="mt-4 text-sm text-[var(--muted)]">{t.dateHint}</p>
              <div className="mt-5"><Button type="button" onClick={convertDate}>{t.convert}</Button></div>
            </>
          )}

          {error && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
          <div className="mt-5"><ClearButton onClear={clear} disabled={!timestamp && !dateTime && !result} label={t.clear} /></div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{result ? t.converted : t.emptyResult}</p>
            </div>
            {result && <CopyButton value={resultText} label={t.copy} />}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm text-[var(--muted)]">{t.localDate}</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{formatLocalDate(result.date, locale === "fr" ? "fr-FR" : "en-US")}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm text-[var(--muted)]">{t.utcDate}</p>
                <p className="mt-1 font-mono text-sm text-[var(--foreground)]">{result.iso}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm text-[var(--muted)]">{t.timestampResult}</p>
                <p className="mt-1 font-mono text-sm text-[var(--foreground)]">{resultText}</p>
              </div>
            </div>
          ) : <div className="mt-4 min-h-[14rem] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">{t.emptyResult}</div>}
        </div>
      </div>
    </section>
  );
}
