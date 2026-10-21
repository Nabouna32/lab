"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { writePendingJsonToolTransfer, type JsonToolTransferTarget } from "@/lib/tools/json-transfer";
import { getToolPath } from "@/lib/tools/routes";
import { convertJsonYaml, type JsonYamlConversionError, type JsonYamlDirection } from "@/lib/json-yaml-converter";
import { formatYaml, type YamlFormatError } from "@/lib/yaml-formatter";

type Indent = 2 | 4;
type Operation = "format" | JsonYamlDirection;
type ToolError = YamlFormatError | JsonYamlConversionError;

export default function YamlFormatterValidator() {
  const locale = useLocale();
  const router = useRouter();
  const t = getToolMessages(locale).yamlFormatterValidator;
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<Operation>("format");
  const [indent, setIndent] = useState<Indent>(2);
  const [result, setResult] = useState("");
  const [error, setError] = useState<ToolError | null>(null);
  const [transferError, setTransferError] = useState(false);

  function sendToTool(target: JsonToolTransferTarget) {
    try {
      if (operation !== "yaml-to-json" || !writePendingJsonToolTransfer(window.sessionStorage, result, target)) {
        setTransferError(true);
        return;
      }
      router.push(getToolPath(locale, target));
    } catch {
      setTransferError(true);
    }
  }

  function process() {
    setTransferError(false);
    if (operation === "format") {
      const next = formatYaml(input, indent);
      if (!next.ok) {
        setResult("");
        setError(next.error);
        return;
      }
      setError(null);
      setResult(next.formatted);
      return;
    }

    const next = convertJsonYaml(input, operation, indent);
    if (!next.ok) {
      setResult("");
      setError(next.error);
      return;
    }
    setError(null);
    setResult(next.value);
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
    setTransferError(false);
  }

  const isJsonInput = operation === "json-to-yaml";
  const isJsonOutput = operation === "yaml-to-json";
  const status = error
    ? error.kind === "resource"
      ? t.resourceLimit
      : error.kind === "unsupported"
        ? t.unsupportedValue
        : t.invalid
    : result
      ? operation === "format" ? t.formatted : t.converted
      : t.emptyResult;

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <div className="mb-4">
            <Select
              label={t.operation}
              id="yaml-operation"
              value={operation}
              onChange={(event) => {
                setOperation(event.target.value as Operation);
                setResult("");
                setError(null);
                setTransferError(false);
              }}
            >
              <option value="format">{t.formatYaml}</option>
              <option value="yaml-to-json">{t.yamlToJson}</option>
              <option value="json-to-yaml">{t.jsonToYaml}</option>
            </Select>
          </div>

          <TextArea
            label={isJsonInput ? t.inputJson : t.inputYaml}
            inputId="yaml-formatter-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setResult("");
              setError(null);
              setTransferError(false);
            }}
            placeholder={isJsonInput ? t.jsonPlaceholder : t.placeholder}
            spellCheck={false}
            className="min-h-[22rem] resize-none font-mono text-sm leading-6"
            aria-invalid={error !== null}
            aria-describedby={error ? "yaml-formatter-error" : undefined}
          />

          {operation !== "yaml-to-json" && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Select
                label={t.indentation}
                id="yaml-indent"
                value={String(indent)}
                onChange={(event) => setIndent(Number(event.target.value) as Indent)}
              >
                <option value="2">{t.spaces2}</option>
                <option value="4">{t.spaces4}</option>
              </Select>
            </div>
          )}

          {error && (
            <p id="yaml-formatter-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error.kind === "resource"
                ? t.resourceLimit
                : error.kind === "unsupported"
                  ? t.unsupportedValue
                  : <>{t.invalid} — {t.errorAt(String(error.line), String(error.column))}</>}
              {error.kind !== "resource" && (
                <span className="mt-1 block font-normal">
                  {t.errorDetailLabel} <code>{error.message}</code>
                </span>
              )}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={process}>{operation === "format" ? t.format : t.convert}</Button>
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{isJsonOutput ? t.outputJson : t.outputYaml}</p>
              <p
                className={error ? "mt-1 text-sm text-[var(--danger)]" : "mt-1 text-sm text-[var(--muted)]"}
                aria-live="polite"
              >
                {status}
              </p>
            </div>
            {result && <CopyButton value={result} label={t.copy} />}
          </div>

          <pre
            aria-live="polite"
            className="mt-4 min-h-[22rem] flex-1 overflow-auto border-y border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)] whitespace-pre"
          >
            {result || " "}
          </pre>
          {result && !error && operation === "yaml-to-json" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => sendToTool("json-diff-checker")}>{t.sendToCompare}</Button>
              <Button variant="secondary" onClick={() => sendToTool("json-to-typescript")}>{t.sendToTypescript}</Button>
            </div>
          )}
          {transferError && <p role="alert" className="mt-2 text-sm font-medium text-[var(--danger)]">{t.transferFailed}</p>}

        </div>
      </div>
    </section>
  );
}
