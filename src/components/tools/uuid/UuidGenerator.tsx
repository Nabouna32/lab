"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextField } from "@/components/ui/TextField";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { generateUuids } from "@/lib/uuid";

export default function UuidGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).uuidGenerator;
  const [count, setCount] = useState("5");
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState(false);

  function generate() {
    const parsed = Number(count);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) { setResult([]); setError(true); return; }
    try { setResult(generateUuids(parsed)); setError(false); } catch { setResult([]); setError(true); }
  }
  function clear() { setResult([]); setError(false); }
  const output = result.join("\n");
  const hasResult = result.length > 0;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" aria-hidden="true" />
      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">UUID</p>
              <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-[var(--foreground)]">{t.count}</h2>
            </div>

            <div className="mt-7">
              <TextField
                label={t.count}
                inputId="uuid-count"
                type="number"
                min={1}
                max={50}
                step={1}
                value={count}
                onChange={(event) => { setCount(event.target.value); setError(false); }}
                placeholder={t.countPlaceholder}
                aria-invalid={error}
                aria-describedby={error ? "uuid-count-error" : undefined}
              />
              {error && <p id="uuid-count-error" role="alert" className="mt-3 text-sm font-medium leading-5 text-[var(--danger)]">{t.invalidCount}</p>}
            </div>

            <div className="mt-6 grid gap-2 sm:flex lg:grid">
              <Button type="button" variant="primary" className="w-full sm:w-auto lg:w-full" onClick={generate}>{t.generate}</Button>
              <ClearButton onClear={clear} disabled={!hasResult} label={t.clear} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 p-5 sm:p-7 lg:p-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">{t.result}</p>
              <p className="mt-1 text-sm leading-5 text-[var(--muted)]" aria-live="polite">
                {!hasResult ? {t.emptyResult} : result.length === 1 ? {t.generatedOne} : {t.generatedMany(result.length)}
              </p>
            </div>
            {hasResult && <CopyButton value={output} label={t.copy} />}
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">UUID</span>
              <span className="text-xs text-[var(--muted)]">{result.length || "—"}</span>
            </div>
            <pre aria-live="polite" className="min-h-56 max-h-[34rem] overflow-auto p-4 font-mono text-sm leading-7 text-[var(--foreground)] sm:p-5">{output || " "}</pre>
          </div>

          {!hasResult && (
            <div className="mt-5 border-l-2 border-[var(--accent)] pl-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">{t.emptyResult}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{t.countPlaceholder}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
