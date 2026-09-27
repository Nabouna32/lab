"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateRuleOfThree, isValidRuleOfThreeInput } from "@/lib/regle-de-trois";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatToolNumber } from "@/lib/numbers";
import { ValidationMessage } from "@/components/ui/ValidationMessage";

export default function RuleOfThreeCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).ruleOfThree;
  const [firstValue, setFirstValue] = useState("");
  const [firstResult, setFirstResult] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const first = Number(firstValue);
  const result = Number(firstResult);
  const second = Number(secondValue);
  const hasValues = firstValue.trim() !== "" && firstResult.trim() !== "" && secondValue.trim() !== "";
  const hasNumericValues = Number.isFinite(first) && Number.isFinite(result) && Number.isFinite(second);
  const valid = hasValues && hasNumericValues && isValidRuleOfThreeInput(first, result, second);
  const calculatedValue = valid ? calculateRuleOfThree(first, result, second) : null;
  const calculationFailed = valid && calculatedValue === null;
  function clearValues() { setFirstValue(""); setFirstResult(""); setSecondValue(""); }

  return (
    <CalculatorShell>
      <CalculatorActions showClear={firstValue !== "" || firstResult !== "" || secondValue !== ""} onClear={clearValues} />
      <div className="mt-2 grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.firstValue} inputId="rule-first-value" value={firstValue} onChange={(event) => setFirstValue(event.target.value)} placeholder={t.placeholders.first}  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="rule-error"/>
        <CalculatorField label={t.correspondingValue} inputId="rule-first-result" value={firstResult} onChange={(event) => setFirstResult(event.target.value)} placeholder={t.placeholders.corresponding}  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="rule-error"/>
        <CalculatorField label={t.secondValue} inputId="rule-second-value" value={secondValue} onChange={(event) => setSecondValue(event.target.value)} placeholder={t.placeholders.second}  aria-invalid={hasValues && (!hasNumericValues || !valid)} aria-describedby="rule-error"/>
        <CalculatorResult label={t.result} tone="accent" value={calculatedValue === null ? null : formatToolNumber(calculatedValue, locale, 4)}
          emptyMessage={t.emptyResult} />
      </div>
      {((hasValues && (!hasNumericValues || !valid)) || calculationFailed) && <ValidationMessage id="rule-error">{t.invalid}</ValidationMessage>}
      {valid && calculatedValue !== null && (
        <details className="group mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-[var(--foreground)]"><span>{t.how}</span><span className="text-lg text-[var(--muted)] transition-transform group-open:rotate-45">+</span></summary>
          <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
            <p className="text-sm leading-6 text-[var(--muted)]">{t.explanation}</p>
            <div className="mt-3 rounded-xl bg-[var(--surface-soft)] p-4">
              <p className="font-mono text-sm leading-6 text-[var(--foreground)]">{formatToolNumber(first, locale, 4)} × {formatToolNumber(calculatedValue, locale, 4)} = {formatToolNumber(second, locale, 4)} × {formatToolNumber(result, locale, 4)}</p>
              <p className="mt-2 font-mono text-sm leading-6 text-[var(--foreground)]">{formatToolNumber(result, locale, 4)} × {formatToolNumber(second, locale, 4)} ÷ {formatToolNumber(first, locale, 4)} = {formatToolNumber(calculatedValue, locale, 4)}</p>
            </div>
          </div>
        </details>
      )}
    </CalculatorShell>
  );
}
