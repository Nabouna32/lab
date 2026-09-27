"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateDiscountAmount, calculateDiscountedPrice, isValidDiscountRate, isValidReductionPrice } from "@/lib/reduction";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function ReductionCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).reduction;
  const [priceValue, setPriceValue] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const price = Number(priceValue);
  const discountRate = Number(discountValue);
  const hasValues = priceValue.trim() !== "" && discountValue.trim() !== "";
  const hasNumericValues = Number.isFinite(price) && Number.isFinite(discountRate);
  const valid = hasValues && hasNumericValues && isValidReductionPrice(price) && isValidDiscountRate(discountRate);
  const discountAmount = valid ? calculateDiscountAmount(price, discountRate) : null;
  const discountedPrice = valid ? calculateDiscountedPrice(price, discountRate) : null;
  const calculationFailed = valid && (discountAmount === null || discountedPrice === null);
  function clearValues() { setPriceValue(""); setDiscountValue(""); }

  return (
    <CalculatorShell>
      <CalculatorActions showClear={priceValue !== "" || discountValue !== ""} onClear={clearValues} />
      <div className="mt-2 grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.price} inputId="reduction-price" min="0.01" value={priceValue} onChange={(event) => setPriceValue(event.target.value)} placeholder={t.placeholderPrice} unit="€"  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="reduction-error"/>
        <CalculatorField label={t.discount} inputId="reduction-rate" min="0" max="100" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} placeholder={t.placeholderDiscount} unit="%"  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="reduction-error"/>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <CalculatorResult label={t.discountedPrice} tone="accent" value={discountedPrice === null ? "—" : `${formatNumber(discountedPrice, locale)} €`} />
        <CalculatorResult label={t.saved} value={discountAmount === null ? "—" : `${formatNumber(discountAmount, locale)} €`} />
      </div>
      {(hasValues && (!hasNumericValues || !valid)) || calculationFailed && <p id="reduction-error" role="alert" className="mt-4 text-sm font-medium text-[var(--foreground)]">{t.invalid}</p>}
      {valid && discountedPrice !== null && discountAmount !== null && (
        <details className="group mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-[var(--foreground)]"><span>{t.how}</span><span className="text-lg text-[var(--muted)] transition-transform group-open:rotate-45">+</span></summary>
          <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
            <p className="text-sm leading-6 text-[var(--muted)]">{t.explanation(`${formatNumber(discountAmount, locale)} €`)}</p>
            <div className="mt-3 rounded-xl bg-[var(--surface-soft)] p-4">
              <p className="font-mono text-sm leading-6 text-[var(--foreground)]">{formatNumber(price, locale)} × {formatNumber(discountRate, locale)} ÷ 100 = {formatNumber(discountAmount, locale)} €</p>
              <p className="mt-2 font-mono text-sm leading-6 text-[var(--foreground)]">{formatNumber(price, locale)} − {formatNumber(discountAmount, locale)} = {formatNumber(discountedPrice, locale)} €</p>
            </div>
          </div>
        </details>
      )}
    </CalculatorShell>
  );
}
