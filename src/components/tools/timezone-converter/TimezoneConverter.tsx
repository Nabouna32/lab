"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { convertTimeZones, formatOffset, getTimeZoneOptions, isNonexistentLocalTime } from "@/lib/timezone-converter";

const DEFAULT_DESTINATIONS = ["America/New_York", "Europe/Paris", "Asia/Tokyo"];
const MAX_DESTINATIONS = 6;

type ConvertedZone = NonNullable<ReturnType<typeof convertTimeZones>>[number];

export default function TimezoneConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).timezoneConverter;
  const [dateTime, setDateTime] = useState("");
  const [sourceTimeZone, setSourceTimeZone] = useState("UTC");
  const [destinationTimeZones, setDestinationTimeZones] = useState<string[]>(DEFAULT_DESTINATIONS);
  const [zoneToAdd, setZoneToAdd] = useState("Australia/Sydney");
  const [results, setResults] = useState<ConvertedZone[] | null>(null);
  const [error, setError] = useState(false);
  const [nonexistentTime, setNonexistentTime] = useState(false);
  const timeZones = useMemo(() => getTimeZoneOptions(), []);
  const availableTimeZones = useMemo(
    () => timeZones.filter((zone) => !destinationTimeZones.includes(zone)),
    [timeZones, destinationTimeZones],
  );
  const selectedZoneToAdd = availableTimeZones.includes(zoneToAdd)
    ? zoneToAdd
    : (availableTimeZones[0] ?? "");
  const localeCode = locale === "fr" ? "fr-FR" : "en-US";
  const firstResult = results?.[0];

  function clearResult() {
    setResults(null);
    setError(false);
    setNonexistentTime(false);
  }

  function convert() {
    const next = convertTimeZones(dateTime, sourceTimeZone, destinationTimeZones);
    setResults(next);
    setError(next === null);
    setNonexistentTime(next === null && isNonexistentLocalTime(dateTime, sourceTimeZone));
  }

  function addDestination() {
    if (!selectedZoneToAdd || destinationTimeZones.length >= MAX_DESTINATIONS) return;
    setDestinationTimeZones((current) => [...current, selectedZoneToAdd]);
    setZoneToAdd("");
    clearResult();
  }

  function removeDestination(zone: string) {
    if (destinationTimeZones.length <= 1) return;
    setDestinationTimeZones((current) => current.filter((candidate) => candidate !== zone));
    clearResult();
  }

  function clear() {
    setDateTime("");
    setSourceTimeZone("UTC");
    setDestinationTimeZones(DEFAULT_DESTINATIONS);
    setZoneToAdd("Australia/Sydney");
    clearResult();
  }

  const copyValue = firstResult
    ? [
        `${t.sourceTime}: ${new Intl.DateTimeFormat(localeCode, { dateStyle: "medium", timeStyle: "short", timeZone: sourceTimeZone }).format(firstResult.conversion.instant)} · ${sourceTimeZone} · ${formatOffset(firstResult.conversion.sourceOffsetMinutes)}`,
        ...results!.map(({ timeZone, conversion }) =>
          `${timeZone}: ${new Intl.DateTimeFormat(localeCode, { dateStyle: "medium", timeStyle: "short", timeZone }).format(conversion.instant)} · ${formatOffset(conversion.destinationOffsetMinutes)}`,
        ),
      ].join("\n")
    : "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <CalculatorField label={t.dateTime} inputId="timezone-date-time" type="datetime-local" value={dateTime} aria-invalid={error}
            onChange={(event) => { setDateTime(event.target.value); clearResult(); }} />

          <div className="mt-4">
            <Select label={t.source} id="timezone-source" value={sourceTimeZone}
              onChange={(event) => { setSourceTimeZone(event.target.value); clearResult(); }}>
              {timeZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
            </Select>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">{t.destinations}</p>
            <div className="space-y-2">
              {destinationTimeZones.map((zone) => (
                <div key={zone} className="flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 py-2">
                  <span className="min-w-0 break-all text-sm font-medium text-[var(--foreground)]">{zone}</span>
                  <Button type="button" variant="text" aria-label={t.removeDestination + " " + zone} disabled={destinationTimeZones.length <= 1} onClick={() => removeDestination(zone)} className="min-h-9 shrink-0 px-2">
                    {t.removeDestination}
                  </Button>
                </div>
              ))}
            </div>
            {destinationTimeZones.length < MAX_DESTINATIONS && availableTimeZones.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <Select label={t.destination} id="timezone-add-destination" value={selectedZoneToAdd}
                    onChange={(event) => setZoneToAdd(event.target.value)}>
                    {availableTimeZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
                  </Select>
                </div>
                <Button type="button" variant="secondary" onClick={addDestination} className="min-h-11 shrink-0">
                  {t.addDestination}
                </Button>
              </div>
            )}
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.maxDestinations}</p>
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{t.hint}</p>
          {error && <p role="alert" className="mt-3 text-sm font-medium text-[var(--danger)]">{nonexistentTime ? t.nonexistent : t.invalid}</p>}
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.zonesHint}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={convert}>{t.convert}</Button>
            <ClearButton onClear={clear} disabled={!results && !dateTime} label={t.clear} />
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{results ? t.converted : t.emptyResult}</p>
            </div>
            {results && <CopyButton value={copyValue} label={t.copyAll} />}
          </div>

          {results ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-sm text-[var(--muted)]">{t.sourceTime}</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">
                  {new Intl.DateTimeFormat(localeCode, { dateStyle: "full", timeStyle: "short", timeZone: sourceTimeZone }).format(firstResult!.conversion.instant)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{sourceTimeZone} · {formatOffset(firstResult!.conversion.sourceOffsetMinutes)}</p>
              </div>

              {results.map(({ timeZone, conversion }) => (
                <article key={timeZone} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--muted)]">{timeZone}</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                    {new Intl.DateTimeFormat(localeCode, { dateStyle: "full", timeStyle: "short", timeZone }).format(conversion.instant)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{t.destinationTime} · {formatOffset(conversion.destinationOffsetMinutes)}</p>
                </article>
              ))}

              {firstResult!.conversion.status === "ambiguous" && (
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
