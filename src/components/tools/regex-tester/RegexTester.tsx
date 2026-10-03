"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
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
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_13rem] lg:p-7">
        <TextField label={t.pattern} inputId="regex-pattern" value={pattern} onChange={(event) => { setPattern(event.target.value); setResult(null); setError(""); }} placeholder={t.patternPlaceholder} spellCheck={false} className="font-mono text-sm" aria-invalid={Boolean(error)} />
        <div>
          <TextField label={t.flags} inputId="regex-flags" value={flags} onChange={(event) => { setFlags(event.target.value); setResult(null); setError(""); }} placeholder="gim" inputMode="text" autoCapitalize="none" spellCheck={false} className="font-mono text-sm" aria-invalid={Boolean(error)} />
          <p className="mt-2 text-xs text-[var(--muted)]">{t.flagsHint}</p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] p-4 sm:p-6 lg:p-7">
        <TextArea label={t.input} inputId="regex-input" value={input} onChange={(event) => { setInput(event.target.value); setResult(null); setError(""); }} placeholder={t.inputPlaceholder} rows={8} spellCheck={false} className="min-h-52 resize-y font-mono text-sm" aria-invalid={Boolean(error)} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={test} disabled={!pattern}>{t.test}</Button>
          <ClearButton onClear={clear} disabled={!pattern && !flags && !input && !result} label={t.clear} />
        </div>
        {error && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{error}</p>}
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--background)] p-4 sm:p-6 lg:p-7">
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
                <article key={index} className="border-t border-[var(--border)] py-4 first:border-t-0">
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
            <div className="mt-5 border-t border-[var(--border)] pt-5 text-sm text-[var(--muted)]">{t.noMatches}</div>
          )
        ) : (
          <div className="mt-5 min-h-32 border-t border-[var(--border)] pt-5 text-sm text-[var(--muted)]">{t.emptyResult}</div>
        )}
      </div>
    </section>
  );
}
