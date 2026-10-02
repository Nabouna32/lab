"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { formatJson, getJsonFormatError, minifyJson } from "@/lib/json-formatter";

type Mode = "formatted" | "minified";
type Indent = "  " | "    " | "\t";

export default function JsonFormatter() {
  const locale = useLocale();
  const t = getToolMessages(locale).jsonFormatter;
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("formatted");
  const [indent, setIndent] = useState<Indent>("  ");
  const [result, setResult] = useState("");
  const [error, setError] = useState<ReturnType<typeof getJsonFormatError> | null>(null);

  const status = useMemo(
    () => error ? t.invalid : result ? (mode === "formatted" ? t.formatted : t.minified) : t.emptyResult,
    [error, mode, result, t],
  );

  function process(nextMode: Mode = mode) {
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

  function clear() {
    setInput("");
    setResult("");
    setError(null);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="json-formatter-input"
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
            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="json-indent">{t.indentation}</label>
            <select
              id="json-indent"
              value={indent}
              onChange={(event) => setIndent(event.target.value as Indent)}
              className="min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <option value="  ">{t.spaces2}</option>
              <option value="    ">{t.spaces4}</option>
              <option value="\t">{t.tab}</option>
            </select>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {t.invalid} — {t.errorAt(String(error.line), String(error.column))}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => process("formatted")}>{t.format}</Button>
            <Button variant="secondary" onClick={() => process("minified")}>{t.minify}</Button>
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
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
            className="mt-4 min-h-[22rem] flex-1 overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)] whitespace-pre"
          >
            {result || " "}
          </pre>
        </div>
      </div>
    </section>
  );
}
