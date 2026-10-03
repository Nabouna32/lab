"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import {
  transformUrlText,
  type UrlTransformOperation,
  type UrlTransformScope,
} from "@/lib/url-encoder";

export default function UrlEncoder() {
  const locale = useLocale();
  const t = getToolMessages(locale).urlEncoder;
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<UrlTransformOperation>("encode");
  const [scope, setScope] = useState<UrlTransformScope>("component");
  const [result, setResult] = useState("");
  const [error, setError] = useState<"invalid-encoding" | "invalid-text" | null>(null);

  function process(nextOperation: UrlTransformOperation = operation) {
    if (!input) {
      setResult("");
      setError(null);
      return;
    }

    const transformed = transformUrlText(input, nextOperation, scope);
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
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="url-encoder-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
            }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[18rem] resize-y font-mono text-sm leading-6"
            aria-invalid={error !== null}
            aria-describedby={error ? "url-encoder-error" : undefined}
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select
              label={t.scope}
              id="url-encoder-scope"
              value={scope}
              onChange={(event) => {
                setScope(event.target.value as UrlTransformScope);
                setError(null);
              }}
            >
              <option value="component">{t.component}</option>
              <option value="uri">{t.uri}</option>
            </Select>

            <div>
              <p className="mb-2 text-sm font-medium text-[var(--foreground)]">{t.operation}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={operation === "encode" ? "primary" : "secondary"}
                  onClick={() => process("encode")}
                >
                  {t.encode}
                </Button>
                <Button
                  type="button"
                  variant={operation === "decode" ? "primary" : "secondary"}
                  onClick={() => process("decode")}
                >
                  {t.decode}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <p id="url-encoder-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {error === "invalid-encoding" ? t.invalidEncoding : t.invalidText}
            </p>
          )}

          <div className="mt-5">
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
            className="mt-4 min-h-[18rem] flex-1 overflow-auto whitespace-pre-wrap break-words border-y border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--foreground)]"
          >
            {result || " "}
          </pre>
        </div>
      </div>
    </section>
  );
}
