"use client";

import { useMemo, useState } from "react";
import { convertFileSize, SIZE_UNITS, type SizeUnit } from "@/lib/convertisseur-taille";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatToolNumber, parseLocalizedNumber } from "@/lib/numbers";
import { Select } from "@/components/ui/Select";
import { getFileSizeUnitLabel } from "@/lib/i18n/units";
import { getFileSizeUnitLabel } from "@/lib/i18n/units";


export default function FileSizeConverter() {
  const locale = useLocale(); const t = getToolMessages(locale).fileSize;
  const [value, setValue] = useState(""); const [from, setFrom] = useState<SizeUnit>("mo"); const [to, setTo] = useState<SizeUnit>("go");
  const result = useMemo(() => {
    if (value.trim() === "") return null;
    const numericValue = parseLocalizedNumber(value);
    if (numericValue === null || numericValue < 0) return null;
    return convertFileSize(numericValue, from, to);
  }, [value, from, to]);
  const hasInvalidInput = value.trim() !== "" && result === null;
  return (
    <CalculatorShell>
      <CalculatorActions showClear={value !== ""} onClear={() => setValue("")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.value} inputId="file-size-value" type="number" min="0" step="any" value={value} onChange={(event) => setValue(event.target.value)} placeholder={t.placeholder}  aria-invalid={hasInvalidInput} aria-describedby="file-size-converter-error"/>
        <Select label={t.from} id="file-size-from" value={from} onChange={(event) => setFrom(event.target.value as SizeUnit)}>
          {SIZE_UNITS.map((unit) => <option key={unit} value={unit}>{getFileSizeUnitLabel(locale, unit, "long")}</option>)}
        </Select>
        <Select label={t.to} id="file-size-to" value={to} onChange={(event) => setTo(event.target.value as SizeUnit)} className="sm:col-span-2">
          {SIZE_UNITS.map((unit) => <option key={unit} value={unit}>{getFileSizeUnitLabel(locale, unit, "long")}</option>)}
        </Select>
      </div>
      <div className="mt-6"><CalculatorResult label={t.result} value={result === null ? "—" : formatToolNumber(result, locale, 6) + " " + getFileSizeUnitLabel(locale, to)} /></div>
      {hasInvalidInput && <p id="file-size-converter-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
    </CalculatorShell>
  );
}
