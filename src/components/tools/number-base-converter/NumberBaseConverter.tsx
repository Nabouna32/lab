"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { convertNumber, isValidBase } from "@/lib/number-base-converter";

const DEFAULT_VALUE = "255";
const DEFAULT_FROM = 10;
const DEFAULT_TO = 16;

export default function NumberBaseConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).numberBaseConverter;
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [fromBase, setFromBase] = useState(DEFAULT_FROM);
  const [toBase, setToBase] = useState(DEFAULT_TO);

  const result = useMemo(
    () => value.trim() ? convertNumber(value, fromBase, toBase) : null,
    [value, fromBase, toBase],
  );
  const hasInput = value.trim().length > 0;
  const invalid = hasInput && result === null;
  const canReset = value !== DEFAULT_VALUE || fromBase !== DEFAULT_FROM || toBase !== DEFAULT_TO;

  function swapBases() {
    setFromBase(toBase);
    setToBase(fromBase);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8">
        <div className="space-y-5">
          <TextField
            label={t.input}
            inputId="number-base-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            autoCapitalize="characters"
            aria-invalid={invalid}
            className="font-mono"
          />

          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">{t.fromBase}</span>
              <select
                aria-label={t.fromBase}
                value={fromBase}
                onChange={(event) => setFromBase(Number(event.target.value))}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                <BaseOptions />
              </select>
            </label>

            <button
              type="button"
              onClick={swapBases}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label={t.swap}
              title={t.swap}
            >
              ↔
            </button>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">{t.toBase}</span>
              <select
                aria-label={t.toBase}
                value={toBase}
                onChange={(event) => setToBase(Number(event.target.value))}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                <BaseOptions />
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <ClearButton onClear={() => { setValue(DEFAULT_VALUE); setFromBase(DEFAULT_FROM); setToBase(DEFAULT_TO); }} disabled={!canReset} label={t.reset} />
          </div>

          <p className="text-xs text-[var(--muted)]">{t.hint}</p>

          {invalid && (
            <p role="alert" className="text-sm text-[var(--danger)]">{t.invalid}</p>
          )}
        </div>

        <div className="border-t border-[var(--border)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
          {result !== null ? (
            <div className="mt-3 space-y-3" aria-live="polite">
              <div className="border-t border-[var(--border)] py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{t.baseLabel(toBase)}</p>
                  <CopyButton value={result} label={t.copy} copiedLabel={t.copied} />
                </div>
                <code className="mt-3 block break-all font-mono text-2xl font-semibold text-[var(--foreground)]">{result}</code>
              </div>
            </div>
          ) : (
            <p className="mt-3 border-t border-[var(--border)] py-4 text-sm text-[var(--muted)]">
              {hasInput ? t.invalid : t.emptyResult}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function BaseOptions() {
  return (
    <>
      {Array.from({ length: 35 }, (_, index) => index + 2).map((base) => (
        <option key={base} value={base}>
          {base} — {baseLabel(base)}
        </option>
      ))}
    </>
  );
}

function baseLabel(base: number): string {
  if (!isValidBase(base)) return String(base);
  return "base " + base;
}
