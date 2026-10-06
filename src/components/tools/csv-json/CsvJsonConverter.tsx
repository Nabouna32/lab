"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { transformCsvJson, type CsvDelimiter, type CsvJsonOperation } from "@/lib/csv-json";

const delimiters: { value: CsvDelimiter; label: string }[] = [
  { value: ",", label: "," },
  { value: ";", label: ";" },
  { value: "\t", label: "Tab" },
];

export default function CsvJsonConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).csvJson;
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<CsvJsonOperation>("csv-to-json");
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(",");
  const [result, setResult] = useState("");
  const [error, setError] = useState<"invalid-csv" | "invalid-json" | "unsupported-json" | null>(null);


  function apply(nextOperation: CsvJsonOperation) {
    const nextOutput = input ? transformCsvJson(input, nextOperation, delimiter) : { value: "", error: null };
    setOperation(nextOperation);
    setResult(nextOutput.value ?? "");
    setError(nextOutput.error);
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
  }

  const hasResult = Boolean(result);

  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="h-px bg-[var(--accent)]" aria-hidden="true" />
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">{t.input}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{t.delimiter}</p>
            </div>
            <span className="font-mono text-xs text-[var(--muted)]" aria-hidden="true">{operation === "csv-to-json" ? "CSV / JSON" : "JSON / CSV"}</span>
          </div>
          <div className="pt-4">
            <TextArea label={t.input} inputId="csv-json-input" value={input} onChange={(event) => { setInput(event.target.value); setResult(""); setError(null); }} placeholder={t.placeholder} spellCheck={false} className="min-h-[18rem] resize-y border-0 bg-[var(--surface-soft)] font-mono text-sm leading-6 shadow-none" aria-invalid={error !== null} aria-describedby={error ? "csv-json-error" : undefined} />
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-[var(--border)] pt-4">
            <div>
              <label htmlFor="csv-json-delimiter" className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{t.delimiter}</label>
              <select id="csv-json-delimiter" value={delimiter} onChange={(event) => { setDelimiter(event.target.value as CsvDelimiter); setResult(""); setError(null); }} className="mt-2 block min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]">
                {delimiters.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => apply("csv-to-json")} variant={operation === "csv-to-json" ? "primary" : "secondary"}>{t.csvToJson}</Button>
              <Button onClick={() => apply("json-to-csv")} variant={operation === "json-to-csv" ? "primary" : "secondary"}>{t.jsonToCsv}</Button>
              <ClearButton onClear={clear} disabled={!input && !result} label={t.clear} />
            </div>
          </div>
          {error && <p id="csv-json-error" role="alert" className="mt-4 border-l-2 border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger)]">{error === "invalid-csv" ? t.invalidCsv : error === "invalid-json" ? t.invalidJson : t.unsupportedJson}</p>}
        </div>
        <div className="flex min-h-full flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{error ? t.error : hasResult ? t.ready : t.emptyResult}</p>
            </div>
            {result && <CopyButton value={result} label={t.copy} />}
          </div>
          <div className="relative mt-4 min-h-[18rem] flex-1 overflow-hidden bg-[var(--surface)]">
            {hasResult ? <pre className="h-full max-h-[32rem] overflow-auto p-4 font-mono text-sm leading-6 text-[var(--foreground)]">{result}</pre> : <div className="flex min-h-[18rem] items-center justify-center border border-dashed border-[var(--border-strong)] p-6 text-center"><p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
