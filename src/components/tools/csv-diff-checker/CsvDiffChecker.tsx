"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { compareCsvDocuments, CsvDiffError, getCsvDiffHeaders, type CsvDiffDelimiter, type CsvDiffResult } from "@/lib/csv-diff";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";

export default function CsvDiffChecker() {
  const locale = useLocale();
  const t = getToolMessages(locale).csvDiffChecker;
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [delimiter, setDelimiter] = useState<CsvDiffDelimiter>("auto");
  const [keyColumn, setKeyColumn] = useState("");
  const [result, setResult] = useState<CsvDiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headers = useMemo(() => {
    const before = getCsvDiffHeaders(beforeText, delimiter);
    const after = getCsvDiffHeaders(afterText, delimiter);
    return before.filter((header) => after.includes(header));
  }, [beforeText, afterText, delimiter]);

  const messages: Record<string, string> = {
    empty: t.errorEmpty, "too-large": t.errorTooLarge, invalid: t.errorInvalid,
    headers: t.errorHeaders, "duplicate-key": t.errorDuplicateKey,
    "missing-key": t.errorMissingKey, "too-many-rows": t.errorTooManyRows,
  };

  function compare() {
    try {
      setResult(compareCsvDocuments(beforeText, afterText, keyColumn, delimiter));
      setError(null);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof CsvDiffError ? messages[caught.code] : t.errorInvalid);
    }
  }

  function clear() {
    setBeforeText(""); setAfterText(""); setKeyColumn(""); setResult(null); setError(null);
  }

  const report = result?.changes.map((change) => {
    const lines = [`[${change.kind.toUpperCase()}] ${change.key}`];
    for (const field of change.fields) {
      const oldValue = change.before?.[field];
      const newValue = change.after?.[field];
      if (oldValue !== undefined) lines.push(`- ${field}: ${oldValue}`);
      if (newValue !== undefined) lines.push(`+ ${field}: ${newValue}`);
    }
    return lines.join("\n");
  }).join("\n\n") ?? "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <TextArea label={t.before} inputId="csv-diff-before" value={beforeText} onChange={(event) => { setBeforeText(event.target.value); setResult(null); setError(null); }} placeholder={t.beforePlaceholder} spellCheck={false} className="min-h-[15rem] resize-y font-mono text-sm" />
        </div>
        <div className="p-4 sm:p-6 lg:p-7">
          <TextArea label={t.after} inputId="csv-diff-after" value={afterText} onChange={(event) => { setAfterText(event.target.value); setResult(null); setError(null); }} placeholder={t.afterPlaceholder} spellCheck={false} className="min-h-[15rem] resize-y font-mono text-sm" />
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-4 border-t border-[var(--border)] p-4 sm:p-6">
        <label className="grid min-w-44 gap-1 text-sm font-semibold text-[var(--foreground)]">
          {t.delimiter}
          <select value={delimiter} onChange={(event) => { setDelimiter(event.target.value as CsvDiffDelimiter); setResult(null); }} className="min-h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            <option value="auto">{t.delimiterAuto}</option><option value=",">{t.delimiterComma}</option><option value=";">{t.delimiterSemicolon}</option><option value="\t">{t.delimiterTab}</option>
          </select>
        </label>
        <label className="grid min-w-44 flex-1 gap-1 text-sm font-semibold text-[var(--foreground)]">
          {t.keyColumn}
          <select value={keyColumn} onChange={(event) => { setKeyColumn(event.target.value); setResult(null); }} className="min-h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            <option value="">{t.byRow}</option>{headers.map((header) => <option key={header} value={header}>{header}</option>)}
          </select>
        </label>
        <Button type="button" onClick={compare}>{t.compare}</Button>
        <ClearButton onClear={clear} disabled={!beforeText && !afterText} label={t.clear} />
      </div>
      <div className="border-t border-[var(--border)] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">{t.result}</h3>
            <p aria-live="polite" className="mt-1 text-sm text-[var(--muted)]">{error ?? (result ? result.identical ? t.identical : t.summary(result.added, result.removed, result.changed) : t.emptyResult)}</p>
          </div>
          <CopyButton value={report} label={t.copy} />
        </div>
        {result && !result.identical && (
          <div className="mt-4 grid gap-3">
            {result.changes.map((change, index) => (
              <article key={change.kind + change.key + index} className={"rounded-[var(--radius-md)] border border-[var(--border)] border-l-4 p-4 " + (change.kind === "added" ? "border-l-[var(--success)]" : change.kind === "removed" ? "border-l-[var(--danger)]" : "border-l-[var(--primary)]")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm break-all">{keyColumn ? keyColumn + "=" + change.key : t.row + " " + change.key}</span>
                  <span className="rounded-full bg-[var(--surface-container)] px-2 py-1 text-xs font-semibold">{change.kind === "added" ? t.added : change.kind === "removed" ? t.removed : t.changed}</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {change.fields.map((field) => (
                    <div key={field} className="grid gap-2 sm:grid-cols-[minmax(7rem,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]">
                      <span className="text-xs font-semibold text-[var(--muted)]">{field}</span>
                      <span className="break-words rounded bg-[var(--surface-container-low)] p-2 text-sm">{change.before?.[field] ?? "—"}</span>
                      <span className="break-words rounded bg-[var(--surface-container-low)] p-2 text-sm">{change.after?.[field] ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
