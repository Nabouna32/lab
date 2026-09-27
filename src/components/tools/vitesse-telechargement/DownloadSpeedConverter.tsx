"use client";

import { useMemo, useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { convertSpeed, SPEED_UNITS, type SpeedUnit } from "@/lib/vitesse-telechargement";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatToolNumber, parseLocalizedNumber } from "@/lib/numbers";
import { Select } from "@/components/ui/Select";

export default function DownloadSpeedConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).downloadSpeed;
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<SpeedUnit>("mbps");
  const [to, setTo] = useState<SpeedUnit>("mo-s");
  const result = useMemo(() => {
    if (value.trim() === "") return null;
    const numericValue = parseLocalizedNumber(value);
    if (numericValue === null || numericValue < 0) return null;
    return convertSpeed(numericValue, from, to);
  }, [value, from, to]);
  const hasInvalidInput = value.trim() !== "" && result === null;
  return (
    <CalculatorShell>
      <CalculatorActions showClear={value !== ""} onClear={() => setValue("")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.value} inputId="download-speed-value" type="number" min="0" step="any" value={value} onChange={(event) => setValue(event.target.value)} placeholder={t.placeholder}  aria-invalid={hasInvalidInput} aria-describedby="download-speed-error"/>
        <Select label={t.from} id="download-speed-from" value={from} onChange={(event) => setFrom(event.target.value as SpeedUnit)}>
            {SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{t.units[unit]}</option>)}
          </Select>
        <Select label={t.to} id="download-speed-to" value={to} onChange={(event) => setTo(event.target.value as SpeedUnit)} className="sm:col-span-2">
            {SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{t.units[unit]}</option>)}
          </Select>
      </div>
      <div className="mt-6"><CalculatorResult label={t.result} value={result === null ? "—" : `${formatToolNumber(result, locale, 6)} ${t.shortUnits[to]}`} /></div>
      {hasInvalidInput && <p id="download-speed-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
    </CalculatorShell>
  );
}
