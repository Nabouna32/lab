"use client";

import { useState } from "react";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatToolNumber } from "@/lib/numbers";
import { calculateCompoundInterest, type CompoundingFrequency } from "@/lib/compound-interest";

const frequencies: CompoundingFrequency[] = [1, 2, 4, 12, 365];

export default function CompoundInterestCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).compoundInterest;
  const [principalValue, setPrincipalValue] = useState("");
  const [rateValue, setRateValue] = useState("");
  const [yearsValue, setYearsValue] = useState("");
  const [frequency, setFrequency] = useState<CompoundingFrequency>(12);
  const [contributionValue, setContributionValue] = useState("");

  const ready = principalValue.trim() !== "" && rateValue.trim() !== "" && yearsValue.trim() !== "";
  const principal = Number(principalValue);
  const annualRatePercent = Number(rateValue);
  const years = Number(yearsValue);
  const contributionPerPeriod = contributionValue.trim() === "" ? 0 : Number(contributionValue);
  const result = ready ? calculateCompoundInterest({ principal, annualRatePercent, years, compoundingPerYear: frequency, contributionPerPeriod }) : null;
  const invalid = ready && (result === null);

  function clear() {
    setPrincipalValue(""); setRateValue(""); setYearsValue(""); setContributionValue(""); setFrequency(12);
  }

  const number = (value: number) => formatToolNumber(value, locale, 2);
  const copyValue = result ? number(result.finalBalance) : "";

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <div className="flex justify-end px-5 pt-5 sm:px-7 sm:pt-7">{(principalValue || rateValue || yearsValue || contributionValue) && <ClearButton onClear={clear} />}</div>
      <div className="grid items-start lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorField label={t.principal} inputId="compound-principal" value={principalValue} onChange={(e) => setPrincipalValue(e.target.value)} placeholder={t.principalPlaceholder} type="number" min="0" step="any" aria-invalid={invalid} />
            <CalculatorField label={t.rate} inputId="compound-rate" value={rateValue} onChange={(e) => setRateValue(e.target.value)} placeholder={t.ratePlaceholder} type="number" min="0" step="any" aria-invalid={invalid} />
            <CalculatorField label={t.years} inputId="compound-years" value={yearsValue} onChange={(e) => setYearsValue(e.target.value)} placeholder={t.yearsPlaceholder} type="number" min="0.01" max="1000" step="any" aria-invalid={invalid} />
            <Select label={t.frequency} id="compound-frequency" value={String(frequency)} onChange={(e) => setFrequency(Number(e.target.value) as CompoundingFrequency)}>{frequencies.map((value) => <option key={value} value={value}>{t.frequencies[value]}</option>)}</Select>
            <CalculatorField label={t.contribution} inputId="compound-contribution" value={contributionValue} onChange={(e) => setContributionValue(e.target.value)} placeholder={t.contributionPlaceholder} type="number" min="0" step="any" />
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{t.contributionHint}</p>
          {invalid && <ValidationMessage className="mt-4">{t.invalid}</ValidationMessage>}
        </div>
        <div className="flex flex-col border-t border-[var(--border)] bg-[var(--background)] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>{result && !invalid && <CopyButton value={copyValue} />}</div>
          <div aria-live="polite" className="mt-3 rounded-[1.5rem] border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-5 sm:p-6">
            {invalid ? <ValidationMessage>{t.invalid}</ValidationMessage> : result ? <><p className="text-sm text-[var(--muted)]">{t.finalBalance}</p><p className="mt-1 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{number(result.finalBalance)}</p><dl className="mt-5 grid gap-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{t.interestEarned}</dt><dd className="font-semibold">{number(result.interestEarned)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{t.totalContributions}</dt><dd className="font-semibold">{number(result.totalContributions + principal)}</dd></div></dl></> : <p className="text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p>}
          </div>
          {result && !invalid && <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{t.resultHint}</p>}
        </div>
      </div>
    </section>
  );
}
