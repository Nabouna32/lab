"use client";

import { useMemo, useState } from "react";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { TextArea } from "@/components/ui/TextArea";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { countTextStats } from "@/lib/mots-caracteres";

export default function TextCounter() {
  const locale = useLocale();
  const t = getToolMessages(locale).textCounter;
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    if (typeof window === "undefined") {
      return { characters: 0, charactersWithoutSpaces: 0, words: 0, spaces: 0, lines: 0 };
    }
    return countTextStats(text);
  }, [text]);
  const copyValue = [
    `${t.words}: ${stats.words}`,
    `${t.characters}: ${stats.characters}`,
    `${t.charactersWithoutSpaces}: ${stats.charactersWithoutSpaces}`,
    `${t.spaces}: ${stats.spaces}`,
    `${t.lines}: ${stats.lines}`,
  ].join("\n");

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
      <div className="flex items-center justify-end gap-2">
        <ClearButton onClear={() => setText("")} disabled={text.length === 0} label={t.clear} />
        <CopyButton value={copyValue} label={t.copyStats} />
      </div>

      <div className="mt-4">
        <TextArea
          label={t.input}
          inputId="text-counter-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.placeholder}
          spellCheck
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultPanel label={t.words} tone="accent" value={stats.words} />
        <ResultPanel label={t.characters} value={stats.characters} />
        <ResultPanel label={t.charactersWithoutSpaces} value={stats.charactersWithoutSpaces} />
        <ResultPanel label={t.lines} value={stats.lines} />
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        {t.spaces}: {stats.spaces}
      </p>
    </section>
  );
}
