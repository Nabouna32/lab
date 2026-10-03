"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { convertTextCase, type TextCase } from "@/lib/text-case-converter";

export default function TextCaseConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).textCaseConverter;
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<TextCase>("uppercase");

  const result = useMemo(() => convertTextCase(input, format), [input, format]);

  function clear() {
    setInput("");
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="p-4 sm:p-6 lg:p-7">
        <TextArea
          label={t.input}
          inputId="text-case-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t.placeholder}
          spellCheck
          className="min-h-[15rem] resize-y"
        />

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">{t.mode}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.mode}>
            {(
              [
                ["uppercase", t.modes.uppercase],
                ["lowercase", t.modes.lowercase],
                ["title", t.modes.title],
                ["camel", t.modes.camel],
                ["pascal", t.modes.pascal],
                ["snake", t.modes.snake],
                ["kebab", t.modes.kebab],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={format === value ? "primary" : "secondary"}
                onClick={() => setFormat(value)}
                aria-pressed={format === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
                {result ? t.ready : t.emptyResult}
              </p>
            </div>
            <div className="flex gap-2">
              <CopyButton value={result} label={t.copy} />
              <ClearButton onClear={clear} disabled={!input} label={t.clear} />
            </div>
          </div>

          <pre
            aria-live="polite"
            className="mt-4 min-h-[10rem] overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-md)] bg-[var(--background)] p-4 font-mono text-sm leading-6 text-[var(--foreground)]"
          >
            {result || " "}
          </pre>
        </div>
      </div>
    </section>
  );
}
