"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { Button } from "@/components/ui/Button";
import { getContactSheetLayout } from "@/lib/image-contact-sheet";

const MAX_FILES = 20;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_BATCH_BYTES = 50 * 1024 * 1024;
const MAX_PIXELS = 80_000_000;
const MAX_SOURCE_DIMENSION = 2400;

type SheetOptions = { columns: 2 | 3 | 4; labels: boolean; background: "white" | "soft" };

export default function ImageContactSheet() {
  const locale = useLocale();
  const fr = locale === "fr";
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<SheetOptions>({ columns: 3, labels: true, background: "white" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function selectFiles(selection: FileList | null) {
    if (!selection?.length) return;
    const selected = Array.from(selection);
    if (selected.length > MAX_FILES) { setError(fr ? "Sélectionnez 20 images maximum." : "Select up to 20 images."); return; }
    if (selected.some((file) => file.size > MAX_FILE_BYTES) || selected.reduce((sum, file) => sum + file.size, 0) > MAX_BATCH_BYTES) {
      setError(fr ? "Limite : 15 Mo par image et 50 Mo au total." : "Limit: 15 MB per image and 50 MB total."); return;
    }
    if (!selected.every((file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type))) {
      setError(fr ? "Formats acceptés : JPEG, PNG, WebP et GIF." : "Supported formats: JPEG, PNG, WebP, and GIF."); return;
    }
    setFiles(selected); setError(null); setDone(false);
    setPreviewUrl(null);
  }

  function updateOptions(patch: Partial<SheetOptions>) {
    setOptions((current) => ({ ...current, ...patch }));
    setDone(false);
    setPreviewUrl(null);
  }

  async function generate() {
    if (!files.length || busy) return;
    setBusy(true); setError(null); setDone(false);
    try {
      const layout = getContactSheetLayout(files.length, options.columns);
      const canvas = document.createElement("canvas");
      canvas.width = layout.width; canvas.height = layout.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas");
      context.fillStyle = options.background === "white" ? "#ffffff" : "#f1f3f4";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const bitmap = await createImageBitmap(file);
        try {
          if (bitmap.width * bitmap.height > MAX_PIXELS) throw new Error("dimensions");
          const ratio = Math.min(1, MAX_SOURCE_DIMENSION / Math.max(bitmap.width, bitmap.height));
          const sourceWidth = bitmap.width * ratio;
          const sourceHeight = bitmap.height * ratio;
          const maxWidth = layout.tileWidth - 32;
          const maxHeight = options.labels ? 210 : layout.tileHeight - 40;
          const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
          const drawWidth = Math.max(1, Math.round(sourceWidth * scale));
          const drawHeight = Math.max(1, Math.round(sourceHeight * scale));
          const tileX = (index % layout.columns) * layout.tileWidth;
          const tileY = Math.floor(index / layout.columns) * layout.tileHeight;
          const x = tileX + (layout.tileWidth - drawWidth) / 2;
          const y = tileY + 12 + (maxHeight - drawHeight) / 2;
          context.drawImage(bitmap, x, y, drawWidth, drawHeight);
          if (options.labels) {
            context.fillStyle = "#202124"; context.font = "14px sans-serif"; context.textAlign = "center";
            const name = file.name.length > 42 ? file.name.slice(0, 39) + "…" : file.name;
            context.fillText(name, tileX + layout.tileWidth / 2, tileY + layout.tileHeight - 20, layout.tileWidth - 24);
          }
        } finally { bitmap.close(); }
      }
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("encode")), "image/png"));
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setDone(true);
    } catch (caught) {
      const reason = caught instanceof Error && caught.message === "dimensions";
      const detail = caught instanceof Error ? " [" + caught.name + ": " + caught.message + "]" : "";
      setError((reason
        ? (fr ? "Une image dépasse la limite de dimensions autorisée." : "An image exceeds the allowed dimension limit.")
        : (fr ? "Impossible de créer la planche. Essayez des images moins volumineuses." : "Could not create the contact sheet. Try smaller images.")) + detail);
    } finally { setBusy(false); }
  }

  function download() {
    if (!previewUrl) return;
    const anchor = document.createElement("a"); anchor.href = previewUrl; anchor.download = "loculary-planche-contact.png"; anchor.click();
  }

  return <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"><div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-8">
    <div className="space-y-5">
      <label htmlFor="contact-sheet-files" className="block cursor-pointer rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-2xl" aria-hidden="true">🖼️</span>
        <span className="block font-semibold">{fr ? "Choisir les images" : "Choose images"}</span>
        <span className="mt-1 block text-sm text-[var(--muted)]">{fr ? "JPEG, PNG, WebP ou GIF · jusqu’à 20 images" : "JPEG, PNG, WebP, or GIF · up to 20 images"}</span>
        <input id="contact-sheet-files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(event) => selectFiles(event.target.files)} />
      </label>
      <div><label htmlFor="contact-sheet-columns" className="mb-2 block text-sm font-semibold">{fr ? "Colonnes" : "Columns"}</label><select id="contact-sheet-columns" value={options.columns} onChange={(event) => updateOptions({ columns: Number(event.target.value) as SheetOptions["columns"] })} className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
      <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={options.labels} onChange={(event) => updateOptions({ labels: event.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />{fr ? "Afficher les noms de fichiers" : "Show filenames"}</label>
      <div><label htmlFor="contact-sheet-background" className="mb-2 block text-sm font-semibold">{fr ? "Fond" : "Background"}</label><select id="contact-sheet-background" value={options.background} onChange={(event) => updateOptions({ background: event.target.value as SheetOptions["background"] })} className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"><option value="white">{fr ? "Blanc" : "White"}</option><option value="soft">{fr ? "Gris clair" : "Soft gray"}</option></select></div>
      <Button type="button" variant="filled" disabled={!files.length || busy} onClick={() => void generate()}>{busy ? (fr ? "Création de la planche…" : "Creating contact sheet…") : (fr ? "Générer l’aperçu" : "Generate contact sheet")}</Button>
      {done && previewUrl && <Button type="button" variant="tonal" onClick={download}>{fr ? "Télécharger le PNG" : "Download PNG"}</Button>}
      {error && <p role="alert" className="text-sm font-medium text-[var(--error)]">{error}</p>}
      {done && <p role="status" className="text-sm font-medium text-[var(--success)]">{fr ? "Planche créée. Vos fichiers restent sur votre appareil." : "Contact sheet created. Your files stay on your device."}</p>}
      <p className="text-xs leading-5 text-[var(--muted)]">{fr ? "Traitement local · 20 images maximum · 50 Mo au total. Les GIF animés utilisent leur première image." : "Local processing · up to 20 images · 50 MB total. Animated GIFs use their first frame."}</p>
    </div>
    <div className="min-w-0 space-y-3"><h2 className="text-lg font-semibold">{fr ? "Aperçu de la planche" : "Contact sheet preview"}</h2>{previewUrl ? <img src={previewUrl} alt={fr ? "Planche de " + files.length + " images, " + options.columns + " colonnes" : "Contact sheet of " + files.length + " images, " + options.columns + " columns"} className="block max-h-[36rem] max-w-full rounded-xl border border-[var(--border)] object-contain" /> : <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center text-sm text-[var(--muted)]">{fr ? "Sélectionnez des images puis générez la planche pour voir le résultat ici." : "Choose images and generate the sheet to preview it here."}</div>}{files.length > 0 && <p className="text-xs text-[var(--muted)]">{fr ? files.length + " image" + (files.length > 1 ? "s" : "") + " sélectionnée" + (files.length > 1 ? "s" : "") : files.length + " image" + (files.length > 1 ? "s" : "") + " selected"}</p>}</div>
  </div></section>;
}
