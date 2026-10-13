"use client";

import type { Locale } from "@/lib/i18n/config";
import { StarIcon } from "@/components/ui/StarIcon";
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
        "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold",
        "transition-[background-color,color,border-color,transform,box-shadow,filter] duration-[var(--motion-standard)] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-55",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)] shadow-[var(--shadow-sm)] hover:brightness-[.94] active:scale-[.98]"
          : "border-[var(--outline)] bg-[var(--surface)] px-4 text-[var(--foreground)] hover:bg-[var(--surface-soft)] active:scale-[.98]",
        compact ? "min-h-10 min-w-10 px-0" : "min-h-12 px-4",
      ].join(" ")}
    >
      <StarIcon filled={active} className="h-5 w-5 shrink-0" />
      {!compact && <span>{label}</span>}
    </button>
  );
}
