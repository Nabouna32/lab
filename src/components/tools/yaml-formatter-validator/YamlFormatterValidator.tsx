"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { formatYaml, type YamlFormatError } from "@/lib/yaml-formatter";

type Indent = 2 | 4;

export default function YamlFormatterValidator() {
  const locale = useLocale();
  const t = getToolMessages(locale).yamlFormatterValidator;
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<Indent>(2);
  const [result, setResult] = useState("");
  const [error, setError] = useState<YamlFormatError | null>(null);

  function process() {
    const next = formatYaml(input, indent);
    if (!next.ok) {
      setResult("");
      setError(next.error);
      return;
    }

    setError(null);
    setResult(next.formatted);
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
  }

  const status = error
    ? error.kind === "resource"
      ? t.resourceLimit
      : t.invalid
    : result
      ? t.formatted
      : t.emptyResult;

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="yaml-formatter-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[22rem] resize-none font-mono text-sm leading-6"
            aria-invalid={error !== null}
          />

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

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error.kind === "resource"
                ? t.resourceLimit
                : t.invalid + " — " + t.errorAt(String(error.line), String(error.column))}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={process}>{t.format}</Button>
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.output}</p>
              <p
                className={
                  error
                    ? "mt-1 text-sm text-[var(--danger)]"
                    : "mt-1 text-sm text-[var(--muted)]"
                }
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
        </div>
      </div>
    </section>
  );
}
