"use client";

import { useMemo, useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateDownloadTime, DOWNLOAD_SIZE_UNITS, DOWNLOAD_SPEED_UNITS, type DownloadSizeUnit, type DownloadSpeedUnit } from "@/lib/temps-telechargement";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";

const SIZE_LABELS: Record<DownloadSizeUnit, string> = { ko: "kB", mo: "MB", go: "GB", to: "TB" };
const SPEED_LABELS: Record<DownloadSpeedUnit, string> = { kbps: "kb/s", mbps: "Mb/s", gbps: "Gb/s", "ko-s": "kB/s", "mo-s": "MB/s", "go-s": "GB/s" };

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 2 }).format(value);
}

function formatDuration(days: number, hours: number, minutes: number, seconds: number): string {
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (hours > 0 || days > 0) parts.push(`${hours} h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes} min`);
  parts.push(`${seconds} s`);
  return parts.join(" ");
}

export default function DownloadTimeCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).downloadTime;
  const [size, setSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState<DownloadSizeUnit>("go");
  const [speed, setSpeed] = useState("");
  const [speedUnit, setSpeedUnit] = useState<DownloadSpeedUnit>("mbps");
  const result = useMemo(() => {
    if (size.trim() === "" || speed.trim() === "") return null;
    return calculateDownloadTime(Number(size.replace(",", ".")), sizeUnit, Number(speed.replace(",", ".")), speedUnit);
  }, [size, sizeUnit, speed, speedUnit]);
  const hasValues = size !== "" || speed !== "";
  return (
    <CalculatorShell>
      <CalculatorActions showClear={hasValues} onClear={() => { setSize(""); setSpeed(""); }} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <CalculatorField label={t.fileSize} inputId="download-time-size" type="number" min="0" step="any" value={size} onChange={(event) => setSize(event.target.value)} placeholder={t.placeholderSize} />
          <select aria-label={t.sizeUnit} value={sizeUnit} onChange={(event) => setSizeUnit(event.target.value as DownloadSizeUnit)} className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
            {DOWNLOAD_SIZE_UNITS.map((unit) => <option key={unit} value={unit}>{SIZE_LABELS[unit]}</option>)}
          </select>
        </div>
        <div>
          <CalculatorField label={t.speed} inputId="download-time-speed" type="number" min="0" step="any" value={speed} onChange={(event) => setSpeed(event.target.value)} placeholder={t.placeholderSpeed} />
          <select aria-label={t.speedUnit} value={speedUnit} onChange={(event) => setSpeedUnit(event.target.value as DownloadSpeedUnit)} className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
            {DOWNLOAD_SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{SPEED_LABELS[unit]}</option>)}
          </select>
        </div>
      </div>
      {result && <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
        <p className="text-sm leading-6 text-[var(--muted)]">{t.estimated}</p>
        <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">{formatDuration(result.days, result.hours, result.minutes, result.seconds)}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t.seconds(formatNumber(result.totalSeconds, locale))}</p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.note}</p>
      </div>}
    </CalculatorShell>
  );
}
