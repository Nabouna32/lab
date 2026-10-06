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
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="h-px bg-[var(--accent)]" aria-hidden="true" />
      <div className="grid gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="bg-[var(--surface-soft)] p-4 sm:p-6 lg:border-r lg:border-[var(--border)] lg:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">{t.input}</p>
          <div className="mt-3">
            <TextField label={t.input} inputId="color-palette-input" value={value} onChange={(event) => setValue(event.target.value)} placeholder={t.placeholder} spellCheck={false} autoCapitalize="none" aria-invalid={!palette} aria-describedby="color-palette-hint" className="font-mono" />
          </div>
          <div className="mt-3">
            <label htmlFor="color-palette-picker" className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{t.picker}</label>
            <input id="color-palette-picker" type="color" aria-label={t.picker} value={palette?.base.hex ?? "#000000"} onChange={(event) => setValue(event.target.value)} className="mt-2 h-14 w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-1 outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]" />
          </div>
          <p id="color-palette-hint" className="mt-3 text-xs leading-5 text-[var(--muted)]">{t.hint}</p>
          <div className="mt-5 border-t border-[var(--border)] pt-4"><ClearButton onClear={() => setValue(DEFAULT_COLOR)} disabled={value === DEFAULT_COLOR} label={t.reset} /></div>
        </aside>
        <div className="min-w-0 p-4 sm:p-6 lg:p-7">
          {palette ? <>
            <div className="overflow-hidden border border-[var(--border)]" role="img" aria-label={t.basePreview}>
              <div className="grid min-h-44 grid-cols-2 sm:grid-cols-4">
                {palette.analogous.slice(0, 4).map((color) => <div key={color.hex} className="relative min-h-32 p-3 sm:min-h-44" style={{ backgroundColor: color.hex }}><code className="absolute bottom-3 left-3 rounded-md bg-black/20 px-2 py-1 text-xs font-semibold" style={{ color: getPaletteTextColor(color.hex) }}>{color.hex}</code></div>)}
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-3">
              <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">{t.basePreview}</p><p className="mt-1 text-sm text-[var(--muted)]">{t.hint}</p></div>
            </div>
            <div className="mt-5 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              <PaletteGroup title={t.analogous} colors={palette.analogous} copyLabel={t.copy} copiedLabel={t.copied} />
              <PaletteGroup title={t.complementary} colors={palette.complementary} copyLabel={t.copy} copiedLabel={t.copied} />
              <PaletteGroup title={t.triadic} colors={palette.triadic} copyLabel={t.copy} copiedLabel={t.copied} />
              <PaletteGroup title={t.splitComplementary} colors={palette.splitComplementary} copyLabel={t.copy} copiedLabel={t.copied} />
              <PaletteGroup title={t.monochromatic} colors={palette.monochromatic} copyLabel={t.copy} copiedLabel={t.copied} />
            </div>
          </> : <div role="alert" className="border-l-2 border-[var(--danger)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">{t.invalid}</div>}
        </div>
      </div>
    </section>
  );
}

function getPaletteTextColor(hex: string) {\n  const normalized = hex.replace("#", "");\n  if (normalized.length !== 6) return "#ffffff";\n  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;\n  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;\n  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;\n  const luminance = [red, green, blue].map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);\n  const relativeLuminance = 0.2126 * luminance[0] + 0.7152 * luminance[1] + 0.0722 * luminance[2];\n  return relativeLuminance > 0.179 ? "#111111" : "#ffffff";\n}\n\nfunction PaletteGroup({ title, colors, copyLabel, copiedLabel }: { title: string; colors: PaletteColor[]; copyLabel: string; copiedLabel: string; }) {
  return <section className="border-t border-[var(--border)] pt-4"><h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2><div className="mt-3 grid gap-2">{colors.map((color) => <div key={color.hex} className="flex items-center gap-3"><span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-[var(--radius-sm)] border border-black/10" style={{ backgroundColor: color.hex }} /><code className="min-w-0 flex-1 font-mono text-sm text-[var(--foreground)]">{color.hex}</code><CopyButton value={color.hex} label={copyLabel} copiedLabel={copiedLabel} /></div>)}</div></section>;
}
