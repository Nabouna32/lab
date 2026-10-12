import type { Locale } from "@/lib/i18n/config";
import type { ToolId } from "./types";
import { getToolSlug, getAllToolSlugs } from "./slugs.ts";

export { getToolSlug };

export const toolsPathSegments: Record<Locale, string> = {
  en: "tools",
  fr: "outils",
};

export const categoriesPathSegments: Record<Locale, string> = {
  en: "categories",
  fr: "categories",
};

const categorySlugs: Record<string, Record<Locale, string>> = {
  calculations: { en: "calculations", fr: "calculs" },
  dates: { en: "dates", fr: "dates" },
  computing: { en: "computing", fr: "informatique" },
  images: { en: "images", fr: "images" },
  files: { en: "files", fr: "fichiers" },
  video: { en: "video", fr: "video" },
  development: { en: "development", fr: "developpement" },
};

export function getToolsPath(locale: Locale): string {
  return `/${locale}/${toolsPathSegments[locale]}`;
}

const searchPathSegments: Record<Locale, string> = {
  en: "search",
  fr: "recherche",
};

export function getSearchResultsPagePath(locale: Locale): string {
  return `/${locale}/${searchPathSegments[locale]}`;
}

export function getSearchResultsPath(locale: Locale, query: string): string {
  return `${getSearchResultsPagePath(locale)}#q=${encodeURIComponent(query.trim())}`;
}

export function getCategoriesPath(locale: Locale): string {
  return `/${locale}/${categoriesPathSegments[locale]}`;
}

export function getCategorySlug(locale: Locale, categoryId: string): string {
  return categorySlugs[categoryId]?.[locale] ?? categoryId;
}

export function getCategoryPath(locale: Locale, categoryId: string): string {
  return `${getCategoriesPath(locale)}/${getCategorySlug(locale, categoryId)}`;
}

export function getToolPath(locale: Locale, toolId: ToolId): string {
  return `${getToolsPath(locale)}/${getToolSlug(locale, toolId)}`;
}

export function getCategoryIdBySlug(locale: Locale, slug: string): string | undefined {
  return Object.entries(categorySlugs).find(([, slugs]) => slugs[locale] === slug)?.[0];
}

export function getToolIdBySlug(locale: Locale, slug: string): ToolId | undefined {
  const toolSlugs = getAllToolSlugs();
  return Object.entries(toolSlugs).find(([, slugs]) => slugs[locale] === slug)?.[0] as ToolId | undefined;
}

export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;

  const currentLocale = segments[0] as Locale;
  if (segments.length === 1) return `/${targetLocale}`;

  const currentToolsSegment = toolsPathSegments[currentLocale];
  const currentCategoriesSegment = categoriesPathSegments[currentLocale];

  if (segments.length === 2 && segments[1] === searchPathSegments[currentLocale]) {
    return getSearchResultsPagePath(targetLocale);
  }

  if (segments.length === 2 && segments[1] === currentToolsSegment) {
    return getToolsPath(targetLocale);
  }

  if (segments.length === 3 && segments[1] === currentToolsSegment) {
    const toolId = getToolIdBySlug(currentLocale, segments[2]);
    return toolId ? getToolPath(targetLocale, toolId) : `/${targetLocale}`;
  }

  if (segments.length === 3 && segments[1] === currentCategoriesSegment) {
    const categoryId = getCategoryIdBySlug(currentLocale, segments[2]);
    return categoryId ? getCategoryPath(targetLocale, categoryId) : `/${targetLocale}`;
  }

  if (segments[1] === currentToolsSegment || segments[1] === currentCategoriesSegment) {
    return `/${targetLocale}`;
  }

  return `/${targetLocale}/${segments.slice(1).join("/")}`;
}