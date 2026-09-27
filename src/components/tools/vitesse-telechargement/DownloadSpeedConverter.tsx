"use client";

import { useMemo, useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { convertSpeed, SPEED_UNITS, type SpeedUnit } from "@/lib/vitesse-telechargement";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";

const UNIT_SHORT_LABELS: Record<SpeedUnit, string> = { mbps: "Mbps", gbps: "Gbps", "ko-s": "kB/s", "mo-s": "MB/s", "go-s": "GB/s" };

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 6 }).format(value);
}

export default function DownloadSpeedConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).downloadSpeed;
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<SpeedUnit>("mbps");
  const [to, setTo] = useState<SpeedUnit>("mo-s");
  const result = useMemo(() => {
    if (value.trim() === "") return null;
    const numericValue = Number(value.replace(",", "."));
    if (!Number.isFinite(numericValue) || numericValue < 0) return null;
    return convertSpeed(numericValue, from, to);
  }, [value, from, to]);
  const hasInvalidInput = value.trim() !== "" && result === null;
  return (
    <CalculatorShell>
      <CalculatorActions showClear={value !== ""} onClear={() => setValue("")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.value} inputId="download-speed-value" type="number" min="0" step="any" value={value} onChange={(event) => setValue(event.target.value)} placeholder={t.placeholder}  aria-invalid={hasInvalidInput} aria-describedby="download-speed-error"/>
        <label htmlFor="download-speed-from" className="block text-sm font-medium text-[var(--foreground)]">{t.from}
          <select id="download-speed-from" value={from} onChange={(event) => setFrom(event.target.value as SpeedUnit)} className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
            {SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{t.units[unit]}</option>)}
          </select>
        </label>
        <label htmlFor="download-speed-to" className="block text-sm font-medium text-[var(--foreground)] sm:col-span-2">{t.to}
          <select id="download-speed-to" value={to} onChange={(event) => setTo(event.target.value as SpeedUnit)} className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
            {SPEED_UNITS.map((unit) => <option key={unit} value={unit}>{t.units[unit]}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-6"><CalculatorResult label={t.result} value={result === null ? "—" : `${formatNumber(result, locale)} ${UNIT_SHORT_LABELS[to]}`} /></div>
      {hasInvalidInput && <p id="download-speed-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
    </CalculatorShell>
  );
}
