"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { generateTypeScript } from "@/lib/json-to-typescript";

export default function JsonToTypeScript() {
  const locale = useLocale();
  const t = getToolMessages(locale).jsonToTypeScript;
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [result, setResult] = useState("");
  const [error, setError] = useState<"invalid-json" | "unsupported-root" | null>(null);

  function generate() {
    if (!input.trim()) {
      setResult("");
      setError(null);
      return;
    }
    const transformed = generateTypeScript(input, rootName || "Root");
    setResult(transformed.value ?? "");
    setError(transformed.error);
  }

  function clear() {
    setInput("");
    setResult("");
    setError(null);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <TextArea
            label={t.input}
            inputId="json-typescript-input"
            value={input}
            onChange={(event) => { setInput(event.target.value); setResult(""); setError(null); }}
            placeholder={t.placeholder}
            spellCheck={false}
            className="min-h-[18rem] resize-y font-mono text-sm leading-6"
            aria-invalid={error !== null}
            aria-describedby={error ? "json-typescript-error" : undefined}
          />
          <label htmlFor="json-typescript-root" className="mt-5 block text-sm font-semibold text-[var(--foreground)]">{t.rootName}</label>
          <input
            id="json-typescript-root"
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            className="mt-2 block min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
            placeholder={t.rootPlaceholder}
            autoCapitalize="words"
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={generate}>{t.generate}</Button>
            <ClearButton onClear={clear} disabled={!input && !result} label={t.clear} />
          </div>
          {error && <p id="json-typescript-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{error === "invalid-json" ? t.invalidJson : t.unsupportedRoot}</p>}
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{error ? t.error : result ? t.ready : t.emptyResult}</p>
            </div>
            {result && <CopyButton value={result} label={t.copy} />}
          </div>
          <pre aria-live="polite" className="mt-4 min-h-[18rem] flex-1 overflow-auto whitespace-pre-wrap break-words border-y border-[var(--border)] py-4 font-mono text-sm leading-6 text-[var(--foreground)]">{result || " "}</pre>
        </div>
      </div>
    </section>
  );
}
