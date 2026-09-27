import type { Locale } from "@/lib/i18n/config";
import { getAllTools } from "./catalog";
import { searchTools } from "./search";

export function searchToolCatalog(query: string, locale: Locale) {
  return searchTools(getAllTools(), query, locale);
}
