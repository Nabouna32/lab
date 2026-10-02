"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { transformBase64, type Base64Operation } from "@/lib/base64";

export default function Base64Encoder() {
  const locale = useLocale();
  const t = getToolMessages(locale).base64;
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<Base64Operation>("encode");
  const [result, setResult] = useState("");
  const [error, setError] = useState<"invalid-base64" | "invalid-text" | null>(null);

  function process(nextOperation: Base64Operation) {
    if (!input) {
      setResult("");
      setError(null);
      return;
    }

    const transformed = transformBase64(input, nextOperation);
    setOperation(nextOperation);
    setResult(transformed.value ?? "");
    setError(transformed.error);
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
            inputId="base64-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[18rem] resize-y font-mono text-sm leading-6"
            aria-invalid={error !== null}
            aria-describedby={error ? "base64-error" : undefined}
          />

          {error && (
            <p id="base64-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error === "invalid-base64" ? t.invalidBase64 : t.invalidText}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => process("encode")} variant={operation === "encode" ? "primary" : "secondary"}>{t.encode}</Button>
            <Button onClick={() => process("decode")} variant={operation === "decode" ? "primary" : "secondary"}>{t.decode}</Button>
            <ClearButton onClear={clear} disabled={!input && !result} label={t.clear} />
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.output}</p>
              <p className={error ? "mt-1 text-sm text-[var(--danger)]" : "mt-1 text-sm text-[var(--muted)]"} aria-live="polite">
                {error ? t.error : result ? (operation === "encode" ? t.encoded : t.decoded) : t.emptyResult}
              </p>
            </div>
            {result && <CopyButton value={result} label={t.copy} />}
          </div>

          <pre
            aria-live="polite"
            className="mt-4 min-h-[18rem] flex-1 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)]"
          >
            {result || " "}
          </pre>
        </div>
      </div>
    </section>
  );
}
