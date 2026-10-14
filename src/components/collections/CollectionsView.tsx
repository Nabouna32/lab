"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { useCollections } from "./CollectionsProvider";
import { CollectionIcon } from "@/components/ui/CollectionIcon";

export type CollectionTool = { id: string; icon: string; name: string; description: string; href: string };

export default function CollectionsView({ locale, tools }: { locale: Locale; tools: CollectionTool[] }) {
  const data = useCollections();
  const [name, setName] = useState("");
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [addingTool, setAddingTool] = useState("");
  const [message, setMessage] = useState("");
  const fr = locale === "fr";
  const copy = {
    title: fr ? "Mes collections" : "My collections",
    description: fr ? "Rassemble tes outils par projet, besoin ou envie. Tes collections restent privées jusqu’à ce que tu décides de les partager." : "Group tools by project, need, or idea. Collections stay private until you choose to share them.",
    create: fr ? "Créer une collection" : "Create a collection",
    placeholder: fr ? "Nom de la collection" : "Collection name",
    signIn: fr ? "Connecte-toi pour synchroniser tes collections entre tes appareils." : "Sign in to sync collections across your devices.",
    empty: fr ? "Pas encore de collection" : "No collections yet",
    emptyHelp: fr ? "Crée une collection pour réunir les outils qui vont ensemble." : "Create a collection to bring related tools together.",
    rename: fr ? "Renommer" : "Rename",
    remove: fr ? "Supprimer" : "Delete",
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
  };
  const active = data.collections.find((collection) => collection.id === activeCollection);

  async function create() {
    if (await data.createCollection(name)) { setName(""); setMessage(""); }
    else setMessage(copy.error);
  }
  async function add() {
    if (!active || !addingTool) return;
    if (await data.addTool(active.id, addingTool)) setAddingTool("");
    else setMessage(copy.error);
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
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">Loculary</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{copy.description}</p>
      </header>

      {data.error && <p role="status" className="mb-5 rounded-2xl border border-[var(--danger)]/40 bg-[var(--surface)] px-4 py-3 text-sm text-[var(--danger)]">{copy.error}</p>}
      {message && <p role="status" className="mb-5 text-sm font-semibold text-[var(--accent)]">{message}</p>}
      {!data.userId ? (
        <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-black">{fr ? "Tes collections, sur tous tes appareils" : "Your collections, across devices"}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.signIn}</p>
          <Link href={`/${locale}/compte`} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--on-primary)] transition-[filter,transform] duration-[var(--motion-standard)] hover:brightness-[.94] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">{fr ? "Accéder à mon compte" : "Go to account"}</Link>
        </section>
      ) : (
        <>
          <form className="mb-6 flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void create(); }}>
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required placeholder={copy.placeholder} aria-label={copy.placeholder} className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-lg)] border border-[var(--outline)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-standard)] hover:border-[var(--border-strong)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]" />
            <button type="submit" disabled={data.loading || !name.trim()} className="min-h-12 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--on-primary)] transition-[filter,transform] duration-[var(--motion-standard)] hover:brightness-[.94] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-45">{copy.create}</button>
          </form>

          {data.loading ? <p className="py-8 text-center text-sm text-[var(--muted)]">{fr ? "Chargement…" : "Loading…"}</p> : data.collections.length === 0 ? (
            <section className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-10 text-center">
              <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><CollectionIcon className="h-8 w-8" /></span>
              <h2 className="mt-4 text-xl font-black">{copy.empty}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">{copy.emptyHelp}</p>
            </section>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.25fr)]">
              <ul className="flex flex-col gap-2">
                {data.collections.map((collection) => (
                  <li key={collection.id}>
                    <button type="button" onClick={() => setActiveCollection(collection.id)} aria-pressed={active?.id === collection.id} className={"w-full rounded-[var(--radius-lg)] border p-4 text-left transition-[background-color,border-color,transform] duration-200 " + (active?.id === collection.id ? "border-[var(--primary)] bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-[var(--shadow-sm)]" : "border-[var(--outline-variant)] bg-[var(--surface)] hover:bg-[var(--surface-soft)]")}>
                      <span className="flex items-center justify-between gap-3 font-bold"><span className="truncate">{collection.name}</span><span className="text-xs font-semibold text-[var(--muted)]">{collection.user_collection_items.length}</span></span>
                      <span className="mt-2 block text-xs font-semibold text-[var(--muted)]">{collection.share_token ? copy.shared : copy.private}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {active && (
                <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0"><h2 className="break-words text-xl font-black">{active.name}</h2><p className="mt-1 text-sm text-[var(--muted)]">{active.user_collection_items.length} {fr ? "outils" : "tools"}</p></div>
                    <button type="button" onClick={() => { const next = window.prompt(copy.rename, active.name); if (next?.trim()) void data.renameCollection(active.id, next).then((ok) => { if (!ok) setMessage(copy.error); }); }} className="min-h-12 rounded-full px-4 text-sm font-bold text-[var(--primary)] transition-colors duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">{copy.rename}</button>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <select value={addingTool} onChange={(event) => setAddingTool(event.target.value)} aria-label={copy.add} className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-lg)] border border-[var(--outline)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] hover:border-[var(--border-strong)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">
                      <option value="">{copy.choose}</option>
                      {tools.filter((tool) => !active.user_collection_items.some((item) => item.tool_id === tool.id)).map((tool) => <option key={tool.id} value={tool.id}>{tool.name}</option>)}
                    </select>
                    <button type="button" disabled={!addingTool} onClick={() => void add()} className="min-h-12 rounded-full bg-[var(--accent-soft)] px-5 text-sm font-bold text-[var(--foreground)] transition-[filter,transform] duration-[var(--motion-standard)] hover:brightness-[.97] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50">{copy.save}</button>
                  </div>
                  {active.user_collection_items.length ? <ul className="mt-4 divide-y divide-[var(--border)]">
                    {active.user_collection_items.map((item) => {
                      const tool = tools.find((candidate) => candidate.id === item.tool_id);
                      if (!tool) return null;
                      return <li key={item.tool_id} className="flex items-center gap-3 py-3"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-xl">{tool.icon}</span><div className="min-w-0 flex-1"><Link href={tool.href} className="font-semibold hover:underline">{tool.name}</Link><p className="line-clamp-1 text-xs text-[var(--muted)]">{tool.description}</p></div><button type="button" onClick={() => void data.removeTool(active.id, item.tool_id)} className="min-h-12 min-w-12 rounded-full px-3 text-xs font-bold text-[var(--muted)] transition-colors duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">{copy.removeTool}</button></li>;
                    })}
                  </ul> : <p className="py-6 text-center text-sm text-[var(--muted)]">{copy.emptyHelp}</p>}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
                    <button type="button" onClick={() => void data.toggleSharing(active.id).then((ok) => { if (!ok) setMessage(copy.error); })} className="min-h-12 rounded-full border border-[var(--border-strong)] px-4 text-sm font-bold transition-colors duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">{active.share_token ? copy.stopShare : copy.share}</button>
                    {active.share_token && <button type="button" onClick={() => void copyLink(active.share_token!)} className="min-h-12 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--on-primary)] transition-[filter,transform] duration-[var(--motion-standard)] hover:brightness-[.94] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">{copy.copy}</button>}
                    <button type="button" onClick={() => { if (window.confirm(fr ? "Supprimer cette collection et ses outils ?" : "Delete this collection and its tools?")) void data.deleteCollection(active.id).then((ok) => { if (ok) setActiveCollection(null); else setMessage(copy.error); }); }} className="min-h-12 rounded-full px-4 text-sm font-bold text-[var(--danger)] transition-colors duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">{copy.remove}</button>
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
