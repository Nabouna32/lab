"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextArea } from "@/components/ui/TextArea";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { generateQrCode } from "@/lib/qr-code";

const DEFAULT_VALUE = "https://example.com";

export default function QrCodeGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).qrCodeGenerator;
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [size, setSize] = useState("256");
  const svgRef = useRef<SVGSVGElement>(null);

  const result = useMemo(() => {
    if (!value) return null;
    try { return { qr: generateQrCode(value), error: null }; }
    catch { return { qr: null, error: t.tooLong }; }
  }, [value, t.tooLong]);

  function download() {
    if (!svgRef.current || !result?.qr) return;
    const source = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "loculary-qr-code.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8">
        <div className="space-y-5">
          <TextArea
            label={t.input}
            inputId="qr-code-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            autoCapitalize="none"
            className="min-h-36 resize-y font-mono text-sm"
            aria-invalid={Boolean(result?.error)}
            aria-describedby={result?.error ? "qr-code-error" : undefined}
          />
          <p className="text-xs text-[var(--muted)]">{t.hint}</p>
          {result?.error && <p id="qr-code-error" role="alert" className="text-sm font-medium text-[var(--danger)]">{result.error}</p>}

          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-medium text-[var(--foreground)]">
              <span className="mb-2 block">{t.size}</span>
              <select value={size} onChange={(event) => setSize(event.target.value)} className="h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
                <option value="192">192 px</option>
                <option value="256">256 px</option>
                <option value="320">320 px</option>
                <option value="512">512 px</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="primary" onClick={download} disabled={!result?.qr}>{t.download}</Button>
              <ClearButton onClear={() => setValue("")} disabled={!value} label={t.clear} />
            </div>
          </div>
        </div>

        <div className="flex min-h-72 items-center justify-center border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          {result?.qr ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`-4 -4 ${result.qr.matrix.length + 8} ${result.qr.matrix.length + 8}`}
                width={size}
                height={size}
                role="img"
                aria-label={t.preview}
                shapeRendering="crispEdges"
              >
                <rect x="-4" y="-4" width={result.qr.matrix.length + 8} height={result.qr.matrix.length + 8} fill="#fff" />
                {result.qr.matrix.map((row, rowIndex) => row.map((dark, columnIndex) =>
                  dark ? <rect key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} width="1" height="1" fill="#000" /> : null
                ))}
              </svg>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">{t.version(result.qr.version)}</p>
            </div>
          ) : (
            <p className="text-center text-sm text-[var(--muted)]">{t.emptyResult}</p>
          )}
        </div>
      </div>
    </section>
  );
}
