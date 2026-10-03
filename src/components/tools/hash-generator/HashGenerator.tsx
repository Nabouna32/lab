"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { hashText, type HashAlgorithm } from "@/lib/hash-generator";

export default function HashGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).hashGenerator;
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [result, setResult] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    setError(false);
    try {
      setResult(await hashText(input, algorithm));
    } catch {
      setResult("");
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setInput("");
    setResult("");
    setError(false);
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <label htmlFor="hash-input" className="block text-sm font-medium text-[var(--foreground)]">{t.input}</label>
          <textarea
            id="hash-input"
            value={input}
            onChange={(event) => { setInput(event.target.value); setResult(""); setError(false); }}
            placeholder={t.placeholder}
            rows={8}
            className="min-h-48 w-full resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-standard)] placeholder:text-[var(--muted)] hover:border-[var(--border-strong)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--surface-soft)] disabled:opacity-60"
            aria-invalid={error}
          />
        </div>
        <div>
          <Select label={t.algorithm} id="hash-algorithm" value={algorithm} onChange={(event) => { setAlgorithm(event.target.value as HashAlgorithm); setResult(""); setError(false); }} aria-invalid={error}>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </Select>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={generate} disabled={busy}>{busy ? t.generating : t.generate}</Button>
            <ClearButton onClear={clear} disabled={!input && !result} label={t.clear} />
          </div>
        </div>
      </div>

      {error && <p role="alert" className="mt-5 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{result ? t.complete : t.emptyResult}</p>
          </div>
          {result && <CopyButton value={result} label={t.copy} />}
        </div>
        <output aria-live="polite" className="mt-4 block min-h-24 break-all rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] p-4 font-mono text-sm leading-7 text-[var(--foreground)]">
          {result || " "}
        </output>
      </div>
    </section>
  );
}
