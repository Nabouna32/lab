"use client";

import { useState } from "react";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { Select } from "@/components/ui/Select";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { calculateDateAdjustment, type DateAdjustmentDirection, type DateAdjustmentUnit } from "@/lib/date-calculator";

function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function DateCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).dateCalculator;
  const today = toInputDate(new Date());
  const [startDate, setStartDate] = useState(today);
  const [direction, setDirection] = useState<DateAdjustmentDirection>("add");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState<DateAdjustmentUnit>("days");

  const parsedDate = parseInputDate(startDate);
  const numericAmount = amount === "" ? null : Number(amount);
  const result = parsedDate && numericAmount !== null
    ? calculateDateAdjustment(parsedDate, numericAmount, unit, direction)
    : null;
  const invalid = startDate !== "" && (parsedDate === null || (numericAmount !== null && result === null));
  const hasValues = startDate !== today || direction !== "add" || amount !== "1" || unit !== "days";

  function clearValues() {
    setStartDate(today);
    setDirection("add");
    setAmount("1");
    setUnit("days");
  }

  const modes = [
    { id: "add" as const, label: t.add },
    { id: "subtract" as const, label: t.subtract },
  ];

  const formattedResult = result
    ? new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
        dateStyle: "long",
      }).format(result)
    : null;

  return (
    <CalculatorShell>
      <CalculatorActions showClear={hasValues} onClear={clearValues} />
      <div className="mb-5">
        <SegmentedControl items={modes} value={direction} onChange={setDirection} ariaLabel={t.operation} className="grid-cols-2" />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <CalculatorField
          label={t.startDate}
          inputId="date-calculator-start-date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          aria-invalid={invalid}
          aria-describedby="date-calculator-error"
        />
        <CalculatorField
          label={t.amount}
          inputId="date-calculator-amount"
          type="number"
          min="0"
          step="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-invalid={invalid}
          aria-describedby="date-calculator-error"
        />
        <Select label={t.unit} id="date-calculator-unit" value={unit} onChange={(event) => setUnit(event.target.value as DateAdjustmentUnit)}>
          <option value="days">{t.units.days}</option>
          <option value="weeks">{t.units.weeks}</option>
          <option value="months">{t.units.months}</option>
          <option value="years">{t.units.years}</option>
        </Select>
      </div>
      <div className="mt-6">
        <CalculatorResult label={t.result} tone="accent" value={formattedResult} emptyMessage={t.emptyResult} />
      </div>
      {invalid && <ValidationMessage id="date-calculator-error">{t.invalid}</ValidationMessage>}
      {result && (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm leading-6 text-[var(--muted)]">
            {t.summary(
              new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long" }).format(parsedDate!),
              numericAmount!,
              t.units[unit],
              direction === "add" ? t.add.toLowerCase() : t.subtract.toLowerCase(),
              formattedResult!,
            )}
          </p>
        </div>
      )}
    </CalculatorShell>
  );
}
