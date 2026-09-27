"use client";

import { useMemo, useState } from "react";
import { ClearButton } from "@/components/ui/ClearButton";
import { Select } from "@/components/ui/Select";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { calculateFileSize, type BitrateUnit, type DurationUnit, type FileSizeUnit } from "@/lib/taille-fichier";
import { formatToolNumber, parseLocalizedNumber } from "@/lib/numbers";
import { getBitrateUnitLabel, getDurationUnitLabel, getFileSizeCalculatorUnitLabel } from "@/lib/i18n/units";


export default function FileSizeCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).fileSizeCalculator;
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("minutes");
  const [bitrate, setBitrate] = useState("");
  const [bitrateUnit, setBitrateUnit] = useState<BitrateUnit>("mbps");
  const [sizeUnit, setSizeUnit] = useState<FileSizeUnit>("mb");

  const result = useMemo(() => {
    const durationValue = parseLocalizedNumber(duration);
    const bitrateValue = parseLocalizedNumber(bitrate);
    if (durationValue === null || bitrateValue === null || durationValue < 0 || bitrateValue < 0) return null;
    return calculateFileSize(durationValue, durationUnit, bitrateValue, bitrateUnit, sizeUnit);
  }, [duration, durationUnit, bitrate, bitrateUnit, sizeUnit]);
  const hasValues = duration.trim() !== "" || bitrate.trim() !== "";
  const hasInvalidInput = hasValues && result === null;

  return (
    <CalculatorShell>
      <div className="flex items-center justify-end">
        <ClearButton
          onClear={() => { setDuration(""); setBitrate(""); }}
          disabled={duration === "" && bitrate === ""}
        />
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.duration} inputId="file-size-duration" min="0" step="any" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder={t.durationPlaceholder}  aria-invalid={hasInvalidInput} aria-describedby="file-size-error"/>
        <Select label={t.durationUnit} id="file-size-duration-unit" value={durationUnit} onChange={(event) => setDurationUnit(event.target.value as DurationUnit)}>
          {Object.entries({ seconds: getDurationUnitLabel(locale, "seconds"), minutes: getDurationUnitLabel(locale, "minutes"), hours: getDurationUnitLabel(locale, "hours") }).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <CalculatorField label={t.bitrate} inputId="file-size-bitrate" min="0" step="any" value={bitrate} onChange={(event) => setBitrate(event.target.value)} placeholder={t.bitratePlaceholder}  aria-invalid={hasInvalidInput} aria-describedby="file-size-error"/>
        <Select label={t.bitrateUnit} id="file-size-bitrate-unit" value={bitrateUnit} onChange={(event) => setBitrateUnit(event.target.value as BitrateUnit)}>
          {Object.entries({ kbps: getBitrateUnitLabel(locale, "kbps"), mbps: getBitrateUnitLabel(locale, "mbps"), gbps: getBitrateUnitLabel(locale, "gbps") }).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select label={t.sizeUnit} id="file-size-output-unit" value={sizeUnit} onChange={(event) => setSizeUnit(event.target.value as FileSizeUnit)} className="sm:col-span-2">
          {Object.entries({ mb: getFileSizeCalculatorUnitLabel(locale, "mb"), gb: getFileSizeCalculatorUnitLabel(locale, "gb") }).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </div>
      {hasInvalidInput && <p id="file-size-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
      <div className="mt-6">
        <CalculatorResult
          label={t.result}
          value={result === null ? "—" : `${formatToolNumber(result, locale, 2)} ${getFileSizeCalculatorUnitLabel(locale, sizeUnit)}`}
          tone="accent"
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{t.note}</p>
    </CalculatorShell>
  );
}
