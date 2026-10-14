"use client";

import type { Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { StarIcon } from "@/components/ui/StarIcon";
import { useFavorites } from "./FavoritesProvider";

export default function FavoriteButton({ toolId, locale, compact = false }: { toolId: string; locale: Locale; compact?: boolean }) {
  const favorites = useFavorites();
  const active = favorites.isFavorite(toolId);
  const pending = favorites.isPending(toolId);
  const label = locale === "fr"
    ? active ? "Retirer des favoris" : "Ajouter aux favoris"
    : active ? "Remove from favorites" : "Add to favorites";
  const disabled = favorites.loading || favorites.error || pending;

  if (compact) {
    return (
      <IconButton
        label={label}
        title={label}
        variant="standard"
        selected={active}
        aria-busy={pending}
        disabled={disabled}
        onClick={() => void favorites.toggleFavorite(toolId)}
      >
        <StarIcon filled={active} className="h-6 w-6 shrink-0" />
      </IconButton>
    );
  }

  return (
    <Button
      type="button"
      variant={active ? "filled-tonal" : "outlined"}
      aria-pressed={active}
      aria-busy={pending}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => void favorites.toggleFavorite(toolId)}
    >
      <StarIcon filled={active} className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Button>
  );
}
