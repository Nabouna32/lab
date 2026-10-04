"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { convertTimeZone, formatOffset, getTimeZoneOptions } from "@/lib/timezone-converter";

function getDefaultDateTime(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + "T" + pad(now.getHours()) + ":" + pad(now.getMinutes());
}

function getDefaultTimeZone(timeZones: string[]): string {
  const zone = new Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return timeZones.includes(zone) ? zone : "UTC";
}

export default function TimezoneConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).timezoneConverter;
  const [dateTime, setDateTime] = useState("");
  const [sourceTimeZone, setSourceTimeZone] = useState("UTC");
  const [destinationTimeZone, setDestinationTimeZone] = useState("America/New_York");
  const [result, setResult] = useState<ReturnType<typeof convertTimeZone>>(null);
  const [error, setError] = useState(false);
  const timeZones = useMemo(() => getTimeZoneOptions(), []);
  const localeCode = locale === "fr" ? "fr-FR" : "en-US";

  useEffect(() => {
    setDateTime(getDefaultDateTime());
    setSourceTimeZone(getDefaultTimeZone(timeZones));
  }, [timeZones]);

  function convert() {
    const next = convertTimeZone(dateTime, sourceTimeZone, destinationTimeZone);
    setResult(next);
    setError(next === null);
  }

  function clear() {
    setDateTime(getDefaultDateTime());
    setSourceTimeZone(getDefaultTimeZone(timeZones));
    setDestinationTimeZone("America/New_York");
    setResult(null);
    setError(false);
  }

  const copyValue = result
    ? new Intl.DateTimeFormat(localeCode, { dateStyle: "medium", timeStyle: "short", timeZone: destinationTimeZone }).format(result.instant) + " · " + destinationTimeZone + " · " + formatOffset(result.destinationOffsetMinutes)
    : "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <CalculatorField label={t.dateTime} inputId="timezone-date-time" type="datetime-local" value={dateTime} aria-invalid={error}
            onChange={(event) => { setDateTime(event.target.value); setResult(null); setError(false); }} />

          <div className="mt-4">
            <Select label={t.source} id="timezone-source" value={sourceTimeZone}
              onChange={(event) => { setSourceTimeZone(event.target.value); setResult(null); setError(false); }}>
              {timeZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
            </Select>
          </div>

          <div className="mt-4">
            <Select label={t.destination} id="timezone-destination" value={destinationTimeZone}
              onChange={(event) => { setDestinationTimeZone(event.target.value); setResult(null); setError(false); }}>
              {timeZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
            </Select>
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{t.hint}</p>
          {error && <p role="alert" className="mt-3 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.zonesHint}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={convert}>{t.convert}</Button>
            <ClearButton onClear={clear} disabled={!result} label={t.clear} />
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{result ? t.converted : t.emptyResult}</p>
            </div>
            {result && <CopyButton value={copyValue} label={t.copy} />}
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm text-[var(--muted)]">{t.sourceTime}</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">
                  {new Intl.DateTimeFormat(localeCode, { dateStyle: "medium", timeStyle: "short", timeZone: sourceTimeZone }).format(result.instant)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{sourceTimeZone} · {formatOffset(result.sourceOffsetMinutes)}</p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm text-[var(--muted)]">{t.destinationTime}</p>
                <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  {new Intl.DateTimeFormat(localeCode, { dateStyle: "full", timeStyle: "short", timeZone: destinationTimeZone }).format(result.instant)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{destinationTimeZone} · {formatOffset(result.destinationOffsetMinutes)}</p>
              </div>

              {result.status === "ambiguous" && (
                <p role="status" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">
                  {t.ambiguous}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 flex min-h-[16rem] items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
              {t.emptyResult}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}