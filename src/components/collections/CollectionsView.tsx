"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { useCollections } from "./CollectionsProvider";
import { CollectionIcon } from "@/components/ui/CollectionIcon";
import { Button, FilledTonalButton, OutlinedButton, TextButton } from "@/components/ui/Button";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { createLocalCollectionsBackup, MAX_LOCAL_COLLECTIONS, MAX_LOCAL_COLLECTIONS_BACKUP_CHARS, parseLocalCollectionsBackup, type StoredLocalCollection } from "@/lib/collections/local-collections";

export type CollectionTool = { id: string; icon: string; name: string; description: string; href: string };

export default function CollectionsView({ locale, tools }: { locale: Locale; tools: CollectionTool[] }) {
  const data = useCollections();
  const [name, setName] = useState("");
  const [synchronize, setSynchronize] = useState(true);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [pendingDeleteCollection, setPendingDeleteCollection] = useState<{ id: string; name: string } | null>(null);
  const [addingTool, setAddingTool] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
  const creatingRef = useRef(false);
  const importFileRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<{ collections: StoredLocalCollection[]; ignoredToolCount: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const addingRef = useRef(false);
  const fr = locale === "fr";
  const copy = {
    title: fr ? "Mes collections" : "My collections",
    description: fr ? "Rassemble tes outils par projet, besoin ou envie. Tes collections restent privées jusqu’à ce que tu décides de les partager." : "Group tools by project, need, or idea. Collections stay private until you choose to share them.",
    create: fr ? "Créer une collection" : "Create a collection",
    placeholder: fr ? "Nom de la collection" : "Collection name",
    signIn: fr ? "Connecte-toi pour synchroniser une collection entre tes appareils." : "Sign in to sync a collection across your devices.",
    syncLabel: fr ? "Synchroniser sur mes appareils" : "Sync across my devices",
    localOnly: fr ? "Sur cet appareil" : "On this device",
    localLimit: fr ? `Limite atteinte : ${MAX_LOCAL_COLLECTIONS} collections locales sur cet appareil.` : `Limit reached: ${MAX_LOCAL_COLLECTIONS} local collections on this device.`,
    accountOnly: fr ? "Synchronisée" : "Synced",
    localNote: fr ? "Les collections locales restent dans ce navigateur. Elles contiennent uniquement les noms des collections et les identifiants des outils, jamais les données saisies dans les outils." : "Local collections stay in this browser. They contain only collection names and tool IDs, never data entered into tools.",
    accountNote: fr ? "Tu peux aussi créer des collections locales, réservées à cet appareil, en décochant la synchronisation." : "You can also create device-only collections by turning sync off.",
    empty: fr ? "Pas encore de collection" : "No collections yet",
    emptyHelp: fr ? "Crée une collection pour réunir les outils qui vont ensemble." : "Create a collection to bring related tools together.",
    rename: fr ? "Renommer" : "Rename",
    remove: fr ? "Supprimer" : "Delete",
    deleteCollectionTitle: fr ? "Supprimer cette collection ?" : "Delete this collection?",
    deleteCollectionDescription: (name: string) => fr ? `La collection « ${name} » et sa liste d’outils seront supprimées. Les outils resteront disponibles dans Loculary.` : `The collection “${name}” and its tool list will be deleted. The tools will remain available in Loculary.`,
    deleteCollectionConfirm: fr ? "Supprimer la collection" : "Delete collection",
    add: fr ? "Ajouter un outil" : "Add a tool",
    choose: fr ? "Choisir un outil…" : "Choose a tool…",
    save: fr ? "Ajouter" : "Add",
    share: fr ? "Partager par lien" : "Share by link",
    stopShare: fr ? "Désactiver le lien" : "Disable link",
    private: fr ? "Privée" : "Private",
    shared: fr ? "Partage activé" : "Link sharing on",
    open: fr ? "Ouvrir" : "Open",
    removeTool: fr ? "Retirer" : "Remove",
    copy: fr ? "Copier le lien" : "Copy link",
    copied: fr ? "Lien copié" : "Link copied",
    error: fr ? "Une erreur est survenue. Réessaie." : "Something went wrong. Try again.",
    backupExport: fr ? "Exporter les collections locales" : "Export local collections",
    backupImport: fr ? "Importer une sauvegarde JSON" : "Import JSON backup",
    backupHelp: fr ? "Sauvegarde uniquement les collections de cet appareil. Les collections synchronisées et les données saisies dans les outils ne sont jamais incluses." : "Back up only collections stored on this device. Synced collections and data entered into tools are never included.",
    backupTooLarge: fr ? "Fichier trop volumineux. La limite est de 1 Mo." : "File is too large. The limit is 1 MB.",
    backupInvalidJson: fr ? "Ce fichier n’est pas un JSON valide." : "This file is not valid JSON.",
    backupUnsupported: fr ? "Cette sauvegarde Loculary n’est pas prise en charge." : "This Loculary backup format is not supported.",
    backupInvalidCollections: fr ? "La sauvegarde contient des collections invalides." : "The backup contains invalid collections.",
    backupEmpty: fr ? "Cette sauvegarde ne contient aucune collection." : "This backup contains no collections.",
    backupReadError: fr ? "Impossible de lire ce fichier." : "Could not read this file.",
    backupPreview: (count: number) => fr ? `${count} collection(s) prête(s) à importer. Elles seront ajoutées localement, sans remplacer tes collections actuelles.` : `${count} collection(s) ready to import. They will be added locally without replacing your current collections.`,
    backupConfirm: fr ? "Restaurer les collections" : "Restore collections",
    backupCancel: fr ? "Annuler" : "Cancel",
    backupImported: (count: number, skipped: number, ignoredTools: number) => {
      const result = fr ? `${count} collection(s) importée(s).` : `${count} collection(s) imported.`;
      const capacity = skipped ? (fr ? ` ${skipped} ignorée(s), car la limite locale est atteinte.` : ` ${skipped} skipped because the local limit was reached.`) : "";
      const toolsNote = ignoredTools ? (fr ? ` ${ignoredTools} référence(s) à des outils indisponibles ignorée(s).` : ` ${ignoredTools} reference(s) to unavailable tools ignored.`) : "";
      return result + capacity + toolsNote;
    },
  };
  const active = data.collections.find((collection) => collection.id === activeCollection);
  const localCollectionCount = data.collections.filter((collection) => collection.storage === "local").length;
  const localLimitReached = localCollectionCount >= MAX_LOCAL_COLLECTIONS;

  function confirmDeleteCollection() {
    const pending = pendingDeleteCollection;
    if (!pending) return;
    void data.deleteCollection(pending.id).then((ok) => {
      if (ok) {
        setActiveCollection((current) => current === pending.id ? null : current);
        setMessage("");
      } else {
        setMessage(copy.error);
      }
    }).catch(() => setMessage(copy.error)).finally(() => setPendingDeleteCollection(null));
  }

  async function create() {
    if (creatingRef.current || !name.trim() || data.loading) return;
    creatingRef.current = true;
    setCreating(true);
    try {
      if (await data.createCollection(name, Boolean(data.userId && synchronize))) { setName(""); setMessage(""); }
      else setMessage(copy.error);
    } catch {
      setMessage(copy.error);
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  }
  async function add() {
    if (addingRef.current || !active || !addingTool) return;
    addingRef.current = true;
    setAdding(true);
    try {
      if (await data.addTool(active.id, addingTool)) { setAddingTool(""); setMessage(""); }
      else setMessage(copy.error);
    } catch {
      setMessage(copy.error);
    } finally {
      addingRef.current = false;
      setAdding(false);
    }
  }
  function exportLocalBackup() {
    const records: StoredLocalCollection[] = data.collections
      .filter((collection) => collection.storage === "local")
      .map((collection) => ({
        id: collection.id,
        name: collection.name,
        created_at: collection.created_at,
        tool_ids: collection.user_collection_items.map((item) => item.tool_id),
      }));
    if (!records.length) return;

    const blob = new Blob([createLocalCollectionsBackup(records)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `loculary-collections-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("");
  }

  async function readBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPendingImport(null);
    setMessage("");
    if (file.size > MAX_LOCAL_COLLECTIONS_BACKUP_CHARS) {
      setMessage(copy.backupTooLarge);
      return;
    }
    try {
      const result = parseLocalCollectionsBackup(await file.text(), tools.map((tool) => tool.id));
      if (!result.ok) {
        const messages = {
          "too-large": copy.backupTooLarge,
          "invalid-json": copy.backupInvalidJson,
          "unsupported-format": copy.backupUnsupported,
          "invalid-collections": copy.backupInvalidCollections,
          empty: copy.backupEmpty,
        } as const;
        setMessage(messages[result.reason]);
        return;
      }
      setPendingImport({ collections: result.collections, ignoredToolCount: result.ignoredToolCount });
      setMessage(copy.backupPreview(result.collections.length));
    } catch {
      setMessage(copy.backupReadError);
    }
  }

  async function confirmImport() {
    if (!pendingImport || importing) return;
    setImporting(true);
    try {
      const imported = await data.importLocalCollections(pendingImport.collections);
      if (!imported) {
        setMessage(localLimitReached ? copy.localLimit : copy.error);
        return;
      }
      setMessage(copy.backupImported(imported, pendingImport.collections.length - imported, pendingImport.ignoredToolCount));
      setPendingImport(null);
    } catch {
      setMessage(copy.error);
    } finally {
      setImporting(false);
    }
  }

  async function copyLink(token: string) {
    try {
      await navigator.clipboard.writeText(new URL(`/${locale}/collection-partagee/${token}`, window.location.origin).toString());
      setMessage(copy.copied);
    } catch { setMessage(copy.error); }
  }

  return (
    <main className="mx-auto min-h-[60svh] max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-7 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
        <p className="m3-type-label-small uppercase text-[var(--accent)]">Loculary</p>
        <h1 className="m3-type-headline-large mt-2">{copy.title}</h1>
        <p className="m3-type-body-medium mt-2 max-w-2xl text-[var(--muted)]">{copy.description}</p>
      </header>

      {data.error && <p role="status" className="m3-type-body-medium mb-5 rounded-2xl border border-[var(--danger)]/40 bg-[var(--surface)] px-4 py-3 text-[var(--danger)]">{copy.error}</p>}
      {message && <p role="status" className="m3-type-label-large mb-5 text-[var(--accent)]">{message}</p>}
      <form className="mb-6 flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void create(); }}>
        <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required placeholder={copy.placeholder} aria-label={copy.placeholder} className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-lg)] border border-[var(--outline)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-standard)] hover:border-[var(--border-strong)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]" />
            {data.userId && <label className="m3-type-body-medium flex min-h-12 items-center gap-2 text-[var(--muted)] sm:px-2"><input type="checkbox" checked={synchronize} onChange={(event) => setSynchronize(event.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />{copy.syncLabel}</label>}
        <Button type="submit" disabled={data.loading || creating || !name.trim() || ((!data.userId || !synchronize) && localLimitReached)}>{creating ? (fr ? "Création…" : "Creating…") : copy.create}</Button>
      </form>
      <p className="m3-type-body-medium mb-3 text-[var(--muted)]">{copy.localNote} {data.userId ? copy.accountNote : copy.signIn}</p>
      <section aria-label={fr ? "Sauvegarde des collections locales" : "Local collection backup"} className="mb-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="mb-3 text-sm leading-6 text-[var(--muted)]">{copy.backupHelp}</p>
        <input
          ref={importFileRef}
          id="local-collections-import-file"
          type="file"
          accept="application/json,.json"
          aria-label={copy.backupImport}
          className="sr-only"
          onChange={(event) => void readBackup(event)}
        />
        <div className="flex flex-wrap gap-2">
          <OutlinedButton type="button" disabled={data.loading || localCollectionCount === 0} onClick={exportLocalBackup}>{copy.backupExport} ({localCollectionCount})</OutlinedButton>
          <OutlinedButton type="button" disabled={data.loading || importing} onClick={() => importFileRef.current?.click()}>{copy.backupImport}</OutlinedButton>
        </div>
        {pendingImport && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
            <Button type="button" disabled={importing || localLimitReached} onClick={() => void confirmImport()}>{importing ? (fr ? "Restauration…" : "Restoring…") : copy.backupConfirm}</Button>
            <TextButton type="button" disabled={importing} onClick={() => { setPendingImport(null); setMessage(""); }}>{copy.backupCancel}</TextButton>
          </div>
        )}
      </section>
      {((!data.userId || !synchronize) && localLimitReached) && <p role="status" className="m3-type-body-medium mb-5 text-[var(--muted)]">{copy.localLimit}</p>}

      {data.loading ? <p className="m3-type-body-medium py-8 text-center text-[var(--muted)]">{fr ? "Chargement…" : "Loading…"}</p> : data.collections.length === 0 ? (
            <section className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-10 text-center">
              <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><CollectionIcon className="h-8 w-8" /></span>
              <h2 className="m3-type-headline-small mt-4">{copy.empty}</h2><p className="m3-type-body-medium mx-auto mt-2 max-w-lg text-[var(--muted)]">{copy.emptyHelp}</p>
            </section>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.25fr)]">
              <ul className="flex flex-col gap-2">
                {data.collections.map((collection) => (
                  <li key={collection.id}>
                    <button type="button" onClick={() => setActiveCollection(collection.id)} aria-pressed={active?.id === collection.id} className={"w-full rounded-[var(--radius-lg)] border p-4 text-left transition-[background-color,border-color,transform] duration-200 " + (active?.id === collection.id ? "border-[var(--primary)] bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-[var(--shadow-sm)]" : "border-[var(--outline-variant)] bg-[var(--surface)] hover:bg-[var(--surface-soft)]")}>
                      <span className="m3-type-title-medium flex items-center justify-between gap-3"><span className="truncate">{collection.name}</span><span className="m3-type-label-medium text-[var(--muted)]">{collection.user_collection_items.length}</span></span>
                      <span className="m3-type-label-medium mt-2 block text-[var(--muted)]">{collection.storage === "local" ? copy.localOnly : collection.share_token ? copy.shared : copy.private}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {active && (
                <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0"><h2 className="m3-type-headline-small break-words">{active.name}</h2><p className="m3-type-body-medium mt-1 text-[var(--muted)]">{active.user_collection_items.length} {fr ? "outils" : "tools"}</p></div>
                    <TextButton type="button" onClick={() => { const next = window.prompt(copy.rename, active.name); if (next?.trim()) void data.renameCollection(active.id, next).then((ok) => { if (!ok) setMessage(copy.error); }); }}>{copy.rename}</TextButton>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <select value={addingTool} onChange={(event) => setAddingTool(event.target.value)} aria-label={copy.add} className="m3-type-body-medium min-h-12 min-w-0 flex-1 rounded-[var(--radius-lg)] border border-[var(--outline)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] hover:border-[var(--border-strong)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">
                      <option value="">{copy.choose}</option>
                      {tools.filter((tool) => !active.user_collection_items.some((item) => item.tool_id === tool.id)).map((tool) => <option key={tool.id} value={tool.id}>{tool.name}</option>)}
                    </select>
                    <FilledTonalButton type="button" disabled={!addingTool || adding} onClick={() => void add()}>{adding ? (fr ? "Ajout…" : "Adding…") : copy.save}</FilledTonalButton>
                  </div>
                  {active.user_collection_items.length ? <ul className="mt-4 divide-y divide-[var(--border)]">
                    {active.user_collection_items.map((item) => {
                      const tool = tools.find((candidate) => candidate.id === item.tool_id);
                      if (!tool) return null;
                      return <li key={item.tool_id} className="flex items-center gap-3 py-3"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-xl">{tool.icon}</span><div className="min-w-0 flex-1"><Link href={tool.href} className="font-semibold hover:underline">{tool.name}</Link><p className="line-clamp-1 text-xs text-[var(--muted)]">{tool.description}</p></div><TextButton type="button" colors={{ contentColor: "var(--on-surface-variant)" }} className="inline-flex shrink-0 items-center gap-2" onClick={() => void data.removeTool(active.id, item.tool_id)}><MaterialIcon name="delete" size={18} />{copy.removeTool}</TextButton></li>;
                    })}
                  </ul> : <p className="py-6 text-center text-sm text-[var(--muted)]">{copy.emptyHelp}</p>}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
                    {active.storage === "account" && <>
                      <OutlinedButton type="button" onClick={() => void data.toggleSharing(active.id).then((ok) => { if (!ok) setMessage(copy.error); })}>{active.share_token ? copy.stopShare : copy.share}</OutlinedButton>
                      {active.share_token && <Button type="button" onClick={() => void copyLink(active.share_token!)}>{copy.copy}</Button>}
                    </>}
                    <TextButton type="button" colors={{ contentColor: "var(--error)" }} className="inline-flex items-center gap-2" onClick={() => setPendingDeleteCollection({ id: active.id, name: active.name })}><MaterialIcon name="delete" size={18} />{copy.remove}</TextButton>
                  </div>
                </section>
              )}
            </div>
          )}
      <AlertDialog
        open={pendingDeleteCollection !== null}
        title={copy.deleteCollectionTitle}
        description={pendingDeleteCollection ? copy.deleteCollectionDescription(pendingDeleteCollection.name) : ""}
        confirmLabel={copy.deleteCollectionConfirm}
        dismissLabel={fr ? "Annuler" : "Cancel"}
        destructive
        icon={<MaterialIcon name="delete" size={24} className="text-[var(--error)]" />}
        onConfirm={confirmDeleteCollection}
        onDismiss={() => setPendingDeleteCollection(null)}
      />
    </main>
  );
}
