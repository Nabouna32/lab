import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

export type ToolCategory = { id: string; icon: string; href: string };

const categoryNames: Record<Locale, Record<string, string>> = {
  fr: { calculs: "Calculs", dates: "Dates & temps", informatique: "Informatique", images: "Images", fichiers: "PDF & fichiers", video: "Vidéo" },
  en: { calculs: "Calculations", dates: "Dates & time", informatique: "Computing", images: "Images", fichiers: "PDF & files", video: "Video" },
};

export const categories: ToolCategory[] = [
  { id: "calculs", icon: "🧮", href: "/fr/outils/calculs" },
  { id: "dates", icon: "📅", href: "/fr/outils/dates" },
  { id: "informatique", icon: "💻", href: "/fr/outils/informatique" },
  { id: "images", icon: "🖼️", href: "/fr/outils/images" },
  { id: "fichiers", icon: "📄", href: "/fr/outils/fichiers" },
  { id: "video", icon: "🎬", href: "/fr/outils/video" },
];

export function getCategoryName(locale: Locale, categoryId: string): string {
  return categoryNames[locale][categoryId] ?? categoryId;
}

export function getToolCount(categoryId: string): number {
  return getPublishedTools().filter((tool) => getPrimaryToolCategory(tool) === categoryId).length;
}
