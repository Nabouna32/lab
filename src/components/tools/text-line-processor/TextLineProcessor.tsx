"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { writePendingTextToolTransfer } from "@/lib/tools/text-transfer";
import { getToolPath } from "@/lib/tools/routes";
import { countTextLines, processTextLines, TEXT_LINE_PROCESSOR_MAX_CHARS, type TextLineSortOrder } from "@/lib/text-line-processor";

export default function TextLineProcessor() {
  const locale = useLocale();
  const router = useRouter();
  const t = getToolMessages(locale).textLineProcessor;
  const [input, setInput] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [sortOrder, setSortOrder] = useState<TextLineSortOrder>("none");
  const [transferError, setTransferError] = useState(false);

  const tooLarge = input.length > TEXT_LINE_PROCESSOR_MAX_CHARS;
  const result = useMemo(() => {
    if (tooLarge) return "";
    return processTextLines(input, { trimLines, removeBlankLines, removeDuplicates, sortOrder }, locale);
  }, [input, trimLines, removeBlankLines, removeDuplicates, sortOrder, locale, tooLarge]);

  function clear() {
    setInput("");
    setTransferError(false);
  }

  function sendToCompare() {
    setTransferError(false);
    try {
      if (!writePendingTextToolTransfer(window.sessionStorage, result)) {
        setTransferError(true);
        return;
      }
      router.push(getToolPath(locale, "text-diff-checker"));
    } catch {
      setTransferError(true);
    }
  }

  const before = countTextLines(input);
  const after = countTextLines(result);
  const options = [
    { checked: trimLines, setChecked: setTrimLines, label: t.trimLines },
    { checked: removeBlankLines, setChecked: setRemoveBlankLines, label: t.removeBlankLines },
    { checked: removeDuplicates, setChecked: setRemoveDuplicates, label: t.removeDuplicates },
  ];

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <TextArea
            label={t.input}
            inputId="text-line-processor-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[18rem] resize-y font-mono text-sm leading-6"
            aria-invalid={tooLarge}
          />
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-[var(--foreground)]">{t.options}</p>
            <div className="grid gap-3">
              {options.map((option) => (
                <label key={option.label} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(event) => option.setChecked(event.target.checked)}
                    className="mt-0.5 size-4 accent-[var(--primary)]"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">{t.sortOrder}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t.sortOrder}>
              {([
                ["none", t.noSort],
                ["ascending", t.ascending],
                ["descending", t.descending],
              ] as const).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  variant={sortOrder === value ? "primary" : "secondary"}
                  onClick={() => setSortOrder(value)}
                  aria-pressed={sortOrder === value}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          {tooLarge && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.resourceLimit}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <ClearButton onClear={clear} disabled={!input} label={t.clear} />
          </div>
        </div>
        <div className="flex min-h-full flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
                {tooLarge ? t.resourceLimit : input ? t.lineCounts(before, after) : t.emptyResult}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={result} label={t.copy} />
              <Button type="button" variant="secondary" onClick={sendToCompare} disabled={!result || tooLarge}>
                {t.sendToCompare}
              </Button>
            </div>
          </div>
          {transferError && <p role="alert" className="mt-3 text-sm font-medium text-[var(--danger)]">{t.transferFailed}</p>}
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
