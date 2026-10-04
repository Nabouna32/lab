"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { formatXml, validateXml, type XmlIndent } from "@/lib/xml-formatter";

export default function XMLFormatterValidator() {
  const locale = useLocale();
  const t = getToolMessages(locale).xmlFormatterValidator;
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<XmlIndent>("  ");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const status = useMemo(() => {
    if (error) return t.invalid;
    if (result) return t.formatted;
    return t.emptyResult;
  }, [error, result, t]);

  function format() {
    if (!input.trim()) {
      setResult("");
      setError(t.emptyResult);
      setValidated(false);
      return;
    }

    const validation = validateXml(input);
    if (!validation.ok) {
      setResult("");
      setError(validation.message);
      setValidated(false);
      return;
    }

    const next = formatXml(input, indent);
    if (!next.ok) {
      setResult("");
      setError(next.message);
      setValidated(false);
      return;
    }

    setResult(next.value);
    setError(null);
    setValidated(true);
  }

  function validate() {
    if (!input.trim()) {
      setResult("");
      setError(t.emptyResult);
      setValidated(false);
      return;
    }

    const validation = validateXml(input);
    if (!validation.ok) {
      setResult("");
      setError(validation.message);
      setValidated(false);
      return;
    }

    setResult("");
    setError(null);
    setValidated(true);
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
    setValidated(false);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="xml-formatter-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
              setValidated(false);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[22rem] resize-none font-mono text-sm leading-6"
            aria-invalid={error !== null}
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Select label={t.indentation} id="xml-indent" value={indent} onChange={(event) => setIndent(event.target.value as XmlIndent)}>
              <option value="  ">{t.spaces2}</option>
              <option value="    ">{t.spaces4}</option>
              <option value="\t">{t.tab}</option>
            </Select>
          </div>

          {error && error !== t.emptyResult && (
            <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {t.invalid} — {error}
            </p>
          )}

          {validated && !error && (
            <p role="status" className="mt-4 text-sm font-medium text-[var(--success)]">
              {t.valid}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={format}>{t.format}</Button>
            <Button variant="secondary" onClick={validate}>{t.validate}</Button>
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
            className="mt-4 min-h-[22rem] flex-1 overflow-auto border-y border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)] whitespace-pre"
          >
            {result || " "}
          </pre>
        </div>
      </div>
    </section>
  );
}
