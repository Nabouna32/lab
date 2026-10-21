"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { formatJson, getJsonFormatError, minifyJson } from "@/lib/json-formatter";
import { extractJsonPath, JsonPathError } from "@/lib/json-path";
import { consumePendingJsonToolTransfer, writePendingJsonToolTransfer, type JsonToolTransferTarget } from "@/lib/tools/json-transfer";
import { getToolPath } from "@/lib/tools/routes";

type Mode = "formatted" | "minified";
type Indent = "  " | "    " | "\t";

export default function JsonFormatter() {
  const locale = useLocale();
  const router = useRouter();
  const t = getToolMessages(locale).jsonFormatter;
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("formatted");
  const [indent, setIndent] = useState<Indent>("  ");
  const [result, setResult] = useState("");
  const [error, setError] = useState<ReturnType<typeof getJsonFormatError> | null>(null);
  const [transferError, setTransferError] = useState(false);
  const [receivedFromTool, setReceivedFromTool] = useState(false);

  useEffect(() => {
    try {
      const transferred = consumePendingJsonToolTransfer(window.sessionStorage, "json-formatter");
      if (transferred !== null) {
        queueMicrotask(() => {
          setInput(transferred);
          setReceivedFromTool(true);
        });
      }
    } catch {
      // Storage may be unavailable; the formatter remains usable with manual input.
    }
  }, []);
  const [jsonPath, setJsonPath] = useState("$");
  const [extractedValue, setExtractedValue] = useState("");
  const [extractionError, setExtractionError] = useState<"invalid-json" | "resource" | "invalid-path" | "not-found" | null>(null);

  const status = useMemo(
    () => error
      ? error.kind === "resource" ? t.resourceLimit : t.invalid
      : result ? (mode === "formatted" ? t.formatted : t.minified) : t.emptyResult,
    [error, mode, result, t],
  );

  function process(nextMode: Mode = mode) {
    setTransferError(false);
    if (!input.trim()) {
      setResult("");
      setError({ index: 0, line: 1, column: 1 });
      return;
    }

    const nextError = getJsonFormatError(input);
    if (nextError.index >= 0) {
      setResult("");
      setError(nextError);
      return;
    }

    setError(null);
    setMode(nextMode);
    setResult(nextMode === "formatted" ? formatJson(input, { indent }) : minifyJson(input));
  }

  function extractValue() {
    setExtractedValue("");
    setExtractionError(null);
    if (!input.trim()) {
      setExtractionError("invalid-json");
      return;
    }
    const validation = getJsonFormatError(input);
    if (validation.index >= 0) {
      setExtractionError(validation.kind === "resource" ? "resource" : "invalid-json");
      return;
    }
    try {
      const value = extractJsonPath(input, jsonPath);
      setExtractedValue(JSON.stringify(value, null, indent) ?? "undefined");
    } catch (caught) {
      setExtractionError(caught instanceof JsonPathError ? caught.code : "invalid-json");
    }
  }

  function sendToTool(target: JsonToolTransferTarget) {
    try {
      if (!writePendingJsonToolTransfer(window.sessionStorage, result, target)) {
        setTransferError(true);
        return;
      }
      router.push(getToolPath(locale, target));
    } catch {
      setTransferError(true);
    }
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
    setTransferError(false);
    setReceivedFromTool(false);
    setExtractedValue("");
    setExtractionError(null);
    setJsonPath("$");
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="json-formatter-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setReceivedFromTool(false);
              setResult("");
              setError(null);
              setTransferError(false);
              setExtractedValue("");
              setExtractionError(null);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[22rem] resize-none font-mono text-sm leading-6"
            aria-invalid={error !== null}
          />

          {receivedFromTool && <p role="status" className="mb-3 rounded-lg bg-[var(--surface-container)] px-3 py-2 text-sm text-[var(--muted)]">{t.receivedFromTool}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Select label={t.indentation} id="json-indent" value={indent} onChange={(event) => setIndent(event.target.value as Indent)}>
              <option value="  ">{t.spaces2}</option>
              <option value="    ">{t.spaces4}</option>
              <option value="\t">{t.tab}</option>
            </Select>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error.kind === "resource"
                ? t.resourceLimit
                : <>{t.invalid} — {t.errorAt(String(error.line), String(error.column))}</>}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => process("formatted")}>{t.format}</Button>
            <Button variant="secondary" onClick={() => process("minified")}>{t.minify}</Button>
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
          </div>
          <div className="mt-7 border-t border-[var(--border)] pt-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">{t.extractTitle}</h3>
            <label htmlFor="json-path-input" className="mt-3 block text-sm font-medium text-[var(--foreground)]">{t.pathLabel}</label>
            <input
              id="json-path-input"
              value={jsonPath}
              onChange={(event) => { setJsonPath(event.target.value); setExtractionError(null); setExtractedValue(""); }}
              placeholder={t.pathPlaceholder}
              spellCheck={false}
              className="mt-2 min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-describedby="json-path-hint"
              aria-invalid={extractionError === "invalid-path"}
            />
            <p id="json-path-hint" className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.pathHint}</p>
            <div className="mt-3">
              <Button variant="secondary" onClick={extractValue}>{t.extractButton}</Button>
            </div>
            {extractionError && (
              <p role="alert" className="mt-3 text-sm font-medium text-[var(--danger)]">
                {extractionError === "resource" ? t.resourceLimit
                  : extractionError === "invalid-path" ? t.pathSyntaxError
                    : extractionError === "not-found" ? t.pathNotFound : t.extractionInvalidJson}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.output}</p>
              <p className={error ? "mt-1 text-sm text-[var(--danger)]" : "mt-1 text-sm text-[var(--muted)]"} aria-live="polite">{status}</p>
            </div>
            {result && <CopyButton value={result} label={t.copy} />}
          </div>

          <pre
            aria-live="polite"
            className="mt-4 min-h-[22rem] flex-1 overflow-auto border-y border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)] whitespace-pre"
          >
            {result || " "}
          </pre>
          {result && !error && (
            <div className="mt-4">
              <Button variant="secondary" onClick={() => sendToTool("json-diff-checker")}>{t.sendToCompare}</Button>
              <Button variant="secondary" onClick={() => sendToTool("json-to-typescript")}>{t.sendToTypescript}</Button>
              {transferError && <p className="mt-2 text-sm font-medium text-[var(--danger)]" role="alert">{t.transferFailed}</p>}
            </div>
          )}
          {extractedValue && !extractionError && (
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">{t.extractedResult}</p>
                <CopyButton value={extractedValue} label={t.copy} />
              </div>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)]">{extractedValue}</pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
