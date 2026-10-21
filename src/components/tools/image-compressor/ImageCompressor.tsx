"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { calculateReductionPercent, compressImageFile, formatBytes, getOutputExtension, type ImageOutputFormat } from "@/lib/image-compressor";
import { createZipArchive } from "@/lib/zip-archive";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_BATCH_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 10;

type ImageResult = {
  file: File;
  result?: { url: string; blob: Blob; width: number; height: number; mimeType: string };
  error?: string;
};

export default function ImageCompressor() {
  const locale = useLocale();
  const t = getToolMessages(locale).imageCompressor;
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<ImageOutputFormat>("webp");
  const [quality, setQuality] = useState(0.8);
  const [maxDimension, setMaxDimension] = useState<number | null>(2400);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [archiveBusy, setArchiveBusy] = useState(false);

  useEffect(() => {
    if (files.length === 0) return;
    let cancelled = false;
    const urls: string[] = [];
    async function processBatch() {
      const completed: ImageResult[] = [];
      for (const file of files) {
        if (cancelled) return;
        try {
          const next = await compressImageFile(file, { format, quality, maxDimension });
          if (cancelled) return;
          const url = URL.createObjectURL(next.blob);
          urls.push(url);
          completed.push({ file, result: { ...next, url } });
        } catch {
          completed.push({ file, error: t.invalid });
        }
        if (!cancelled) setResults([...completed]);
      }
      if (!cancelled) setBusy(false);
    }

    void processBatch();
    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, format, quality, maxDimension, t.invalid]);

  function selectFiles(selection: FileList | null) {
    if (!selection?.length) return;
    const selected = Array.from(selection);
    if (selected.length > MAX_FILES) {
      setFiles([]);
      setResults([]);
      setBusy(false);
      setError(t.tooMany);
      return;
    }
    if (selected.some((file) => file.size > MAX_FILE_BYTES) ||
        selected.reduce((total, file) => total + file.size, 0) > MAX_BATCH_BYTES) {
      setFiles([]);
      setResults([]);
      setBusy(false);
      setError(t.tooLarge);
      return;
    }
    const valid = selected.filter((file) => file.type.startsWith("image/"));
    setError(valid.length === selected.length ? null : t.invalidType);
    setResults([]);
    setBusy(valid.length > 0);
    setFiles(valid);
  }

  async function downloadArchive() {
    const successful = results.filter((item) => item.result);
    if (successful.length === 0 || archiveBusy) return;
    setArchiveBusy(true);
    setError(null);
    try {
      const entries = successful.map((item) => ({
        name: item.file.name.replace(/\.[^.]+$/, "") + "-compressed." + getOutputExtension(item.result!.mimeType),
        blob: item.result!.blob,
      }));
      const archive = await createZipArchive(entries);
      const url = URL.createObjectURL(archive);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "loculary-images.zip";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError(t.archiveError);
    } finally {
      setArchiveBusy(false);
    }
  }

  function reset() {
    setFiles([]);
    setResults([]);
    setError(null);
    setBusy(false);
    setArchiveBusy(false);
  }

  const successful = results.filter((item) => item.result);
  const originalBytes = successful.reduce((sum, item) => sum + item.file.size, 0);
  const compressedBytes = successful.reduce((sum, item) => sum + (item.result?.blob.size ?? 0), 0);

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8">
        <div className="space-y-5">
          <label htmlFor="image-compressor-file" className="block cursor-pointer rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] focus-within:border-[var(--accent)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--focus-ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--surface)]">
            <span className="block text-sm font-semibold text-[var(--foreground)]">{t.input}</span>
            <span className="mt-2 block text-sm text-[var(--muted)]">{t.inputHint}</span>
            <input id="image-compressor-file" type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { selectFiles(event.target.files); event.target.value = ""; }} />
          </label>

          {files.length > 0 && <p className="text-sm text-[var(--muted)]">{t.selectedCount(files.length)} · {formatBytes(files.reduce((sum, file) => sum + file.size, 0))}</p>}

          <div className="grid gap-4 sm:grid-cols-3">
            <Select id="image-compressor-format" label={t.format} value={format} onChange={(event) => { setError(null); setResults([]); setBusy(files.length > 0); setFormat(event.target.value as ImageOutputFormat); }}>
              <option value="webp">WebP</option><option value="jpeg">JPEG</option><option value="png">PNG</option>
            </Select>
            <Select id="image-compressor-dimension" label={t.maxDimension} value={maxDimension ?? "original"} onChange={(event) => { setError(null); setResults([]); setBusy(files.length > 0); setMaxDimension(event.target.value === "original" ? null : Number(event.target.value)); }}>
              <option value="1200">1200 px</option><option value="2400">2400 px</option><option value="3200">3200 px</option><option value="original">{t.original}</option>
            </Select>
            <Slider inputId="image-compressor-quality" label={t.quality} value={Math.round(quality * 100)} valueLabel={Math.round(quality * 100) + "%"} min={10} max={100} step={5} description={t.qualityHint} onValueChange={(nextValue) => { setError(null); setResults([]); setBusy(files.length > 0); setQuality(nextValue / 100); }} />
          </div>

          {busy && <ProgressIndicator label={t.processing} className="mt-1" />}
          {error && <p role="alert" className="text-sm font-medium text-[var(--danger)]">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={downloadArchive} disabled={successful.length === 0 || busy || archiveBusy}>{archiveBusy ? t.archivePreparing : t.downloadArchive}</Button>
            <ClearButton onClear={reset} disabled={files.length === 0 && results.length === 0 && !error} label={t.reset} />
          </div>

          {successful.length > 0 && !busy && (
            <>
              <p className="text-sm text-[var(--muted)]">{t.completedCount(successful.length, results.length)}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Result label={t.originalSize} value={formatBytes(originalBytes)} />
                <Result label={t.compressedSize} value={formatBytes(compressedBytes)} />
                <Result label={t.reduction} value={calculateReductionPercent(originalBytes, compressedBytes).toFixed(1) + "%"} />
              </div>
            </>
          )}
        </div>

        <div className="min-w-0 space-y-3 border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          {results.length === 0 ? (
            <div className="flex min-h-72 items-center justify-center"><p className="text-center text-sm text-[var(--muted)]">{t.emptyResult}</p></div>
          ) : results.map((item, index) => (
            <article key={item.file.name + "-" + item.file.lastModified + "-" + index} className="flex min-w-0 items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3">
              {item.result ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.result.url} alt="" className="h-16 w-16 shrink-0 rounded object-contain" />
              ) : <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-[var(--surface)] text-xl">🖼</div>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{item.file.name}</p>
                {item.result ? <p className="mt-1 text-xs text-[var(--muted)]">{formatBytes(item.file.size)} → {formatBytes(item.result.blob.size)} · {item.result.width} × {item.result.height} px</p>
                  : item.error ? <p className="mt-1 text-xs text-[var(--danger)]">{item.error}</p>
                    : <p className="mt-1 text-xs text-[var(--muted)]">{t.processing}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3"><p className="text-xs text-[var(--muted)]">{label}</p><p className="mt-1 font-semibold text-[var(--foreground)]">{value}</p></div>;
}
