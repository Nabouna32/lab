"use client";

import type { Locale } from "@/lib/i18n/config";
import { useFavorites } from "./FavoritesProvider";

export default function FavoriteButton({ toolId, locale, compact = false }: { toolId: string; locale: Locale; compact?: boolean }) {
  const favorites = useFavorites();
  const active = favorites.isFavorite(toolId);
  const label = locale === "fr"
    ? active ? "Retirer des favoris" : "Ajouter aux favoris"
    : active ? "Remove from favorites" : "Add to favorites";

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      disabled={favorites.loading || favorites.error}
      onClick={() => void favorites.toggleFavorite(toolId)}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border text-sm font-bold",
        "transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-55",
        active
          ? "border-[var(--m3-light-primary)] bg-[var(--m3-light-primary)] text-[var(--m3-light-on-primary)] shadow-[var(--shadow-sm)] dark:border-[var(--m3-dark-primary)] dark:bg-[var(--m3-dark-primary)] dark:text-[var(--m3-dark-on-primary)]"
          : "border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[var(--foreground)] hover:bg-[var(--surface-soft)] active:scale-[0.98]",
        compact ? "min-h-10 min-w-10 px-0" : "px-4",
      ].join(" ")}
    >
      <span aria-hidden="true" className="text-lg leading-none">{active ? "★" : "☆"}</span>
      {!compact && <span>{label}</span>}
    </button>
  );
}
