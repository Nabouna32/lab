"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { decodeJwt, formatDecodedJwt } from "@/lib/jwt-decoder";

export default function JwtDecoder() {
  const locale = useLocale();
  const t = getToolMessages(locale).jwtDecoder;
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<Awaited<ReturnType<typeof decodeJwt>> | null>(null);
  const [error, setError] = useState(false);

  function decode() {
    try {
      setDecoded(decodeJwt(token));
      setError(false);
    } catch {
      setDecoded(null);
      setError(true);
    }
  }

  function clear() {
    setToken("");
    setDecoded(null);
    setError(false);
  }

  return (
    <section className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-8">
      <label htmlFor="jwt-input" className="block text-sm font-medium text-[var(--foreground)]">{t.input}</label>
      <textarea
        id="jwt-input"
        value={token}
        onChange={(event) => { setToken(event.target.value); setDecoded(null); setError(false); }}
        placeholder={t.placeholder}
        rows={7}
        spellCheck={false}
        className="mt-2 block w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={decode} disabled={!token.trim()}>{t.decode}</Button>
        <ClearButton onClear={clear} disabled={!token && !decoded} label={t.clear} />
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}

      {decoded && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[
            [t.header, decoded.header],
            [t.payload, decoded.payload],
          ].map(([title, value]) => (
            <section key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
                <CopyButton value={formatDecodedJwt(value as Record<string, unknown>)} label={t.copy} />
              </div>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-xs leading-6 text-[var(--foreground)]">
                {formatDecodedJwt(value as Record<string, unknown>)}
              </pre>
            </section>
          ))}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">{t.signature}</h2>
              <CopyButton value={decoded.signature} label={t.copy} />
            </div>
            <p className="mt-3 break-all rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-xs leading-6 text-[var(--foreground)]">{decoded.signature}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">{t.signatureNote}</p>
          </section>
        </div>
      )}
    </section>
  );
}
