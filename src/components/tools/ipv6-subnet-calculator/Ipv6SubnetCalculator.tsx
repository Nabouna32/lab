"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ClearButton } from "@/components/ui/ClearButton";
import { OutlinedButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { calculateIpv6Subnet } from "@/lib/ipv6-subnet-calculator";

const DEFAULT_INPUT = "2001:db8:1234:1::42/64";

export default function Ipv6SubnetCalculator() {
  const locale = useLocale();
  const t = getToolMessages(locale).ipv6SubnetCalculator;
  const [input, setInput] = useState(DEFAULT_INPUT);
  const result = useMemo(() => calculateIpv6Subnet(input), [input]);

  function reset() { setInput(DEFAULT_INPUT); }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <TextField
            label={t.input}
            inputId="ipv6-subnet-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="font-mono"
            aria-invalid={Boolean(input && !result)}
            aria-describedby={input && !result ? "ipv6-subnet-error" : undefined}
          />
          {input && !result && <p id="ipv6-subnet-error" role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{t.invalid}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <ClearButton onClear={() => setInput("")} disabled={!input} label={t.clear} />
            <OutlinedButton type="button" onClick={reset}>{t.reset}</OutlinedButton>
          </div>
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{t.hint}</p>
        </div>
        <div className="flex min-h-full flex-col bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{result ? t.ready : t.emptyResult}</p>
            </div>
            {result && <CopyButton value={[`${t.address}: ${result.address}`, `${t.prefix}: /${result.prefix}`, `${t.networkAddress}: ${result.networkAddress}`, `${t.lastAddress}: ${result.lastAddress}`, `${t.addressCount}: ${result.addressCount.toString()}`].join("\n")} label={t.copy} />}
          </div>
          {result ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: t.address, value: result.address },
                { label: t.prefix, value: `/${result.prefix}` },
                { label: t.networkAddress, value: result.networkAddress },
                { label: t.lastAddress, value: result.lastAddress },
                { label: t.addressCount, value: result.addressCount.toLocaleString(locale) },
              ].map((field) => <div key={field.label} className="rounded-[var(--shape-corner-medium)] border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{field.label}</p>
                <p className="mt-2 break-all font-mono text-sm leading-6 text-[var(--foreground)]">{field.value}</p>
              </div>)}
            </div>
          ) : <div className="mt-5 flex min-h-[22rem] items-center justify-center border-y border-[var(--border)] text-center"><p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{t.emptyResult}</p></div>}
        </div>
      </div>
    </section>
  );
}
