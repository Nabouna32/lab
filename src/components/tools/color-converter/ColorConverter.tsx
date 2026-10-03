"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextField } from "@/components/ui/TextField";
import { ClearButton } from "@/components/ui/ClearButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { convertColor, formatHsl, formatRgb } from "@/lib/color-converter";

const DEFAULT_COLOR = "#336699";

export default function ColorConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).colorConverter;
  const [value, setValue] = useState(DEFAULT_COLOR);
  const result = convertColor(value);
  const canReset = value !== DEFAULT_COLOR;

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8">
        <div className="space-y-5">
          <div>
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <TextField
                  label={t.input}
                  inputId="color-converter-input"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={t.placeholder}
                  spellCheck={false}
                  autoCapitalize="none"
                  aria-invalid={!result}
                  className="font-mono"
                />
              </div>
              <div className="shrink-0">
                <label htmlFor="color-converter-picker" className="sr-only">{t.picker}</label>
                <input
                  id="color-converter-picker"
                  type="color"
                  aria-label={t.picker}
                  value={result?.hex ?? "#000000"}
                  onChange={(event) => setValue(event.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-1 outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{t.hint}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ClearButton onClear={() => setValue(DEFAULT_COLOR)} disabled={!canReset} label={t.reset} />
          </div>

          {result ? (
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]" style={{ backgroundColor: result.hex }}>
              <div className="min-h-40 p-6" style={{ color: contrastText(result.rgb.r, result.rgb.g, result.rgb.b) }}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-75">{t.preview}</p>
                <p className="mt-3 text-3xl font-black tracking-tight">{result.hex}</p>
                <p className="mt-2 text-sm opacity-85">{t.previewDescription}</p>
              </div>
            </div>
          ) : (
            <div role="alert" className="border-t border-[var(--danger)]/30 pt-4 text-sm text-[var(--danger)]">{t.invalid}</div>
          )}
        </div>

        <div className="border-t border-[var(--border)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
          {result ? (
            <div className="mt-3 space-y-3" aria-live="polite">
              <ColorValue label="HEX" value={result.hex} copyLabel={t.copy} copiedLabel={t.copied} />
              <ColorValue label="RGB" value={formatRgb(result.rgb)} copyLabel={t.copy} copiedLabel={t.copied} />
              <ColorValue label="HSL" value={formatHsl(result.hsl)} copyLabel={t.copy} copiedLabel={t.copied} />
            </div>
          ) : (
            <p className="mt-3 border-t border-[var(--border)] py-4 text-sm text-[var(--muted)]">{t.emptyResult}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function ColorValue({ label, value, copyLabel, copiedLabel }: { label: string; value: string; copyLabel: string; copiedLabel: string }) {
  return (
    <div className="border-t border-[var(--border)] py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <CopyButton value={value} label={copyLabel} copiedLabel={copiedLabel} />
      </div>
      <code className="mt-3 block break-all font-mono text-sm text-[var(--foreground)]">{value}</code>
    </div>
  );
}

function contrastText(r: number, g: number, b: number): "#ffffff" | "#111827" {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.58 ? "#111827" : "#ffffff";
}
