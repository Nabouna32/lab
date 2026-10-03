"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { testRegex, type RegexTestResult } from "@/lib/regex-tester";

export default function RegexTester() {
  const locale = useLocale();
  const t = getToolMessages(locale).regexTester;
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<RegexTestResult | null>(null);
  const [error, setError] = useState("");

  function test() {
    try {
      setResult(testRegex(pattern, flags, input));
      setError("");
    } catch {
      setResult(null);
      setError(t.invalid);
    }
  }

  function clear() {
    setPattern("");
    setFlags("g");
    setInput("");
    setResult(null);
    setError("");
  }

  const copyValue = result?.matches.map((match) => match.value).join("\n") ?? "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_13rem] lg:p-8">
        <div>
          <label htmlFor="regex-pattern" className="block text-sm font-medium text-[var(--foreground)]">{t.pattern}</label>
          <input id="regex-pattern" value={pattern} onChange={(event) => { setPattern(event.target.value); setResult(null); setError(""); }} placeholder={t.patternPlaceholder} spellCheck={false} className="mt-2 block w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
        </div>
        <div>
          <label htmlFor="regex-flags" className="block text-sm font-medium text-[var(--foreground)]">{t.flags}</label>
          <input id="regex-flags" value={flags} onChange={(event) => { setFlags(event.target.value); setResult(null); setError(""); }} placeholder="gim" inputMode="text" autoCapitalize="none" spellCheck={false} className="mt-2 block w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
          <p className="mt-2 text-xs text-[var(--muted)]">{t.flagsHint}</p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] p-5 sm:p-7 lg:p-8">
        <label htmlFor="regex-input" className="block text-sm font-medium text-[var(--foreground)]">{t.input}</label>
        <textarea id="regex-input" value={input} onChange={(event) => { setInput(event.target.value); setResult(null); setError(""); }} placeholder={t.inputPlaceholder} rows={8} spellCheck={false} className="mt-2 block w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={test} disabled={!pattern}>{t.test}</Button>
          <ClearButton onClear={clear} disabled={!pattern && !flags && !input && !result} label={t.clear} />
        </div>
        {error && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{error}</p>}
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--background)] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
              {result ? t.matchCount(result.matches.length) : t.emptyResult}
            </p>
          </div>
          {copyValue && <CopyButton value={copyValue} label={t.copy} />}
        </div>

        {result ? (
          result.matches.length > 0 ? (
            <div className="mt-5 space-y-3">
              {result.matches.map((match, index) => (
                <article key={index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-sm font-semibold text-[var(--foreground)]">{match.value || t.emptyMatch}</p>
                    <span className="text-xs text-[var(--muted)]">{t.position} {match.index}</span>
                  </div>
                  {match.captures.length > 0 && <p className="mt-2 text-xs text-[var(--muted)]">{t.captures}: {match.captures.map((capture, captureIndex) => `${captureIndex + 1}: ${capture ?? "∅"}`).join(" · ")}</p>}
                  {Object.keys(match.namedGroups).length > 0 && <p className="mt-2 break-words text-xs text-[var(--muted)]">{t.namedGroups}: {Object.entries(match.namedGroups).map(([name, value]) => `${name}: ${value ?? "∅"}`).join(" · ")}</p>}
                </article>
              ))}
              {result.truncated && <p className="text-xs text-[var(--muted)]">{t.truncated}</p>}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)]">{t.noMatches}</div>
          )
        ) : (
          <div className="mt-5 min-h-32 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)]">{t.emptyResult}</div>
        )}
      </div>
    </section>
  );
}
