import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FavoritesView, { type FavoriteToolItem } from "@/components/favorites/FavoritesView";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getToolContent } from "@/lib/tools/types";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getToolPath } from "@/lib/tools/routes";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const tools: FavoriteToolItem[] = getPublishedTools().map((tool) => {
    const content = getToolContent(tool, locale);
    return { id: tool.id, icon: tool.icon, name: content.name, description: content.description, href: getToolPath(locale, tool.id) };
  });
  return <FavoritesView locale={locale} tools={tools} />;
}
