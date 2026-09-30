import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

export type ToolCategory = { id: string; icon: string };

const categoryNames: Record<Locale, Record<string, string>> = {
  fr: { calculations: "Calculs", dates: "Dates & temps", computing: "Informatique", images: "Images", files: "Fichiers & PDF", video: "Vidéo", development: "Développement" },
  en: { calculations: "Calculations", dates: "Dates & time", computing: "Computing", images: "Images", files: "Files & PDF", video: "Video", development: "Development" },
};

export const categories: ToolCategory[] = [
  { id: "calculations", icon: "🧮" },
  { id: "dates", icon: "📅" },
  { id: "computing", icon: "💻" },
  { id: "images", icon: "🖼️" },
  { id: "files", icon: "📄" },
  { id: "video", icon: "🎬" },
  { id: "development", icon: "🧑‍💻" },
];

export function getCategoryName(locale: Locale, categoryId: string): string {
  return categoryNames[locale][categoryId] ?? categoryId;
}

export function getToolCount(categoryId: string): number {
  return getPublishedTools().filter((tool) => getPrimaryToolCategory(tool) === categoryId).length;
}
