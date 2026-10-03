"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { parseUrl } from "@/lib/url-parser";

const fieldKeys = [
  "protocol",
  "origin",
  "username",
  "host",
  "hostname",
  "port",
  "pathname",
  "search",
  "hash",
] as const;

export default function UrlParser() {
  const locale = useLocale();
  const t = getToolMessages(locale).urlParser;
  const [input, setInput] = useState("");

  const parsed = useMemo(() => parseUrl(input), [input]);
  const result = parsed.value;

  const fields = result
    ? fieldKeys.map((key) => ({
        key,
        label: t[key],
        value: result[key] || t.emptyValue,
      }))
    : [];

  function clear() {
    setInput("");
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="url-parser-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[13rem] resize-y font-mono text-sm leading-6"
            aria-invalid={Boolean(input && !result)}
            aria-describedby={input && !result ? "url-parser-error" : undefined}
          />

          {input && !result && (
            <p id="url-parser-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {t.invalid}
            </p>
          )}

          <div className="mt-5">
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
          </div>

          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{t.hint}</p>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
                {result ? t.ready : t.emptyResult}
              </p>
            </div>
            {result && <CopyButton value={result.href} label={t.copy} />}
          </div>

          {result ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{field.label}</p>
                  <p className="mt-2 break-all font-mono text-sm leading-6 text-[var(--foreground)]">{field.value}</p>
                </div>
              ))}
              <div className="sm:col-span-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{t.queryParameters}</p>
                {result.queryParameters.length ? (
                  <div className="mt-3 divide-y divide-[var(--border)]">
                    {result.queryParameters.map((parameter, index) => (
                      <div key={index} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] sm:gap-4">
                        <p className="break-all font-mono text-sm font-semibold text-[var(--foreground)]">{parameter.key}</p>
                        <p className="break-all font-mono text-sm text-[var(--muted)]">{parameter.value || t.emptyValue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[var(--muted)]">{t.noQueryParameters}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 flex min-h-[22rem] items-center justify-center border-y border-[var(--border)] text-center">
              <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
