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

function parseNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function FileSizeCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).fileSizeCalculator;
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("minutes");
  const [bitrate, setBitrate] = useState("");
  const [bitrateUnit, setBitrateUnit] = useState<BitrateUnit>("mbps");
  const [sizeUnit, setSizeUnit] = useState<FileSizeUnit>("mb");

  const result = useMemo(() => {
    const durationValue = parseNumber(duration);
    const bitrateValue = parseNumber(bitrate);
    if (durationValue === null || bitrateValue === null) return null;
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
        <CalculatorField label={t.duration} inputId="file-size-duration" min="0" step="any" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder={t.durationPlaceholder}  aria-invalid={hasInvalidInput}/>
        <Select label={t.durationUnit} id="file-size-duration-unit" value={durationUnit} onChange={(event) => setDurationUnit(event.target.value as DurationUnit)}>
          {Object.entries(t.durationUnits).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <CalculatorField label={t.bitrate} inputId="file-size-bitrate" min="0" step="any" value={bitrate} onChange={(event) => setBitrate(event.target.value)} placeholder={t.bitratePlaceholder}  aria-invalid={hasInvalidInput}/>
        <Select label={t.bitrateUnit} id="file-size-bitrate-unit" value={bitrateUnit} onChange={(event) => setBitrateUnit(event.target.value as BitrateUnit)}>
          {Object.entries(t.bitrateUnits).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select label={t.sizeUnit} id="file-size-output-unit" value={sizeUnit} onChange={(event) => setSizeUnit(event.target.value as FileSizeUnit)} className="sm:col-span-2">
          {Object.entries(t.sizeUnits).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </div>
      {hasInvalidInput && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
      <div className="mt-6">
        <CalculatorResult
          label={t.result}
          value={result === null ? "—" : `${formatNumber(result, locale)} ${sizeUnit === "mb" ? (locale === "fr" ? "Mo" : "MB") : (locale === "fr" ? "Go" : "GB")}`}
          tone="accent"
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{t.note}</p>
    </CalculatorShell>
  );
}
