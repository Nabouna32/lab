"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, OutlinedButton } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { writePendingJsonToolTransfer, type JsonToolTransferTarget } from "@/lib/tools/json-transfer";
import { getToolPath } from "@/lib/tools/routes";
import { CSV_JSON_MAX_FILE_BYTES, getCsvJsonDownloadDetails, getCsvJsonOperationForFile, transformCsvJson, type CsvDelimiterSelection, type CsvJsonOperation } from "@/lib/csv-json";

const delimiters: { value: CsvDelimiterSelection; label: string }[] = [
  { value: "auto", label: "" },
  { value: ",", label: "," },
  { value: ";", label: ";" },
  { value: "\t", label: "Tab" },
];

export default function CsvJsonConverter() {
  const locale = useLocale();
  const router = useRouter();
  const t = getToolMessages(locale).csvJson;
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<CsvJsonOperation>("csv-to-json");
  const CsvToJsonButton = operation === "csv-to-json" ? Button : OutlinedButton;
  const JsonToCsvButton = operation === "json-to-csv" ? Button : OutlinedButton;
  const [delimiter, setDelimiter] = useState<CsvDelimiterSelection>("auto");
  const [inferTypes, setInferTypes] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<"invalid-csv" | "invalid-json" | "unsupported-json" | "unsupported-file" | "file-too-large" | "file-read-failed" | null>(null);
  const [transferError, setTransferError] = useState(false);

  const fileError = error === "unsupported-file" || error === "file-too-large" || error === "file-read-failed";

  const output = useMemo(() => {
    if (!input) return { value: "", error: null };
    return transformCsvJson(input, operation, delimiter);
  }, [input, operation, delimiter]);

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const inputElement = event.currentTarget;
    const file = inputElement.files?.[0];
    inputElement.value = "";
    if (!file) return;

    const nextOperation = getCsvJsonOperationForFile(file.name);
    if (!nextOperation) {
      setResult("");
      setError("unsupported-file");
      return;
    }
    if (file.size > CSV_JSON_MAX_FILE_BYTES) {
      setResult("");
      setError("file-too-large");
      return;
    }

    try {
      const content = await file.text();
      setInput(content);
      setOperation(nextOperation);
      if (nextOperation === "csv-to-json") setDelimiter("auto");
      setResult("");
      setError(null);
    } catch {
      setResult("");
      setError("file-read-failed");
    }
  }

  function apply(nextOperation: CsvJsonOperation) {
    const next = transformCsvJson(input, nextOperation, delimiter, inferTypes);
    setOperation(nextOperation);
    setResult(next.value ?? "");
    setError(next.error);
  }

  function sendToTool(target: JsonToolTransferTarget) {
    try {
      if (operation !== "csv-to-json" || !writePendingJsonToolTransfer(window.sessionStorage, result, target)) {
        setTransferError(true);
        return;
      }
      router.push(getToolPath(locale, target));
    } catch {
      setTransferError(true);
    }
  }

  function download() {
    if (!result) return;
    const { fileName, mimeType } = getCsvJsonDownloadDetails(operation);
    const url = URL.createObjectURL(new Blob([result], { type: mimeType }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
              setTransferError(false);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[18rem] resize-y font-mono text-sm leading-6"
            aria-invalid={error !== null && !fileError}
            aria-describedby={error !== null && !fileError ? "csv-json-error" : undefined}
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label htmlFor="csv-json-file" className="text-sm font-medium text-[var(--foreground)]">{t.importFile}</label>
            <input
              id="csv-json-file"
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={importFile}
              aria-invalid={fileError}
              aria-describedby={fileError ? "csv-json-file-hint csv-json-error" : "csv-json-file-hint"}
              className="block min-w-0 max-w-full text-sm text-[var(--muted)] file:mr-3 file:min-h-11 file:rounded-full file:border file:border-[var(--border)] file:bg-[var(--surface-container)] file:px-4 file:font-semibold file:text-[var(--foreground)] hover:file:bg-[var(--surface-container-high)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            />
          </div>
          <p id="csv-json-file-hint" className="mt-1 text-xs text-[var(--muted)]">{t.importFileHint}</p>

          <div className="mt-5 max-w-xs">
            <Select id="csv-json-delimiter" label={t.delimiter} value={delimiter} onChange={(event) => {
              setDelimiter(event.target.value as CsvDelimiterSelection);
              setResult("");
              setError(null);
            }}>
              {delimiters.map((item) => <option key={item.value} value={item.value}>{item.value === "auto" ? t.autoDetectDelimiter : item.label}</option>)}
            </Select>
          </div>

          {operation === "csv-to-json" && (
            <div className="mt-4">
              <label htmlFor="csv-json-infer-types" className="flex items-start gap-3 text-sm font-medium text-[var(--foreground)]">
                <input
                  id="csv-json-infer-types"
                  type="checkbox"
                  checked={inferTypes}
                  onChange={(event) => {
                    setInferTypes(event.target.checked);
                    setResult("");
                    setError(null);
                  }}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                />
                <span>{t.inferTypes}<span className="mt-1 block font-normal text-[var(--muted)]">{t.inferTypesHint}</span></span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <CsvToJsonButton onClick={() => apply("csv-to-json")}>{t.csvToJson}</CsvToJsonButton>
            <JsonToCsvButton onClick={() => apply("json-to-csv")}>{t.jsonToCsv}</JsonToCsvButton>
            <ClearButton onClear={clear} disabled={!input && !result} label={t.clear} />
          </div>

          {error && (
            <p id="csv-json-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error === "invalid-csv" ? t.invalidCsv : error === "invalid-json" ? t.invalidJson : error === "unsupported-json" ? t.unsupportedJson : error === "unsupported-file" ? t.unsupportedFile : error === "file-too-large" ? t.fileTooLarge : t.fileReadFailed}
            </p>
          )}
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{error ? t.error : result ? t.ready : t.emptyResult}</p>
            </div>
            {result && <div className="flex flex-wrap gap-2"><CopyButton value={result} label={t.copy} /><OutlinedButton onClick={download}>{t.download}</OutlinedButton></div>}
          </div>
          <pre aria-live="polite" className="mt-4 min-h-[18rem] flex-1 overflow-auto whitespace-pre-wrap break-words border-y border-[var(--border)] py-4 font-mono text-sm leading-6 text-[var(--foreground)]">{result || " "}</pre>
          {result && !error && operation === "csv-to-json" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <OutlinedButton onClick={() => sendToTool("json-formatter")}>{t.sendToFormatter}</OutlinedButton>
              <OutlinedButton onClick={() => sendToTool("json-diff-checker")}>{t.sendToCompare}</OutlinedButton>
              <OutlinedButton onClick={() => sendToTool("json-to-typescript")}>{t.sendToTypescript}</OutlinedButton>
            </div>
          )}
          {transferError && <p role="alert" className="mt-2 text-sm font-medium text-[var(--danger)]">{t.transferFailed}</p>}
        </div>
      </div>
    </section>
  );
}
