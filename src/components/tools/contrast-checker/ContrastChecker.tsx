"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { evaluateContrast, parseColor } from "@/lib/contrast-checker";

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
            <Button type="button" variant="secondary" onClick={swap}>
              {t.swap}
            </Button>
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
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <TextField
            label={label}
            inputId={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#112233"
            spellCheck={false}
            autoCapitalize="none"
            aria-invalid={parseColor(value) === null}
            aria-describedby={id + "-hint"}
            className="font-mono"
          />
        </div>
        <div className="shrink-0">
          <label htmlFor={id + "-picker"} className="sr-only">{label}</label>
          <input
            id={id + "-picker"}
            type="color"
            aria-label={label}
            value={parsePickerValue(value)}
            onChange={(event) => onChange(event.target.value)}
            className="h-11 w-14 cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-1 outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          />
        </div>
      </div>
      <p id={id + "-hint"} className="mt-2 text-xs text-[var(--muted)]">{hint}</p>
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
