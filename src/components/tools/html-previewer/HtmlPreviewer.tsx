"use client";

import { useMemo, useState } from "react";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { createHtmlPreviewDocument } from "@/lib/html-previewer";

export default function HtmlPreviewer() {
  const locale = useLocale();
  const t = getToolMessages(locale).htmlPreviewer;
  const [input, setInput] = useState("");

  const previewDocument = useMemo(() => createHtmlPreviewDocument(input), [input]);

  function clear() {
    setInput("");
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextArea
            label={t.input}
            inputId="html-previewer-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[24rem] resize-none font-mono text-sm leading-6"
            aria-describedby="html-previewer-hint"
          />
          <p id="html-previewer-hint" className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {t.hint}
          </p>
          <div className="mt-5">
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div>
            <p className="text-sm font-semibold text-[var(--muted)]">{t.preview}</p>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
              {previewDocument ? t.ready : t.emptyResult}
            </p>
          </div>

          <div className="mt-4 min-h-[24rem] overflow-hidden border-y border-[var(--border)] bg-white">
            {previewDocument ? (
              <iframe
                title={t.preview}
                sandbox=""
                srcDoc={previewDocument}
                className="h-[24rem] w-full border-0"
              />
            ) : (
              <div className="flex h-[24rem] items-center justify-center p-6 text-center text-sm text-[var(--muted)]">
                {t.emptyResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
