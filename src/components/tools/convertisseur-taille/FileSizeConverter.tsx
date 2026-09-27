"use client";

import { useMemo, useState } from "react";
import { convertFileSize, SIZE_UNITS, type SizeUnit } from "@/lib/convertisseur-taille";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";

const UNIT_SHORT_LABELS: Record<SizeUnit, { fr: string; en: string }> = {
  o: { fr: "o", en: "B" }, ko: { fr: "ko", en: "kB" }, mo: { fr: "Mo", en: "MB" },
  go: { fr: "Go", en: "GB" }, to: { fr: "To", en: "TB" }, kio: { fr: "Kio", en: "KiB" },
  mio: { fr: "Mio", en: "MiB" }, gio: { fr: "Gio", en: "GiB" }, tio: { fr: "Tio", en: "TiB" },
};

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 6 }).format(value);
}

export default function FileSizeConverter() {
  const locale = useLocale(); const t = getToolMessages(locale).fileSize;
  const [value, setValue] = useState(""); const [from, setFrom] = useState<SizeUnit>("mo"); const [to, setTo] = useState<SizeUnit>("go");
  const result = useMemo(() => {
    if (value.trim() === "") return null;
    const numericValue = Number(value.replace(",", "."));
    if (!Number.isFinite(numericValue) || numericValue < 0) return null;
    return convertFileSize(numericValue, from, to);
  }, [value, from, to]);
  const hasInvalidInput = value.trim() !== "" && result === null;
  return (
    <CalculatorShell>
      <CalculatorActions showClear={value !== ""} onClear={() => setValue("")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.value} inputId="file-size-value" type="number" min="0" step="any" value={value} onChange={(event) => setValue(event.target.value)} placeholder={t.placeholder}  aria-invalid={hasInvalidInput}/>
        <label htmlFor="file-size-from" className="block text-sm font-medium text-[var(--foreground)]">{t.from}
          <select id="file-size-from" value={from} onChange={(event) => setFrom(event.target.value as SizeUnit)} className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">{SIZE_UNITS.map((unit) => <option key={unit} value={unit}>{t.units[unit]}</option>)}</select>
        </label>
        <label htmlFor="file-size-to" className="block w-full text-sm font-medium text-[var(--foreground)] sm:col-span-2">{t.to}
          <select id="file-size-to" value={to} onChange={(event) => setTo(event.target.value as SizeUnit)} className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">{SIZE_UNITS.map((unit) => <option key={unit} value={unit}>{t.units[unit]}</option>)}</select>
        </label>
      </div>
      <div className="mt-6"><CalculatorResult label={t.result} value={result === null ? "—" : formatNumber(result, locale) + " " + UNIT_SHORT_LABELS[to][locale]} /></div>
      {hasInvalidInput && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
    </CalculatorShell>
  );
}
