"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateHt, calculateTtc, calculateVatAmount, isValidVatRate } from "@/lib/tva";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Mode = "ht-to-ttc" | "ttc-to-ht";

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function TVACalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).vat;
  const [mode, setMode] = useState<Mode>("ht-to-ttc");
  const [priceValue, setPriceValue] = useState("");
  const [rateValue, setRateValue] = useState("20");
  const price = Number(priceValue);
  const rate = Number(rateValue);
  const hasValues = priceValue.trim() !== "" && rateValue.trim() !== "";
  const hasNumericValues = Number.isFinite(price) && Number.isFinite(rate);
  const valid = hasValues && hasNumericValues && price >= 0 && isValidVatRate(rate);
  const ht = valid ? (mode === "ht-to-ttc" ? price : calculateHt(price, rate)) : null;
  const ttc = valid ? (mode === "ht-to-ttc" ? calculateTtc(price, rate) : price) : null;
  const vat = valid && ht !== null ? calculateVatAmount(ht, rate) : null;
  const calculationFailed = valid && (ht === null || ttc === null || vat === null);
  const modes = [
    { id: "ht-to-ttc" as const, label: t.htToTtc },
    { id: "ttc-to-ht" as const, label: t.ttcToHt },
  ];

  function clearValues() { setPriceValue(""); setRateValue("20"); }

  return (
    <CalculatorShell>
      <div className="flex items-center justify-between gap-4">
        <SegmentedControl items={modes} value={mode} onChange={setMode} ariaLabel={`${t.htToTtc} / ${t.ttcToHt}`} className="inline-grid grid-cols-2" />
        <CalculatorActions showClear={priceValue !== "" || rateValue !== "20"} onClear={clearValues} />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <CalculatorField label={mode === "ht-to-ttc" ? t.priceHt : t.priceTtc} inputId="tva-price" min="0" value={priceValue} onChange={(event) => setPriceValue(event.target.value)} placeholder={mode === "ht-to-ttc" ? t.placeholders.ht : t.placeholders.ttc} unit="€"  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="tva-error"/>
        <CalculatorField label={t.rate} inputId="tva-rate" min="0" max="100" value={rateValue} onChange={(event) => setRateValue(event.target.value)} placeholder={t.placeholders.rate} unit="%"  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="tva-error"/>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <CalculatorResult label={t.resultHt} tone="accent" value={ht === null ? "—" : `${formatNumber(ht, locale)} €`} />
        <CalculatorResult label={t.vat} value={vat === null ? "—" : `${formatNumber(vat, locale)} €`} />
        <CalculatorResult label={t.resultTtc} value={ttc === null ? "—" : `${formatNumber(ttc, locale)} €`} />
      </div>
      {(hasValues && (!hasNumericValues || !valid)) || calculationFailed && <p id="tva-error" role="alert" className="mt-4 text-sm font-medium text-[var(--foreground)]">{t.invalid}</p>}
      {valid && ht !== null && ttc !== null && vat !== null && (
        <details className="group mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-[var(--foreground)]"><span>{t.how}</span><span className="text-lg text-[var(--muted)] transition-transform group-open:rotate-45">+</span></summary>
          <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
            <p className="text-sm leading-6 text-[var(--muted)]">{t.explanation(formatNumber(rate, locale), formatNumber(vat, locale))}</p>
            <div className="mt-3 rounded-xl bg-[var(--surface-soft)] p-4"><p className="font-mono text-sm leading-6 text-[var(--foreground)]">{mode === "ht-to-ttc" ? `${formatNumber(ht, locale)} × (1 + ${formatNumber(rate, locale)} ÷ 100) = ${formatNumber(ttc, locale)} €` : `${formatNumber(ttc, locale)} ÷ (1 + ${formatNumber(rate, locale)} ÷ 100) = ${formatNumber(ht, locale)} €`}</p></div>
          </div>
        </details>
      )}
    </CalculatorShell>
  );
}
