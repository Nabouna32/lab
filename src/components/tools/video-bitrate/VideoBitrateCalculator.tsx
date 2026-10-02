"use client";

import { useState } from "react";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { formatToolNumber, parseLocalizedNumber } from "@/lib/numbers";
import { getBitrateUnitLabel } from "@/lib/i18n/units";
import type { BitrateUnit } from "@/lib/taille-fichier";
import { calculateVideoBitrateMbps, calculateVideoSizeBytes, formatDurationSeconds } from "@/lib/video-bitrate";

type Mode = "bitrate" | "size";
type SizeUnit = "MB" | "GB";

const SIZE_MULTIPLIERS: Record<SizeUnit, number> = { MB: 1_000_000, GB: 1_000_000_000 };

export default function VideoBitrateCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).videoBitrate;
  const [mode, setMode] = useState<Mode>("bitrate");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [size, setSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>("GB");
  const [bitrate, setBitrate] = useState("");
  const [bitrateUnit, setBitrateUnit] = useState<BitrateUnit>("mbps");

  const duration = formatDurationSeconds(
    parseLocalizedNumber(hours) ?? 0,
    parseLocalizedNumber(minutes) ?? 0,
    parseLocalizedNumber(seconds) ?? 0,
  );
  const value = mode === "bitrate" ? parseLocalizedNumber(size) : parseLocalizedNumber(bitrate);
  const bitrateToMbps: Record<BitrateUnit, number> = { kbps: 0.001, mbps: 1, gbps: 1000 };

  let result: number | null = null;
  let error: string | null = null;

  const hasDurationInput = [hours, minutes, seconds].some((part) => part.trim() !== "");
  const hasValueInput = value !== null;

  if (hasDurationInput && duration === null) error = t.invalidDuration;
  if (mode === "bitrate" && hasValueInput && value !== null && value < 0) error = t.invalidSize;
  if (mode === "size" && hasValueInput && value !== null && value < 0) error = t.invalidBitrate;

  if (!error && duration !== null && value !== null) {
    result = mode === "bitrate"
      ? calculateVideoBitrateMbps(duration, value * SIZE_MULTIPLIERS[sizeUnit])
      : calculateVideoSizeBytes(duration, value * bitrateToMbps[bitrateUnit]);
    if (result === null) error = t.invalid;
  }

  function clear() {
    setHours("");
    setMinutes("");
    setSeconds("");
    setSize("");
    setBitrate("");
  }

  const resultText =
    result === null || error
      ? ""
      : mode === "bitrate"
        ? `${formatToolNumber(result / bitrateToMbps[bitrateUnit], locale, 3)} ${getBitrateUnitLabel(locale, bitrateUnit)}`
        : `${formatToolNumber(result / 1_000_000, locale, 2)} MB · ${formatToolNumber(result / 1_000_000_000, locale, 3)} GB`;

  const modes = [
    { id: "bitrate" as const, label: t.modes.bitrate.title, description: t.modes.bitrate.description },
    { id: "size" as const, label: t.modes.size.title, description: t.modes.size.description },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <div className="flex justify-end px-5 pt-5 sm:px-7 sm:pt-7">
        {(hasDurationInput || size !== "" || bitrate !== "") && <ClearButton onClear={clear} />}
      </div>

      <div className="grid items-start lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="hidden sm:block">
            <SegmentedControl
              items={modes}
              value={mode}
              onChange={(next) => { setMode(next); clear(); }}
              ariaLabel={t.mode}
              className="grid-cols-2"
            />
          </div>
          <div className="sm:hidden">
            <Select
              id="video-bitrate-mode"
              label={t.mode}
              value={mode}
              onChange={(event) => { setMode(event.target.value as Mode); clear(); }}
            >
              {modes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </Select>
          </div>

          <fieldset className="mt-7">
            <legend className="text-sm font-semibold text-[var(--foreground)]">{t.duration}</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <CalculatorField label={t.hours} inputId="video-hours" min={0} step="1" inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} placeholder={t.hoursPlaceholder} aria-invalid={error === t.invalidDuration} />
              <CalculatorField label={t.minutes} inputId="video-minutes" min={0} max={59} step="1" inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder={t.minutesPlaceholder} aria-invalid={error === t.invalidDuration} />
              <CalculatorField label={t.seconds} inputId="video-seconds" min={0} max={59} step="1" inputMode="numeric" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder={t.secondsPlaceholder} aria-invalid={error === t.invalidDuration} />
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
            {mode === "bitrate" ? (
              <>
                <CalculatorField label={t.targetSize} inputId="video-size" min={0} step="any" value={size} onChange={(e) => setSize(e.target.value)} placeholder={t.sizePlaceholder} aria-invalid={Boolean(error)} />
                <Select id="video-size-unit" label={t.sizeUnit} value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}>
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </Select>
              </>
            ) : (
              <CalculatorField label={t.bitrate} inputId="video-bitrate" min={0} step="any" value={bitrate} onChange={(e) => setBitrate(e.target.value)} placeholder={t.bitratePlaceholder} aria-invalid={Boolean(error)} />
            )}
          </div>

          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{t.inputHint}</p>
          {error && <ValidationMessage id="video-bitrate-error">{error}</ValidationMessage>}
        </div>

        <div className="flex flex-col border-t border-[var(--border)] bg-[var(--background)] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
            {result !== null && !error && <CopyButton value={resultText} label={t.copy} copiedLabel={t.copied} />}
          </div>
          <div aria-live="polite" className="mt-3 flex min-h-36 flex-col justify-center rounded-[1.5rem] border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-5 sm:p-6">
            {error && <p className="text-sm leading-6 text-[var(--danger)]">{error}</p>}
            {!error && result === null && <p className="text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p>}
            {!error && result !== null && (
              <>
                <p className="text-4xl font-black tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">{resultText}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{mode === "bitrate" ? t.bitrateResultNote : t.sizeResultNote}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
