"use client";

import { useState } from "react";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { calculateDifference, calculateEvolution, calculatePercentage } from "@/lib/percentage";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { formatToolNumber } from "@/lib/numbers";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { ValidationMessage } from "@/components/ui/ValidationMessage";

type Mode = "percentage" | "evolution" | "difference";

export default function PercentageCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).percentage;
  const [mode, setMode] = useState<Mode>("percentage");
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");

  const first = Number(firstValue);
  const second = Number(secondValue);
  const hasValues = firstValue.trim() !== "" && secondValue.trim() !== "";
  const hasNumericValues = Number.isFinite(first) && Number.isFinite(second);

  let result: number | null = null;
  let error: string | null = null;

  if (hasValues && hasNumericValues) {
    if (mode === "percentage") result = calculatePercentage(first, second);
    if (mode === "percentage" && result === null) error = t.invalid;
    if (mode === "evolution") {
      result = calculateEvolution(first, second);
      if (result === null) error = second === 0 ? t.evolutionZero : t.invalid;
    }
    if (mode === "difference") {
      result = calculateDifference(first, second);
      if (result === null) error = first === 0 && second === 0 ? t.differenceZero : t.invalid;
    }
  }

  if (hasValues && !hasNumericValues) error = t.invalid;

  const modes = [
    { id: "percentage" as const, ...t.modes.percentage },
    { id: "evolution" as const, ...t.modes.evolution },
    { id: "difference" as const, ...t.modes.difference },
  ];

  const firstLabel = t.firstLabels[mode];
  const secondLabel = t.secondLabels[mode];
  const firstPlaceholder = t.firstPlaceholders[mode];
  const secondPlaceholder = t.secondPlaceholders[mode];

  function clearValues() {
    setFirstValue("");
    setSecondValue("");
  }

  function getResultExplanation() {
    if (result === null || error) return null;

    const firstText = formatToolNumber(first, locale, 2);
    const secondText = formatToolNumber(second, locale, 2);
    const resultText = formatToolNumber(Math.abs(result), locale, 2);

    if (mode === "percentage") return t.percentageExplanation(firstText, secondText, resultText);
    if (mode === "evolution") {
      if (result > 0) return t.increaseExplanation(secondText, firstText, resultText);
      if (result < 0) return t.decreaseExplanation(secondText, firstText, resultText);
      return t.unchangedExplanation;
    }
    return t.differenceExplanation(firstText, secondText, resultText);
  }

  function getFormula() {
    if (!hasValues || error || result === null) return null;

    if (mode === "percentage") {
      return (
        <>
          {formatToolNumber(second, locale, 2)} × {formatToolNumber(first, locale, 2)} ÷ 100 ={" "}
          <strong>{formatToolNumber(result, locale, 2)}</strong>
        </>
      );
    }

    if (mode === "evolution") {
      return (
        <>
          ({formatToolNumber(first, locale, 2)} − {formatToolNumber(second, locale, 2)}) ÷{" "}
          {formatToolNumber(second, locale, 2)} × 100 ={" "}
          <strong>{formatToolNumber(result, locale, 2)} %</strong>
        </>
      );
    }

    const difference = Math.abs(first - second);
    const average = (Math.abs(first) + Math.abs(second)) / 2;
    return (
      <>
        {formatToolNumber(difference, locale, 2)} ÷ {formatToolNumber(average, locale, 2)} × 100 ={" "}
        <strong>{formatToolNumber(result, locale, 2)} %</strong>
      </>
    );
  }

  const resultText =
    error
      ? error
      : result === null
        ? t.waitingResult
        : `${formatToolNumber(result, locale, 2)}${mode !== "percentage" ? " %" : ""}`;

  const resultTone =
    error
      ? "danger"
      : mode === "evolution" && result !== null
        ? result > 0
          ? "success"
          : result < 0
            ? "danger"
            : "neutral"
        : result !== null
          ? "accent"
          : "neutral";

  const resultToneClasses = {
    danger: {
      panel: "border-[var(--danger)]/25 bg-[var(--danger-soft)]",
      value: "text-[var(--danger)]",
    },
    success: {
      panel: "border-[var(--success)]/25 bg-[var(--success-soft)]",
      value: "text-[var(--success)]",
    },
    accent: {
      panel: "border-[var(--accent)]/25 bg-[var(--accent-soft)]",
      value: "text-[var(--foreground)]",
    },
    neutral: {
      panel: "border-[var(--border)] bg-[var(--surface)]",
      value: "text-[var(--foreground)]",
    },
  } as const;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <div className="flex justify-end px-5 pt-5 sm:px-7 sm:pt-7">
        {(firstValue !== "" || secondValue !== "") && <ClearButton onClear={clearValues} />}
      </div>

      <div className="grid items-start lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="hidden sm:block">
            <SegmentedControl
              items={modes.map((item) => ({ id: item.id, label: item.title, description: item.description }))}
              value={mode}
              onChange={(nextMode) => {
                setMode(nextMode);
                clearValues();
              }}
              ariaLabel={t.type}
              className="grid-cols-3"
            />
          </div>

          <div className="sm:hidden">
            <Select
              id="percentage-mode"
              label={t.type}
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as Mode);
                clearValues();
              }}
            >
              {modes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} — {item.description}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <CalculatorField
              label={firstLabel}
              inputId="first-value"
              value={firstValue}
              onChange={(event) => setFirstValue(event.target.value)}
              placeholder={firstPlaceholder}
              aria-describedby={"percentage-input-help" + (error ? " percentage-input-error" : "")}
             aria-invalid={error !== null}/>
            <CalculatorField
              label={secondLabel}
              inputId="second-value"
              value={secondValue}
              onChange={(event) => setSecondValue(event.target.value)}
              placeholder={secondPlaceholder}
              aria-describedby={"percentage-input-help" + (error ? " percentage-input-error" : "")}
             aria-invalid={error !== null}/>
          </div>

          <p id="percentage-input-help" className="mt-3 text-xs leading-5 text-[var(--muted)]">
            {t.inputHint}
          </p>
        </div>

        <div className="flex flex-col border-t border-[var(--border)] bg-[var(--background)] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
            {result !== null && !error && (
              <CopyButton value={resultText} />
            )}
          </div>

          <div
            aria-live="polite"
            className={[
              "mt-3 flex min-h-36 flex-col justify-center rounded-[1.5rem] border p-5 transition-all sm:p-6",
              resultToneClasses[resultTone].panel,
            ].join(" ")}
          >
            {result === null && !error && (
              <p className="text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p>
            )}
            {error && <ValidationMessage id="percentage-input-error">{error}</ValidationMessage>}
            {result !== null && !error && (
              <>
                <p className={"text-4xl font-black tracking-[-0.04em] sm:text-5xl " + resultToneClasses[resultTone].value}>{resultText}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{getResultExplanation()}</p>
              </>
            )}
          </div>

          {result !== null && !error && (
            <details className="group mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold">
                <span>{t.how}</span>
                <span className="text-lg text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
                <p className="text-sm leading-6 text-[var(--muted)]">{t.formulaIntroWithValues}</p>
                <div className="mt-3 rounded-xl bg-[var(--surface-soft)] p-4">
                  <p className="font-mono text-sm leading-6 text-[var(--foreground)]">{getFormula()}</p>
                </div>
              </div>
            </details>
          )}

          {mode === "difference" && result !== null && !error && (
            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{t.differenceNote}</p>
          )}
        </div>
      </div>
    </section>
  );
}
