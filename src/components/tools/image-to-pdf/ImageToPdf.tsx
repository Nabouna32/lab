"use client";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { createImagePdf, type PdfPageSize } from "@/lib/image-to-pdf";
const MAX_FILES = 10, MAX_FILE_BYTES = 25 * 1024 * 1024, MAX_BATCH_BYTES = 50 * 1024 * 1024, MAX_PIXELS = 80_000_000, MAX_DIMENSION = 2400;
async function fileToJpeg(file: File): Promise<{ jpegBytes: Uint8Array; width: number; height: number }> {
 const bitmap = await createImageBitmap(file);
 try {
  if (bitmap.width * bitmap.height > MAX_PIXELS) throw new Error("dimensions");
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)), width = Math.max(1, Math.round(bitmap.width * scale)), height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d"); if (!context) throw new Error("canvas");
  context.fillStyle = "#fff"; context.fillRect(0, 0, width, height); context.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("encode")), "image/jpeg", 0.92));
  return { jpegBytes: new Uint8Array(await blob.arrayBuffer()), width, height };
 } finally { bitmap.close(); }
}
export default function ImageToPdf() {
 const locale = useLocale(), fr = locale === "fr";
 const [files, setFiles] = useState<File[]>([]), [pageSize, setPageSize] = useState<PdfPageSize>("a4"), [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null), [done, setDone] = useState(false);
 function selectFiles(selection: FileList | null) {
  if (!selection?.length) return;
  const selected = Array.from(selection);
  if (selected.length > MAX_FILES) { setError(fr ? "Sélectionnez 10 images maximum." : "Select up to 10 images."); return; }
  if (selected.some((file) => file.size > MAX_FILE_BYTES) || selected.reduce((sum, file) => sum + file.size, 0) > MAX_BATCH_BYTES) { setError(fr ? "Limite : 25 Mo par image et 50 Mo au total." : "Limit: 25 MB per image and 50 MB total."); return; }
  const valid = selected.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type));
  setFiles(valid); setDone(false); setError(valid.length === selected.length ? null : (fr ? "Seuls JPEG, PNG et WebP sont acceptés." : "Only JPEG, PNG, and WebP are supported."));
 }
 function moveFile(index: number, offset: -1 | 1) {
  const target = index + offset;
  if (target < 0 || target >= files.length) return;
  setFiles((current) => {
   if (target >= current.length) return current;
   const next = [...current];
   [next[index], next[target]] = [next[target], next[index]];
   return next;
  });
  setDone(false);
 }
 async function convert() {
  if (!files.length || busy) return;
  setBusy(true); setError(null); setDone(false);
  try {
   const pages = []; for (const file of files) pages.push(await fileToJpeg(file));
   const pdf = createImagePdf(pages, pageSize), pdfBuffer = new ArrayBuffer(pdf.byteLength);
   new Uint8Array(pdfBuffer).set(pdf);
   const url = URL.createObjectURL(new Blob([pdfBuffer], { type: "application/pdf" }));
   const anchor = document.createElement("a"); anchor.href = url; anchor.download = "loculary-images.pdf"; anchor.click();
   window.setTimeout(() => URL.revokeObjectURL(url), 1000); setDone(true);
  } catch { setError(fr ? "Impossible de convertir ces images. Essayez des fichiers moins volumineux." : "Could not convert these images. Try smaller files."); }
  finally { setBusy(false); }
 }
 return <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"><div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:p-8">
 <div className="space-y-5"><label htmlFor="image-to-pdf-files" className="block cursor-pointer rounded-[var(--shape-corner-medium)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
 <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--shape-corner-large)] bg-[var(--primary-container)] text-[var(--on-primary-container)]" aria-hidden="true"><MaterialIcon name="picture_as_pdf" size={24} /></span><span className="block font-semibold">{fr ? "Choisir les images" : "Choose images"}</span><span className="mt-1 block text-sm text-[var(--muted)]">{fr ? "JPEG, PNG ou WebP · jusqu’à 10 images" : "JPEG, PNG, or WebP · up to 10 images"}</span><input id="image-to-pdf-files" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => selectFiles(event.target.files)} /></label>
 <div><label htmlFor="image-to-pdf-size" className="mb-2 block text-sm font-semibold">{fr ? "Format de page" : "Page size"}</label><select id="image-to-pdf-size" value={pageSize} onChange={(event) => setPageSize(event.target.value as PdfPageSize)} className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"><option value="a4">A4</option><option value="letter">{fr ? "Lettre (Letter)" : "Letter"}</option></select><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{fr ? "Chaque image occupe une page. L’orientation s’adapte automatiquement, sans déformation." : "Each image gets one page. Orientation adjusts automatically without distortion."}</p></div>
 <Button type="button" disabled={!files.length || busy} onClick={() => void convert()}>{busy ? (fr ? "Création du PDF…" : "Creating PDF…") : (fr ? "Télécharger le PDF" : "Download PDF")}</Button>{error && <p role="alert" className="text-sm font-medium text-[var(--error)]">{error}</p>}{done && <p role="status" className="text-sm font-medium text-[var(--success)]">{fr ? "PDF téléchargé." : "PDF downloaded."}</p>}</div>
 <div className="space-y-3"><h2 className="text-lg font-semibold">{fr ? "Ordre des pages" : "Page order"}</h2>{files.length ? <ol className="space-y-2">{files.map((file, index) => <li key={file.name + "-" + file.size + "-" + index} className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-sm font-bold">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span><span className="shrink-0 text-xs text-[var(--muted)]">{(file.size / 1048576).toFixed(1)} MB</span><span className="flex shrink-0 gap-1"><button type="button" disabled={index === 0} aria-label={fr ? `Déplacer ${file.name} vers le haut` : `Move ${file.name} up`} onClick={() => moveFile(index, -1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-sm disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]" title={fr ? "Déplacer vers le haut" : "Move up"}><MaterialIcon name="keyboard_arrow_up" size={20} /></button><button type="button" disabled={index === files.length - 1} aria-label={fr ? `Déplacer ${file.name} vers le bas` : `Move ${file.name} down`} onClick={() => moveFile(index, 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-sm disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]" title={fr ? "Déplacer vers le bas" : "Move down"}><MaterialIcon name="keyboard_arrow_down" size={20} /></button></span></li>)}</ol> : <p className="rounded-xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">{fr ? "Vos images apparaîtront ici, dans l’ordre sélectionné." : "Your images will appear here in the selected order."}</p>}<p className="text-xs leading-5 text-[var(--muted)]">{fr ? "Traitement 100 % local. Aucun téléversement ni stockage distant. La transparence devient blanche." : "100% local processing. No uploads or remote storage. Transparency becomes white."}</p></div>
 </div></section>;
}
