"use client";

import type { Locale } from "@/lib/i18n/config";
import { FilledTonalButton, OutlinedButton } from "@/components/ui/Button";
import { IconToggleButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useFavorites } from "./FavoritesProvider";

export default function FavoriteButton({ toolId, locale, compact = false }: { toolId: string; locale: Locale; compact?: boolean }) {
  const favorites = useFavorites();
  const active = favorites.isFavorite(toolId);
  const pending = favorites.isPending(toolId);
  const label = locale === "fr"
    ? active ? "Retirer des favoris" : "Ajouter aux favoris"
    : active ? "Remove from favorites" : "Add to favorites";
  const disabled = favorites.loading || favorites.error || pending;
  const FavoriteActionButton = active ? FilledTonalButton : OutlinedButton;

  if (compact) {
    return (
      <IconToggleButton
        label={label}
        title={label}
        checked={active}
        onCheckedChange={() => void favorites.toggleFavorite(toolId)}
        aria-busy={pending}
        disabled={disabled}
      >
        <MaterialIcon name={active ? "favorite_fill" : "favorite"} size={24} />
      </IconToggleButton>
    );
  }

  return (
    <FavoriteActionButton
      type="button"
      aria-pressed={active}
      aria-busy={pending}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => void favorites.toggleFavorite(toolId)}
    >
      <MaterialIcon name={active ? "favorite_fill" : "favorite"} size={20} />
      <span>{label}</span>
    </FavoriteActionButton>
  );
}
