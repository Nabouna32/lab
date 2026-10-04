"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { diffText } from "@/lib/text-diff";

export default function TextDiffChecker() {
  const locale = useLocale();
  const t = getToolMessages(locale).textDiffChecker;
  const [original, setOriginal] = useState("");
  const [updated, setUpdated] = useState("");

  const result = useMemo(() => {
    if (!original && !updated) return null;
    try {
      return { value: diffText(original, updated), error: null };
    } catch {
      return { value: null, error: t.resourceLimit };
    }
  }, [original, updated, t.resourceLimit]);

  const clear = () => {
    setOriginal("");
    setUpdated("");
  };

  const summary = result?.value
    ? t.summary(result.value.added, result.value.removed, result.value.unchanged)
    : "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <TextArea
            label={t.original}
            inputId="text-diff-original"
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
            placeholder={t.originalPlaceholder}
            spellCheck={false}
            className="min-h-[14rem] resize-y font-mono text-sm"
          />
          <TextArea
            label={t.updated}
            inputId="text-diff-updated"
            value={updated}
            onChange={(event) => setUpdated(event.target.value)}
            placeholder={t.updatedPlaceholder}
            spellCheck={false}
            className="min-h-[14rem] resize-y font-mono text-sm"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.result}</p>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
              {result?.error ?? summary || t.emptyResult}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton
              value={result?.value?.lines.map((line) => (line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ") + line.text).join("\n") ?? ""}
              label={t.copy}
            />
            <ClearButton onClear={clear} disabled={!original && !updated} label={t.clear} />
          </div>
        </div>

        <div
          aria-live="polite"
          className="mt-4 max-h-[32rem] overflow-auto rounded-[var(--radius-md)] bg-[var(--background)] p-2 font-mono text-sm"
        >
          {result?.value ? (
            result.value.lines.map((line, index) => (
              <div
                key={line.type + "-" + (line.oldLine ?? "") + "-" + (line.newLine ?? "") + "-" + index}
                className={"grid grid-cols-[3rem_3rem_minmax(0,1fr)] gap-2 rounded px-2 py-1 " + (line.type === "added" ? "bg-[var(--success-soft)]" : line.type === "removed" ? "bg-[var(--danger-soft)]" : "")}
              >
                <span className="text-right text-[var(--muted)]" aria-hidden="true">{line.oldLine ?? ""}</span>
                <span className="text-right text-[var(--muted)]" aria-hidden="true">{line.newLine ?? ""}</span>
                <span className="whitespace-pre-wrap break-words">
                  <span aria-hidden="true" className="mr-2 select-none text-[var(--muted)]">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  {line.text || " "}
                </span>
              </div>
            ))
          ) : (
            <p className="min-h-24 p-3 text-sm text-[var(--muted)]">{result?.error ?? t.emptyResult}</p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" variant="secondary" onClick={clear} disabled={!original && !updated}>
            {t.reset}
          </Button>
        </div>
      </div>
    </section>
  );
}
