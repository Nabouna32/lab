"use client";

import { useState } from "react";
import { ClearButton } from "@/components/ui/ClearButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { evaluateContrast } from "@/lib/contrast-checker";

const DEFAULT_FOREGROUND = "#111827";
const DEFAULT_BACKGROUND = "#ffffff";

export default function ContrastChecker() {
  const locale = useLocale();
  const t = getToolMessages(locale).contrastChecker;
  const [foreground, setForeground] = useState(DEFAULT_FOREGROUND);
  const [background, setBackground] = useState(DEFAULT_BACKGROUND);

  const result = evaluateContrast(foreground, background);
  const canReset = foreground !== DEFAULT_FOREGROUND || background !== DEFAULT_BACKGROUND;

  function swap() {
    setForeground(background);
    setBackground(foreground);
  }

  function clear() {
    setForeground(DEFAULT_FOREGROUND);
    setBackground(DEFAULT_BACKGROUND);
  }

  const ratio = result ? result.ratio.toFixed(2) : null;

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)] lg:p-8">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              id="contrast-foreground"
              label={t.foreground}
              value={foreground}
              onChange={setForeground}
              hint={t.colorHint}
            />
            <ColorField
              id="contrast-background"
              label={t.background}
              value={background}
              onChange={setBackground}
              hint={t.colorHint}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={swap}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {t.swap}
            </button>
            <ClearButton onClear={clear} disabled={!canReset} label={t.reset} />
          </div>

          <div
            className="rounded-[var(--radius-md)] border border-[var(--border)] p-5"
            style={{ backgroundColor: result ? background : "var(--background)", color: result ? foreground : "var(--muted)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{t.preview}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight">{t.previewText}</p>
            <p className="mt-2 text-sm opacity-80">{t.previewDescription}</p>
          </div>

          <p className="text-xs leading-5 text-[var(--muted)]">{t.colorHint}</p>
        </div>

        <div className="border-t border-[var(--border)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
          {result ? (
            <div className="mt-3 space-y-4">
              <div className="border-t border-[var(--border)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{t.ratio}</p>
                <p className="mt-2 text-4xl font-black tracking-[-0.04em] text-[var(--foreground)]">{ratio}:1</p>
              </div>
              <div className="space-y-2" aria-live="polite">
                <Criterion label={`${t.normalText} · AA`} pass={result.aaNormal} />
                <Criterion label={`${t.largeText} · AA`} pass={result.aaLarge} />
                <Criterion label={`${t.normalText} · AAA`} pass={result.aaaNormal} />
                <Criterion label={`${t.largeText} · AAA`} pass={result.aaaLarge} />
              </div>
            </div>
          ) : (
            <div role="alert" className="mt-3 border-t border-[var(--danger)]/30 pt-4 text-sm text-[var(--danger)]">
              {t.invalid}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-4 sm:px-7">
        <p className="text-xs leading-5 text-[var(--muted)]">{t.thresholds}</p>
      </div>
    </section>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--foreground)]">{label}</label>
      <div className="mt-2 flex gap-2">
        <input
          aria-label={label}
          type="color"
          value={parsePickerValue(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--background)] p-1"
        />
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#112233"
          spellCheck={false}
          autoCapitalize="none"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}

function parsePickerValue(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
}

function Criterion({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] py-3">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <span className={pass ? "text-sm font-bold text-[var(--success)]" : "text-sm font-bold text-[var(--danger)]"}>
        {pass ? "✓" : "—"}
      </span>
    </div>
  );
}
