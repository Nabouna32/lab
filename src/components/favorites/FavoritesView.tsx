"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getToolsPath } from "@/lib/tools/routes";
import { StarIcon } from "@/components/ui/StarIcon";
import { TextButton } from "@/components/ui/Button";
import { useFavorites } from "./FavoritesProvider";
import { PageContainer } from "@/components/layout/PageLayout";
import { MaterialIcon, type MaterialIconName } from "@/components/ui/MaterialIcon";
import { Card } from "@/components/ui/Card";
import AppLink from "@/components/ui/AppLink";

export type FavoriteToolItem = { id: string; icon: MaterialIconName; name: string; description: string; href: string };

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
    <main className="min-h-[60svh]">
      <PageContainer width="medium" spacing="default">
      <Card className="mb-7 p-6 sm:p-8">
        <p className="m3-type-label-small uppercase text-[var(--primary)]">Loculary</p>
        <h1 className="m3-type-headline-medium mt-2">{text.title}</h1>
        <p className="m3-type-body-large mt-2 max-w-2xl text-[var(--muted)]">{text.description}</p>
        <p className="m3-type-body-medium mt-4 text-[var(--muted)]" aria-live="polite">{text.count(selected.length)}</p>
      </Card>
      {favorites.error && <p role="status" className="mb-5 rounded-2xl border border-[var(--danger)]/40 bg-[var(--surface)] px-4 py-3 text-sm text-[var(--danger)]">{text.syncError}</p>}
      {selected.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((tool) => (
            <li key={tool.id}><Card className="flex min-h-40 flex-col p-4">
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--shape-corner-large)] bg-[var(--primary-container)] text-[var(--on-primary-container)]"><MaterialIcon name={tool.icon} size={24} /></span>
                <div className="min-w-0 flex-1">
                  <Link href={tool.href} className="m3-type-title-medium text-[var(--on-surface)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{tool.name}</Link>
                  <p className="m3-type-body-medium mt-1 line-clamp-2 text-[var(--muted)]">{tool.description}</p>
                </div>
              </div>
              <div className="mt-auto flex justify-end pt-4">
                <TextButton type="button" disabled={favorites.loading || favorites.error} onClick={() => void favorites.toggleFavorite(tool.id)}>
                  <StarIcon filled size={18} className="h-[18px] w-[18px] shrink-0" />
                  {locale === "fr" ? "Retirer des favoris" : "Remove from favorites"}
                </TextButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="px-6 py-10 text-center sm:px-10" >
          <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><StarIcon className="h-8 w-8" /></span>
          <h2 id="favorites-empty-title" className="m3-type-title-large mt-4">{text.emptyTitle}</h2>
          <p className="m3-type-body-medium mx-auto mt-2 max-w-lg text-[var(--muted)]">{text.emptyDescription}</p>
          <AppLink href={getToolsPath(locale)} variant="filled" className="mt-6">{text.explore}</AppLink>
        </Card>
      )}
      </PageContainer>
    </main>
  );
}
