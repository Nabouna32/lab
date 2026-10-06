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

  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="h-px bg-[var(--accent)]" aria-hidden="true" />
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">{t.input}</p>
            <span className="font-mono text-xs text-[var(--muted)]" aria-hidden="true">HTML</span>
          </div>
          <div className="pt-4">
            <TextArea label={t.input} inputId="html-previewer-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} spellCheck={false} className="min-h-[24rem] resize-none border-0 bg-[var(--surface-soft)] font-mono text-sm leading-6 shadow-none" aria-describedby="html-previewer-hint" />
          </div>
          <p id="html-previewer-hint" className="mt-3 text-sm leading-6 text-[var(--muted)]">{t.hint}</p>
          <div className="mt-5 border-t border-[var(--border)] pt-4"><ClearButton onClear={() => setInput("")} disabled={!input} label={t.clear} /></div>
        </div>
        <div className="flex min-h-full flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-7">
          <div className="flex items-end justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">{t.preview}</p><p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{previewDocument ? t.ready : t.emptyResult}</p></div>
          </div>
          <div className="mt-4 min-h-[24rem] overflow-hidden border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
            {previewDocument ? <iframe title={t.preview} sandbox="" srcDoc={previewDocument} className="h-[24rem] w-full border-0" /> : <div className="flex h-[24rem] items-center justify-center border border-dashed border-[var(--border-strong)] p-6 text-center text-sm text-[var(--muted)]">{t.emptyResult}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
