"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateRuleOfThree, isValidRuleOfThreeInput } from "@/lib/regle-de-trois";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";

function formatNumber(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 4 }).format(value);
}

export default function RuleOfThreeCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).ruleOfThree;
  const [firstValue, setFirstValue] = useState("");
  const [firstResult, setFirstResult] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const first = Number(firstValue);
  const result = Number(firstResult);
  const second = Number(secondValue);
  const hasValues = firstValue.trim() !== "" && firstResult.trim() !== "" && secondValue.trim() !== "" && Number.isFinite(first) && Number.isFinite(result) && Number.isFinite(second);
  const valid = hasValues && isValidRuleOfThreeInput(first, result, second);
  const calculatedValue = valid ? calculateRuleOfThree(first, result, second) : null;
  const calculationFailed = valid && calculatedValue === null;
  function clearValues() { setFirstValue(""); setFirstResult(""); setSecondValue(""); }

  return (
    <CalculatorShell>
      <CalculatorActions showClear={firstValue !== "" || firstResult !== "" || secondValue !== ""} onClear={clearValues} />
      <div className="mt-2 grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.firstValue} inputId="rule-first-value" value={firstValue} onChange={(event) => setFirstValue(event.target.value)} placeholder={t.placeholders.first} />
        <CalculatorField label={t.correspondingValue} inputId="rule-first-result" value={firstResult} onChange={(event) => setFirstResult(event.target.value)} placeholder={t.placeholders.corresponding} />
        <CalculatorField label={t.secondValue} inputId="rule-second-value" value={secondValue} onChange={(event) => setSecondValue(event.target.value)} placeholder={t.placeholders.second} />
        <CalculatorResult label={t.result} tone="accent" value={calculatedValue === null ? "—" : formatNumber(calculatedValue, locale)} />
      </div>
      {(hasValues && !valid) || calculationFailed && <p className="mt-4 text-sm font-medium text-[var(--foreground)]">{t.invalid}</p>}
      {valid && calculatedValue !== null && (
        <details className="group mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-[var(--foreground)]"><span>{t.how}</span><span className="text-lg text-[var(--muted)] transition-transform group-open:rotate-45">+</span></summary>
          <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
            <p className="text-sm leading-6 text-[var(--muted)]">{t.explanation}</p>
            <div className="mt-3 rounded-xl bg-[var(--surface-soft)] p-4">
              <p className="font-mono text-sm leading-6 text-[var(--foreground)]">{formatNumber(first, locale)} × {formatNumber(calculatedValue, locale)} = {formatNumber(second, locale)} × {formatNumber(result, locale)}</p>
              <p className="mt-2 font-mono text-sm leading-6 text-[var(--foreground)]">{formatNumber(result, locale)} × {formatNumber(second, locale)} ÷ {formatNumber(first, locale)} = {formatNumber(calculatedValue, locale)}</p>
            </div>
          </div>
        </details>
      )}
    </CalculatorShell>
  );
}
