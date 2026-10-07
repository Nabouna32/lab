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

  return (
    <section className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <TextField label={t.count} inputId="uuid-count" type="number" min={1} max={50} step={1} value={count}
          onChange={(event) => { setCount(event.target.value); setError(false); }} placeholder={t.countPlaceholder}
          aria-invalid={error} aria-describedby={error ? "uuid-count-error" : undefined} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="primary" onClick={generate}>{t.generate}</Button>
          <ClearButton onClear={clear} disabled={result.length === 0} label={t.clear} />
        </div>
      </div>
      {error && <p id="uuid-count-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalidCount}</p>}
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{result.length === 0 ? t.emptyResult : result.length === 1 ? t.generatedOne : t.generatedMany(result.length)}</p>
          </div>
          {result.length > 0 && <CopyButton value={output} label={t.copy} />}
        </div>
        <pre aria-live="polite" className="mt-4 min-h-40 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-7 text-[var(--foreground)]">{output || " "}</pre>
      </div>
    </section>
  );
}
