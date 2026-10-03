"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { transformHtmlEntities } from "@/lib/html-entity-encoder";

export default function HtmlEntityEncoder() {
  const locale = useLocale();
  const t = getToolMessages(locale).htmlEntityEncoder;
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => transformHtmlEntities(input, mode), [input, mode]);

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="p-4 sm:p-6 lg:p-7">
        <TextArea
          label={t.input}
          inputId="html-entity-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className="min-h-[13rem] resize-y font-mono"
        />

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">{t.operation}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.operation}>
            <Button
              type="button"
              variant={mode === "encode" ? "primary" : "secondary"}
              onClick={() => setMode("encode")}
              aria-pressed={mode === "encode"}
            >
              {t.encode}
            </Button>
            <Button
              type="button"
              variant={mode === "decode" ? "primary" : "secondary"}
              onClick={() => setMode("decode")}
              aria-pressed={mode === "decode"}
            >
              {t.decode}
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
                {input ? t.ready : t.emptyResult}
              </p>
            </div>
            <div className="flex gap-2">
              <CopyButton value={result} label={t.copy} />
              <ClearButton onClear={() => setInput("")} disabled={!input} label={t.clear} />
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
