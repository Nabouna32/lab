import type { Locale } from "@/lib/i18n/config";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { getPublishedTools } from "@/lib/tools/catalog";

export type ToolCategory = { id: string; icon: MaterialIconName };

const categoryNames: Record<Locale, Record<string, string>> = {
  fr: { calculations: "Calculs", dates: "Dates & temps", computing: "Informatique", images: "Images", files: "Fichiers & PDF", video: "Vidéo", development: "Développement" },
  en: { calculations: "Calculations", dates: "Dates & time", computing: "Computing", images: "Images", files: "Files & PDF", video: "Video", development: "Development" },
};

export const categories: ToolCategory[] = [
  { id: "calculations", icon: "calculate" },
  { id: "dates", icon: "calendar_month" },
  { id: "computing", icon: "devices" },
  { id: "images", icon: "image" },
  { id: "files", icon: "description" },
  { id: "video", icon: "movie" },
  { id: "development", icon: "code" },
];

export { getCategoryColor, getCategoryContainerColor, getCategoryOnContainerColor } from "./category-colors.ts";

export function getCategoryName(locale: Locale, categoryId: string): string {
  return categoryNames[locale][categoryId] ?? categoryId;
}

export function getToolCount(categoryId: string): number {
  return getPublishedTools().filter((tool) => tool.categories.includes(categoryId)).length;
}
