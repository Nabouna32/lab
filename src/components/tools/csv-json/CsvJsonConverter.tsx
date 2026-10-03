"use client";

import { useMemo, useState } from "react";
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

  const output = useMemo(() => {
    if (!input) return { value: "", error: null };
    return transformCsvJson(input, operation, delimiter);
  }, [input, operation, delimiter]);

  function apply(nextOperation: CsvJsonOperation) {
    setOperation(nextOperation);
    setResult(output.value ?? "");
    setError(output.error);
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <TextArea
            label={t.input}
            inputId="csv-json-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setResult("");
              setError(null);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[18rem] resize-y font-mono text-sm leading-6"
            aria-invalid={error !== null}
            aria-describedby={error ? "csv-json-error" : undefined}
          />

          <div className="mt-5">
            <label htmlFor="csv-json-delimiter" className="text-sm font-semibold text-[var(--foreground)]">{t.delimiter}</label>
            <select
              id="csv-json-delimiter"
              value={delimiter}
              onChange={(event) => {
                setDelimiter(event.target.value as CsvDelimiter);
                setResult("");
                setError(null);
              }}
              className="mt-2 block min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
            >
              {delimiters.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => apply("csv-to-json")} variant={operation === "csv-to-json" ? "primary" : "secondary"}>{t.csvToJson}</Button>
            <Button onClick={() => apply("json-to-csv")} variant={operation === "json-to-csv" ? "primary" : "secondary"}>{t.jsonToCsv}</Button>
            <ClearButton onClear={clear} disabled={!input && !result} label={t.clear} />
          </div>

          {error && (
            <p id="csv-json-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error === "invalid-csv" ? t.invalidCsv : error === "invalid-json" ? t.invalidJson : t.unsupportedJson}
            </p>
          )}
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{error ? t.error : result ? t.ready : t.emptyResult}</p>
            </div>
            {result && <CopyButton value={result} label={t.copy} />}
          </div>
          <pre aria-live="polite" className="mt-4 min-h-[18rem] flex-1 overflow-auto whitespace-pre-wrap break-words border-y border-[var(--border)] py-4 font-mono text-sm leading-6 text-[var(--foreground)]">{result || " "}</pre>
        </div>
      </div>
    </section>
  );
}
