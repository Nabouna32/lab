"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import {
  calculateReductionPercent,
  compressImageFile,
  formatBytes,
  type ImageOutputFormat,
} from "@/lib/image-compressor";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;

export default function ImageCompressor() {
  const locale = useLocale();
  const t = getToolMessages(locale).imageCompressor;
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageOutputFormat>("webp");
  const [quality, setQuality] = useState(0.8);
  const [maxDimension, setMaxDimension] = useState<number | null>(2400);
  const [result, setResult] = useState<{ url: string; blob: Blob; width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setBusy(true);
    setError(null);

    compressImageFile(file, { format, quality, maxDimension })
      .then((next) => {
        if (cancelled) return;
        setResult((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          return { ...next, url: URL.createObjectURL(next.blob) };
        });
      })
      .catch(() => {
        if (!cancelled) {
          setResult(null);
          setError(t.invalid);
        }
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });

    return () => {
      cancelled = true;
    };
  }, [file, format, quality, maxDimension, t.invalid]);

  function selectFile(next: File | null) {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError(t.invalidType);
      setFile(null);
      setResult(null);
      return;
    }
    if (next.size > MAX_FILE_BYTES) {
      setError(t.tooLarge);
      setFile(null);
      setResult(null);
      return;
    }
    setError(null);
    setFile(next);
  }

  async function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  }

  function download() {
    if (!result) return;
    const extension = format === "jpeg" ? "jpg" : format;
    const anchor = document.createElement("a");
    anchor.href = result.url;
    anchor.download = `loculary-compressed.${extension}`;
    anchor.click();
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError(null);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8">
        <div className="space-y-5">
          <label
            htmlFor="image-compressor-file"
            className="block cursor-pointer rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] focus-within:border-[var(--accent)]"
          >
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.input}</span>
            <span className="mt-2 block text-sm text-[var(--muted)]">{t.inputHint}</span>
            <input id="image-compressor-file" type="file" accept="image/*" className="sr-only" onChange={handleFileInput} />
          </label>

          {file && (
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{file.name}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{formatBytes(file.size)}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium text-[var(--foreground)]">
              <span className="mb-2 block">{t.format}</span>
              <select value={format} onChange={(event) => setFormat(event.target.value as ImageOutputFormat)} className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                <option value="webp">WebP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </label>
            <label className="text-sm font-medium text-[var(--foreground)]">
              <span className="mb-2 block">{t.maxDimension}</span>
              <select value={maxDimension ?? "original"} onChange={(event) => setMaxDimension(event.target.value === "original" ? null : Number(event.target.value))} className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                <option value="1200">1200 px</option>
                <option value="2400">2400 px</option>
                <option value="3200">3200 px</option>
                <option value="original">{t.original}</option>
              </select>
            </label>
            <label className="text-sm font-medium text-[var(--foreground)]">
              <span className="mb-2 block">{t.quality}: {Math.round(quality * 100)}%</span>
              <input type="range" min="10" max="100" step="5" value={Math.round(quality * 100)} onChange={(event) => setQuality(Number(event.target.value) / 100)} className="mt-3 w-full" />
              <span className="mt-1 block text-xs text-[var(--muted)]">{t.qualityHint}</span>
            </label>
          </div>

          {error && <p role="alert" className="text-sm font-medium text-[var(--danger)]">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="primary" onClick={download} disabled={!result || busy}>{busy ? t.processing : t.download}</Button>
            <ClearButton onClear={reset} disabled={!file && !result && !error} label={t.reset} />
          </div>

          {result && !busy && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Result label={t.originalSize} value={formatBytes(file?.size ?? 0)} />
              <Result label={t.compressedSize} value={formatBytes(result.blob.size)} />
              <Result label={t.reduction} value={`${calculateReductionPercent(file?.size ?? 0, result.blob.size).toFixed(1)}%`} />
            </div>
          )}
        </div>

        <div className="flex min-h-72 items-center justify-center border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          {result ? (
            <div className="w-full max-w-md space-y-3">
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-2">
                <img src={result.url} alt={t.preview} className="max-h-80 w-full object-contain" />
              </div>
              <p className="text-center text-xs text-[var(--muted)]">{result.width} × {result.height} px</p>
            </div>
          ) : (
            <p className="text-center text-sm text-[var(--muted)]">{t.emptyResult}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3"><p className="text-xs text-[var(--muted)]">{label}</p><p className="mt-1 font-semibold text-[var(--foreground)]">{value}</p></div>;
}
