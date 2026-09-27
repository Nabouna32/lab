"use client";

import { useMemo, useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateDownloadTime, DOWNLOAD_SIZE_UNITS, DOWNLOAD_SPEED_UNITS, type DownloadSizeUnit, type DownloadSpeedUnit } from "@/lib/temps-telechargement";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatToolNumber, parseLocalizedNumber } from "@/lib/numbers";
import { Select } from "@/components/ui/Select";
import { getDownloadDurationLabels, getDownloadSizeUnitLabel, getDownloadSpeedUnitLabel } from "@/lib/i18n/units";
import { getDownloadDurationLabels, getDownloadSizeUnitLabel, getDownloadSpeedUnitLabel } from "@/lib/i18n/units";

function formatDuration(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  units: { day: string; hour: string; minute: string; second: string },
): string {
  const parts: string[] = [];
  if (days > 0) parts.push(days + " " + units.day);
  if (hours > 0 || days > 0) parts.push(hours + " " + units.hour);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(minutes + " " + units.minute);
  parts.push(seconds + " " + units.second);
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
    const sizeValue = parseLocalizedNumber(size);
    const speedValue = parseLocalizedNumber(speed);
    if (sizeValue === null || speedValue === null || sizeValue < 0 || speedValue < 0) return null;
    return calculateDownloadTime(sizeValue, sizeUnit, speedValue, speedUnit);
  }, [size, sizeUnit, speed, speedUnit]);
  const hasValues = size !== "" || speed !== "";
  const hasInvalidInput = hasValues && result === null;
  return (
    <CalculatorShell>
      <CalculatorActions showClear={hasValues} onClear={() => { setSize(""); setSpeed(""); }} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <CalculatorField label={t.fileSize} inputId="download-time-size" type="number" min="0" step="any" value={size} onChange={(event) => setSize(event.target.value)} placeholder={t.placeholderSize}  aria-invalid={hasInvalidInput} aria-describedby="download-time-error"/>
          <Select aria-label={t.sizeUnit} value={sizeUnit} onChange={(event) => setSizeUnit(event.target.value as DownloadSizeUnit)} className="mt-2">
            {DOWNLOAD_SIZE_UNITS.map((unit) => <option key={unit} value={unit}>{getDownloadSizeUnitLabel(locale, unit)}</option>)}
          </Select>
        </div>
        <div>
          <CalculatorField label={t.speed} inputId="download-time-speed" type="number" min="0" step="any" value={speed} onChange={(event) => setSpeed(event.target.value)} placeholder={t.placeholderSpeed}  aria-invalid={hasInvalidInput} aria-describedby="download-time-error"/>
          <Select aria-label={t.speedUnit} value={speedUnit} onChange={(event) => setSpeedUnit(event.target.value as DownloadSpeedUnit)} className="mt-2">
            {DOWNLOAD_SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{getDownloadSpeedUnitLabel(locale, unit)}</option>)}
          </Select>
        </div>
      </div>
      {hasInvalidInput && <p id="download-time-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
      {result && <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
        <p className="text-sm leading-6 text-[var(--muted)]">{t.estimated}</p>
        <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">{formatDuration(result.days, result.hours, result.minutes, result.seconds, getDownloadDurationLabels(locale))}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t.seconds(formatToolNumber(result.totalSeconds, locale, 2))}</p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.note}</p>
      </div>}
    </CalculatorShell>
  );
}
