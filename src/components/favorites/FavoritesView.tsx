"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getToolsPath } from "@/lib/tools/routes";
import { StarIcon } from "@/components/ui/StarIcon";
import { useFavorites } from "./FavoritesProvider";

export type FavoriteToolItem = { id: string; icon: string; name: string; description: string; href: string };

export default function FavoritesView({ locale, tools }: { locale: Locale; tools: FavoriteToolItem[] }) {
  const favorites = useFavorites();
  const selected = tools.filter((tool) => favorites.favoriteIds.includes(tool.id));
  const text = locale === "fr" ? {
    title: "Tes favoris",
    description: "Tes outils préférés, prêts à retrouver en un instant.",
    emptyTitle: "Pas encore de favoris",
    emptyDescription: "Ajoute une étoile à un outil pour le retrouver ici. Tu peux commencer sans compte.",
    explore: "Explorer les outils",
    syncError: "La synchronisation n’a pas abouti. Tes favoris locaux sont conservés pour réessayer.",
    count: (count: number) => count === 1 ? "1 outil favori" : count + " outils favoris",
  } : {
    title: "Your favorites",
    description: "Your favorite tools, ready whenever you need them.",
    emptyTitle: "No favorites yet",
    emptyDescription: "Star a tool to find it here. You can start without an account.",
    explore: "Explore tools",
    syncError: "Sync did not complete. Your local favorites are kept so you can retry.",
    count: (count: number) => count === 1 ? "1 favorite tool" : count + " favorite tools",
  };

  return (
    <main className="mx-auto min-h-[60svh] max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-7 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">Loculary</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{text.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{text.description}</p>
        <p className="mt-4 text-sm font-semibold text-[var(--muted)]" aria-live="polite">{text.count(selected.length)}</p>
      </header>
      {favorites.error && <p role="status" className="mb-5 rounded-2xl border border-[var(--danger)]/40 bg-[var(--surface)] px-4 py-3 text-sm text-[var(--danger)]">{text.syncError}</p>}
      {selected.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((tool) => (
            <li key={tool.id} className="flex min-h-40 flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-[var(--shadow-md)]">
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--accent-soft)] text-2xl">{tool.icon}</span>
                <div className="min-w-0 flex-1">
                  <Link href={tool.href} className="font-bold tracking-[-0.02em] text-[var(--foreground)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{tool.name}</Link>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--muted)]">{tool.description}</p>
                </div>
              </div>
              <div className="mt-auto flex justify-end pt-4">
                <button type="button" disabled={favorites.loading || favorites.error} onClick={() => void favorites.toggleFavorite(tool.id)}
                  className="min-h-11 rounded-full px-3 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-55">
                  <StarIcon filled className="h-4 w-4" />{locale === "fr" ? "Retirer des favoris" : "Remove from favorites"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <section className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-10 text-center sm:px-10" aria-labelledby="favorites-empty-title">
          <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><StarIcon className="h-8 w-8" /></span>
          <h2 id="favorites-empty-title" className="mt-4 text-xl font-black">{text.emptyTitle}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">{text.emptyDescription}</p>
          <Link href={getToolsPath(locale)} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--primary)] px-5 font-semibold text-[var(--on-primary)] transition-[filter,transform] duration-[var(--motion-standard)] hover:brightness-[.94] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">{text.explore}</Link>
        </section>
      )}
    </main>
  );
}
