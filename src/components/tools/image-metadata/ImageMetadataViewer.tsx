"use client";

import { useEffect, useRef, useState } from "react";
import { Button, OutlinedButton } from "@/components/ui/Button";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import { ClearButton } from "@/components/ui/ClearButton";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import {
  AnimatedImageUnsupportedError,
  getCleanImageFormat,
  inspectImage,
  isAnimatedImage,
  stripImageMetadata,
  type ImageMetadata,
} from "@/lib/image-metadata";
import { compressImageFile, getOutputExtension, type ImageOutputFormat } from "@/lib/image-compressor";
import { createZipArchive } from "@/lib/zip-archive";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_BATCH_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 10;

type ImageItem = {
  file: File;
  previewUrl: string;
  metadata?: ImageMetadata;
  cleanedBlob?: Blob;
  error?: string;
  cleanError?: string;
};

export default function ImageMetadataViewer() {
  const locale = useLocale();
  const t = getToolMessages(locale).imageMetadata;
  const [items, setItems] = useState<ImageItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [archiveBusy, setArchiveBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimize, setOptimize] = useState(false);
  const [outputFormat, setOutputFormat] = useState<ImageOutputFormat>("webp");
  const [maxDimension, setMaxDimension] = useState<number | null>(2400);
  const [quality, setQuality] = useState(0.8);
  const operationRef = useRef(0);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => () => {
    operationRef.current += 1;
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function releasePreviews() {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
  }

  async function selectFiles(selection: FileList | null) {
    if (!selection?.length) return;
    const operation = ++operationRef.current;
    releasePreviews();
    setItems([]);
    setError(null);

    const selected = Array.from(selection);
    if (selected.length > MAX_FILES) {
      setBusy(false);
      setError(t.tooMany);
      return;
    }
    if (
      selected.some((file) => file.size > MAX_FILE_BYTES) ||
      selected.reduce((total, file) => total + file.size, 0) > MAX_BATCH_BYTES
    ) {
      setBusy(false);
      setError(t.tooLarge);
      return;
    }

    const valid = selected.filter((file) => file.type.startsWith("image/"));
    if (valid.length !== selected.length) setError(t.invalidType);
    if (valid.length === 0) {
      setBusy(false);
      return;
    }

    const initialItems = valid.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.push(previewUrl);
      return { file, previewUrl };
    });
    setItems(initialItems);
    setBusy(true);

    for (const [index, item] of initialItems.entries()) {
      if (operation !== operationRef.current) return;
      try {
        const metadata = await inspectImage(item.file);
        if (operation !== operationRef.current) return;
        setItems((current) => current.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, metadata } : entry,
        ));
      } catch {
        if (operation !== operationRef.current) return;
        setItems((current) => current.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, error: t.invalid } : entry,
        ));
      }
    }
    if (operation === operationRef.current) setBusy(false);
  }

  async function cleanAll() {
    if (busy || !items.some((item) => item.metadata)) return;
    const operation = operationRef.current;
    setBusy(true);
    setError(null);
    setItems((current) => current.map((item) => ({ ...item, cleanedBlob: undefined, cleanError: undefined })));

    for (const [index, item] of items.entries()) {
      if (operation !== operationRef.current) return;
      if (!item.metadata) continue;
      try {
        let blob: Blob;
        if (optimize) {
          if (isAnimatedImage(await item.file.arrayBuffer())) throw new AnimatedImageUnsupportedError();
          // Canvas encoding removes metadata and optimizes in one pass, avoiding a second lossy JPEG encode.
          const optimized = await compressImageFile(item.file, { format: outputFormat, quality, maxDimension });
          blob = optimized.blob;
        } else {
          blob = await stripImageMetadata(item.file);
        }
        if (operation !== operationRef.current) return;
        setItems((current) => current.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, cleanedBlob: blob, cleanError: undefined } : entry,
        ));
      } catch (cause) {
        if (operation !== operationRef.current) return;
        const message = cause instanceof AnimatedImageUnsupportedError ? t.animatedUnsupported : t.invalid;
        setItems((current) => current.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, cleanError: message } : entry,
        ));
      }
    }
    if (operation === operationRef.current) setBusy(false);
  }

  async function downloadArchive() {
    const successful = items.filter((item) => item.cleanedBlob);
    if (successful.length === 0 || archiveBusy || busy) return;
    setArchiveBusy(true);
    setError(null);
    try {
      const entries = successful.map((item) => ({
        name: item.file.name.replace(/\.[^.]+$/, "") + (optimize ? "-prepared." : "-cleaned.") +
          (optimize ? getOutputExtension(item.cleanedBlob!.type) : getCleanImageFormat(item.cleanedBlob!.type).extension),
        blob: item.cleanedBlob!,
      }));
      const archive = await createZipArchive(entries);
      const url = URL.createObjectURL(archive);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = optimize ? "loculary-images-prepared.zip" : "loculary-images-cleaned.zip";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError(t.archiveError);
    } finally {
      setArchiveBusy(false);
    }
  }

  function reset() {
    operationRef.current += 1;
    releasePreviews();
    setItems([]);
    setBusy(false);
    setArchiveBusy(false);
    setError(null);
  }

  const inspected = items.filter((item) => item.metadata);
  const cleaned = items.filter((item) => item.cleanedBlob);
  const exifLabels: Record<string, string> = {
    cameraMake: t.cameraMake,
    cameraModel: t.cameraModel,
    dateTaken: t.dateTaken,
    dateModified: t.dateModified,
    orientation: t.orientation,
    gps: t.gps,
    software: t.software,
  };

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <Column verticalArrangement={Arrangement.spacedBy("var(--space-6)")} className="p-5 sm:p-7 lg:p-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
          <Column verticalArrangement={Arrangement.spacedBy("var(--space-4)")}>
            <label htmlFor="image-metadata-file" className="block cursor-pointer rounded-[var(--shape-corner-medium)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] focus-within:border-[var(--accent)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--focus-ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--surface)]">
              <span className="block text-sm font-semibold text-[var(--foreground)]">{t.input}</span>
              <span className="mt-2 block text-sm text-[var(--muted)]">{t.inputHint}</span>
              <input id="image-metadata-file" type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { void selectFiles(event.target.files); event.target.value = ""; }} />
            </label>
            <p className="text-sm text-[var(--muted)]">🔒 {t.local}</p>
            <p className="text-sm text-[var(--muted)]">{optimize ? t.optimizingHint : t.cleaningHint}</p>
            <Column verticalArrangement={Arrangement.spacedBy("var(--space-3)")} className="rounded-[var(--shape-corner-medium)] border border-[var(--border)] bg-[var(--background)] p-4">
              <label className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                <input type="checkbox" checked={optimize} disabled={busy} onChange={(event) => { setOptimize(event.target.checked); setItems((current) => current.map((item) => ({ ...item, cleanedBlob: undefined, cleanError: undefined }))); }} className="mt-1 accent-[var(--accent)]" />
                <span><span className="block font-semibold">{t.optimizeOption}</span><span className="mt-1 block text-[var(--muted)]">{t.optimizeHint}</span></span>
              </label>
              {optimize && <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1 text-sm"><span className="font-medium text-[var(--foreground)]">{t.outputFormat}</span>
                  <select value={outputFormat} disabled={busy} onChange={(event) => { setOutputFormat(event.target.value as ImageOutputFormat); setItems((current) => current.map((item) => ({ ...item, cleanedBlob: undefined, cleanError: undefined }))); }} className="w-full rounded-[var(--shape-corner-small)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]">
                    <option value="webp">WebP</option><option value="jpeg">JPEG</option><option value="png">PNG</option>
                  </select>
                </label>
                <label className="block space-y-1 text-sm"><span className="font-medium text-[var(--foreground)]">{t.maxDimension}</span>
                  <select value={maxDimension ?? "original"} disabled={busy} onChange={(event) => { setMaxDimension(event.target.value === "original" ? null : Number(event.target.value)); setItems((current) => current.map((item) => ({ ...item, cleanedBlob: undefined, cleanError: undefined }))); }} className="w-full rounded-[var(--shape-corner-small)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]">
                    <option value="1200">1200 px</option><option value="2400">2400 px</option><option value="3200">3200 px</option><option value="original">{t.originalDimension}</option>
                  </select>
                </label>
                <label className="block space-y-1 text-sm sm:col-span-2"><span className="font-medium text-[var(--foreground)]">{t.quality} · {Math.round(quality * 100)}%</span>
                  <input type="range" min="10" max="100" step="5" value={Math.round(quality * 100)} disabled={busy} onChange={(event) => { setQuality(Number(event.target.value) / 100); setItems((current) => current.map((item) => ({ ...item, cleanedBlob: undefined, cleanError: undefined }))); }} className="w-full accent-[var(--accent)]" />
                </label>
              </div>}
            </Column>
            {items.length > 0 && <p className="text-sm text-[var(--muted)]">{t.selectedCount(items.length)} · {formatBytes(items.reduce((sum, item) => sum + item.file.size, 0))}</p>}
            {busy && <ProgressIndicator label={t.stripping} />}
            {error && <p role="alert" className="text-sm font-medium text-[var(--danger)]">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={cleanAll} disabled={busy || inspected.length === 0}>{busy ? t.stripping : optimize ? t.prepare : t.strip}</Button>
              <OutlinedButton type="button" onClick={downloadArchive} disabled={cleaned.length === 0 || busy || archiveBusy}>{archiveBusy ? t.archivePreparing : optimize ? t.downloadPrepared : t.download}</OutlinedButton>
              <ClearButton onClear={reset} disabled={items.length === 0 && !error} label={t.reset} />
            </div>
            {cleaned.length > 0 && !busy && <p role="status" className="text-sm text-[var(--success)]">{t.completedCount(cleaned.length, items.length)}</p>}
          </div>

          <div className="flex min-h-56 items-center justify-center rounded-[var(--shape-corner-medium)] border border-[var(--border)] bg-[var(--background)] p-5">
            <p className="text-center text-sm text-[var(--muted)]">{items.length === 0 ? t.emptyResult : t.batchHint}</p>
          </div>
        </div>

        {items.length > 0 && (
          <Column verticalArrangement={Arrangement.spacedBy("var(--space-3)")}>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">{t.results}</h3>
            {items.map((item, index) => (
              <article key={item.file.name + "-" + item.file.lastModified + "-" + index} className="grid min-w-0 gap-4 rounded-[var(--shape-corner-medium)] border border-[var(--border)] bg-[var(--background)] p-3 sm:grid-cols-[5rem_minmax(0,1fr)] sm:p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.previewUrl} alt="" className="h-20 w-20 rounded object-contain sm:h-20 sm:w-20" />
                <Column verticalArrangement={Arrangement.spacedBy("var(--space-2)")} className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-[var(--foreground)]">{item.file.name}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{formatBytes(item.file.size)}{item.metadata ? " · " + item.metadata.width + " × " + item.metadata.height + " px · " + item.metadata.mimeType : ""}</p>
                    </div>
                    {item.cleanedBlob && <span className="text-xs font-semibold text-[var(--success)]">{optimize ? t.prepared : t.removed}</span>}
                    {item.cleanedBlob && <span className="text-xs text-[var(--muted)]">{formatBytes(item.cleanedBlob.size)} · {item.cleanedBlob.type}</span>}
                  </div>
                  {item.metadata && (
                    <>
                      {item.metadata.exif.gps && <p role="status" className="rounded-[var(--shape-corner-small)] border border-[var(--warning)] bg-[var(--warning-soft)] p-2 text-sm text-[var(--foreground)]">{t.gpsWarning}</p>}
                      {Object.entries(item.metadata.exif).length > 0 ? (
                        <dl className="grid gap-x-4 gap-y-2 rounded-[var(--shape-corner-small)] border border-[var(--border)] p-3 sm:grid-cols-2">
                          {Object.entries(item.metadata.exif).map(([key, value]) => (
                            <div key={key} className="min-w-0">
                              <dt className="text-xs font-medium text-[var(--muted)]">{exifLabels[key] ?? key}</dt>
                              <dd className="break-words text-sm text-[var(--foreground)]">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : <p className="text-sm text-[var(--muted)]">{t.noMetadata}</p>}
                    </>
                  )}
                  {item.error && <p role="alert" className="text-sm text-[var(--danger)]">{item.error}</p>}
                  {item.cleanError && <p role="alert" className="text-sm text-[var(--danger)]">{item.cleanError}</p>}
                </Column>
              </article>
            ))}
          </Column>
        )}
      </Column>
    </section>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  const units = ["KB", "MB", "GB"];
  let value = bytes;
  let index = -1;
  while (value >= 1024 && index < 2) {
    value /= 1024;
    index += 1;
  }
  return value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2) + " " + units[index];
}
