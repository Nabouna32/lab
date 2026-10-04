"use client";

import { useMemo, useState } from "react";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextInput } from "@/components/ui/TextInput";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { getNextCronRuns, parseCronExpression } from "@/lib/tools/cron-expression";

const DEFAULT_EXPRESSION = "0 9 * * 1-5";

function getDescription(
  expression: string,
  descriptions: ReturnType<typeof getToolMessages>["cronExpression"]["descriptions"],
): string {
  if (expression === "* * * * *") return descriptions.everyMinute;
  if (expression === "0 * * * *") return descriptions.everyHour;
  if (expression === "0 0 * * *") return descriptions.midnight;
  if (expression === "0 9 * * 1-5") return descriptions.weekdayMorning;
  return descriptions.custom(expression);
}

export default function CronExpression() {
  const locale = useLocale();
  const t = getToolMessages(locale).cronExpression;
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION);

  const result = useMemo(() => {
    if (!expression.trim()) return null;
    try {
      const schedule = parseCronExpression(expression);
      return { schedule, runs: getNextCronRuns(schedule), error: null };
    } catch {
      return { schedule: null, runs: [], error: t.invalid };
    }
  }, [expression, t.invalid]);

  const reset = () => setExpression(DEFAULT_EXPRESSION);

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <TextInput
              label={t.input}
              inputId="cron-expression"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              placeholder={t.placeholder}
              spellCheck={false}
              autoComplete="off"
              className="font-mono"
            />
          </div>
          <div className="flex gap-2">
            <CopyButton value={expression} label={t.copy} />
            <ClearButton onClear={() => setExpression("")} disabled={!expression} label={t.clear} />
          </div>
        </div>

        <p className="mt-3 text-sm text-[var(--muted)]">{t.expressionHint}</p>

        {result ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">{t.result}</h2>
                <span className={result.schedule ? "rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]" : "rounded-full bg-[var(--danger-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--danger)]"} role="status">
                  {result.schedule ? t.valid : t.invalid}
                </span>
              </div>

              {result.schedule ? (
                <>
                  <p className="mt-4 text-base font-medium text-[var(--foreground)]">{getDescription(result.schedule.expression, t.descriptions)}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {(["minute", "hour", "dayOfMonth", "month", "dayOfWeek"] as const).map((fieldName) => {
                      const field = result.schedule.fields[fieldName];
                      return (
                        <div key={fieldName} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-3">
                          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{t.fields[fieldName]}</p>
                          <p className="mt-1 break-words font-mono text-sm text-[var(--foreground)]">{field.expression}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-[var(--danger)]" role="alert">{result.error}</p>
              )}
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">{t.nextRuns}</h2>
              {result.schedule ? (
                <ol className="mt-3 space-y-2">
                  {result.runs.map((date) => (
                    <li key={date.toISOString()} className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]">
                      <time dateTime={date.toISOString()}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date)}</time>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-[var(--muted)]">{t.emptyResult}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-6 rounded-[var(--radius-md)] bg-[var(--background)] p-4 text-sm text-[var(--muted)]">{t.emptyResult}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["* * * * *", t.examples.everyMinute],
            ["0 9 * * 1-5", t.examples.everyWeekday],
            ["0 0 * * *", t.examples.midnight],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setExpression(value)}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--muted)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span>{value}</span>
              <span className="ml-2 font-sans">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {t.reset}
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {result?.schedule ? t.valid : result?.error ?? t.emptyResult}
        </p>
      </div>
    </section>
  );
}
