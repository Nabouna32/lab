"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { generatePalette, type PaletteColor } from "@/lib/color-palette-generator";

const DEFAULT_COLOR = "#336699";

export default function ColorPaletteGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).colorPaletteGenerator;
  const [value, setValue] = useState(DEFAULT_COLOR);
  const palette = generatePalette(value);

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="space-y-6 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-5">
            <div>
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <TextField
                    label={t.input}
                    inputId="color-palette-input"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={t.placeholder}
                    spellCheck={false}
                    autoCapitalize="none"
                    aria-invalid={!palette}
                    aria-describedby="color-palette-hint"
                    className="font-mono"
                  />
                </div>
                <div className="shrink-0">
                  <label htmlFor="color-palette-picker" className="sr-only">{t.picker}</label>
                  <input
                    id="color-palette-picker"
                    type="color"
                    aria-label={t.picker}
                    value={palette?.base.hex ?? "#000000"}
                    onChange={(event) => setValue(event.target.value)}
                    className="h-11 w-14 cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-1 outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  />
                </div>
              </div>
              <p id="color-palette-hint" className="mt-2 text-xs text-[var(--muted)]">{t.hint}</p>
            </div>
            <ClearButton onClear={() => setValue(DEFAULT_COLOR)} disabled={value === DEFAULT_COLOR} label={t.reset} />
          </div>

          {palette ? (
            <div className="grid min-h-40 grid-cols-2 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] sm:grid-cols-4" aria-label={t.basePreview}>
              {palette.analogous.slice(0, 4).map((color) => (
                <div key={color.hex} className="min-h-24 p-3" style={{ backgroundColor: color.hex }}>
                  <code className="rounded-md bg-black/20 px-2 py-1 text-xs font-semibold text-white">{color.hex}</code>
                </div>
              ))}
            </div>
          ) : (
            <div role="alert" className="border-t border-[var(--danger)]/30 pt-4 text-sm text-[var(--danger)]">{t.invalid}</div>
          )}
        </div>

        {palette && (
          <div className="grid gap-4 sm:grid-cols-2">
            <PaletteGroup title={t.analogous} colors={palette.analogous} copyLabel={t.copy} copiedLabel={t.copied} />
            <PaletteGroup title={t.complementary} colors={palette.complementary} copyLabel={t.copy} copiedLabel={t.copied} />
            <PaletteGroup title={t.triadic} colors={palette.triadic} copyLabel={t.copy} copiedLabel={t.copied} />
            <PaletteGroup title={t.splitComplementary} colors={palette.splitComplementary} copyLabel={t.copy} copiedLabel={t.copied} />
            <PaletteGroup title={t.monochromatic} colors={palette.monochromatic} copyLabel={t.copy} copiedLabel={t.copied} />
          </div>
        )}
      </div>
    </section>
  );
}

function PaletteGroup({ title, colors, copyLabel, copiedLabel }: {
  title: string; colors: PaletteColor[]; copyLabel: string; copiedLabel: string;
}) {
  return (
    <section className="border-t border-[var(--border)] py-4">
      <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="mt-3 grid gap-2">
        {colors.map((color) => (
          <div key={color.hex} className="flex items-center gap-3">
            <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-[var(--radius-sm)] border border-black/10" style={{ backgroundColor: color.hex }} />
            <code className="min-w-0 flex-1 font-mono text-sm text-[var(--foreground)]">{color.hex}</code>
            <CopyButton value={color.hex} label={copyLabel} copiedLabel={copiedLabel} />
          </div>
        ))}
      </div>
    </section>
  );
}
