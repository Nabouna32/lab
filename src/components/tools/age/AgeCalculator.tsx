"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { calculateAge } from "@/lib/age";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatPlural } from "@/lib/i18n/plural";

function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AgeCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).age;
  const today = toInputDate(new Date());
  const [birthDate, setBirthDate] = useState("");
  const [referenceDate, setReferenceDate] = useState(today);

  const birth = birthDate ? new Date(`${birthDate}T12:00:00`) : null;
  const reference = referenceDate ? new Date(`${referenceDate}T12:00:00`) : null;
  const age = birth && reference ? calculateAge(birth, reference) : null;
  const hasBirthDate = birthDate !== "";
  const invalidRange = hasBirthDate && referenceDate !== "" && age === null;

  function clearValues() {
    setBirthDate("");
    setReferenceDate(toInputDate(new Date()));
  }

  const years = age === null ? "—" : String(age.years);
  const months = age === null ? "—" : String(age.months);
  const days = age === null ? "—" : String(age.days);

  return (
    <CalculatorShell>
      <CalculatorActions showClear={hasBirthDate || referenceDate !== today} onClear={clearValues} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CalculatorField label={t.birthDate} inputId="age-birth-date" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)}  aria-invalid={invalidRange} aria-describedby="age-error"/>
        <CalculatorField label={t.referenceDate} inputId="age-reference-date" type="date" value={referenceDate} onChange={(event) => setReferenceDate(event.target.value)}  aria-invalid={invalidRange} aria-describedby="age-error"/>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <CalculatorResult label={t.years} tone="accent" value={years} />
        <CalculatorResult label={t.months} value={months} />
        <CalculatorResult label={t.days} value={days} />
      </div>
      {invalidRange && <p id="age-error" role="alert" className="mt-4 text-sm font-medium text-[var(--foreground)]">{t.invalidRange}</p>}
      {age && (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm leading-6 text-[var(--muted)]">
            {t.summary(
              formatPlural(locale, age.years, { one: t.yearSingular, other: t.yearPlural }),
              formatPlural(locale, age.months, { one: t.monthSingular, other: t.monthPlural }),
              formatPlural(locale, age.days, { one: t.daySingular, other: t.dayPlural }),
            )}
          </p>
        </div>
      )}
    </CalculatorShell>
  );
}
