import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

export type ToolCategory = { id: string; icon: string };

const categoryNames: Record<Locale, Record<string, string>> = {
  fr: { calculs: "Calculs", dates: "Dates & temps", informatique: "Informatique", images: "Images", fichiers: "PDF & fichiers", video: "Vidéo", developpement: "Développement" },
  en: { calculs: "Calculations", dates: "Dates & time", informatique: "Computing", images: "Images", fichiers: "PDF & files", video: "Video", developpement: "Development" },
};

export const categories: ToolCategory[] = [
  { id: "calculs", icon: "🧮" },
  { id: "dates", icon: "📅" },
  { id: "informatique", icon: "💻" },
  { id: "images", icon: "🖼️" },
  { id: "fichiers", icon: "📄" },
  { id: "video", icon: "🎬" },
  { id: "developpement", icon: "🧑‍💻" },
];

export function getCategoryName(locale: Locale, categoryId: string): string {
  return categoryNames[locale][categoryId] ?? categoryId;
}

export function getToolCount(categoryId: string): number {
  return getPublishedTools().filter((tool) => getPrimaryToolCategory(tool) === categoryId).length;
}
