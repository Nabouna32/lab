"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextField } from "@/components/ui/TextField";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { calculateIpv4Subnet } from "@/lib/ip-subnet-calculator";

const DEFAULT_INPUT = "192.168.1.42/24";

const resultFields = [
  "networkAddress",
  "broadcastAddress",
  "subnetMask",
  "wildcardMask",
  "firstUsableAddress",
  "lastUsableAddress",
] as const;

export default function IpSubnetCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).ipSubnetCalculator;
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateIpv4Subnet(input), [input]);

  function reset() {
    setInput(DEFAULT_INPUT);
  }

  const fields = result
    ? resultFields.map((key) => ({
        key,
        label: t[key],
        value: result[key],
      }))
    : [];

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextField
            label={t.input}
            inputId="ip-subnet-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="font-mono"
            aria-invalid={Boolean(input && !result)}
            aria-describedby={input && !result ? "ip-subnet-error" : undefined}
          />

          {input && !result && (
            <p id="ip-subnet-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
              {t.invalid}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <ClearButton onClear={() => setInput("")} disabled={!input} label={t.clear} />
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {t.reset}
            </button>
          </div>

          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{t.hint}</p>
        </div>

        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">
                {result ? t.ready : t.emptyResult}
              </p>
            </div>
            {result && (
              <CopyButton
                value={[
                  `${t.networkAddress}: ${result.networkAddress}`,
                  `${t.broadcastAddress}: ${result.broadcastAddress}`,
                  `${t.subnetMask}: ${result.subnetMask}`,
                  `${t.wildcardMask}: ${result.wildcardMask}`,
                  `${t.firstUsableAddress}: ${result.firstUsableAddress}`,
                  `${t.lastUsableAddress}: ${result.lastUsableAddress}`,
                  `${t.totalAddresses}: ${result.totalAddresses}`,
                  `${t.usableHosts}: ${result.usableHosts}`,
                ].join("\n")}
                label={t.copy}
              />
            )}
          </div>

          {result ? (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{field.label}</p>
                    <p className="mt-2 break-all font-mono text-sm leading-6 text-[var(--foreground)]">{field.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{t.totalAddresses}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)]">{result.totalAddresses.toLocaleString(locale)}</p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{t.usableHosts}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)]">{result.usableHosts.toLocaleString(locale)}</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{t.hostCountNote}</p>
            </>
          ) : (
            <div className="mt-5 flex min-h-[22rem] items-center justify-center border-y border-[var(--border)] text-center">
              <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
