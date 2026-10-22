import { categories } from "@/lib/tools/categories";
import { getPublishedTools, getToolsByCategory } from "@/lib/tools/catalog";
import { locales, type Locale } from "@/lib/i18n/config";
import {
  getCategoryPath,
  getGuidedWorkflowsPath,
  getToolPath,
  getToolsPath,
} from "@/lib/tools/routes";
import { buildPublicSeoInventory, type LocalizedSeoResource, type PublicSeoPage } from "./inventory-core";

function localizedPaths(pathForLocale: (locale: Locale) => string): Record<string, string> {
  return Object.fromEntries(locales.map((locale) => [locale, pathForLocale(locale)]));
}

/**
 * The sitemap and public-page metadata share this inventory. Only resource
 * families intended for search indexing are listed here; private, personalized,
 * search, and filtered URLs are deliberately excluded.
 */
const resources: LocalizedSeoResource[] = [
  {
    id: "home",
    paths: localizedPaths((locale) => `/${locale}`),
  },
  {
    id: "tools-index",
    paths: localizedPaths(getToolsPath),
  },
  {
    id: "guided-workflows",
    paths: localizedPaths(getGuidedWorkflowsPath),
  },
  ...categories
    .filter((category) => getToolsByCategory(category.id).length > 0)
    .map((category) => ({
      id: `category:${category.id}`,
      paths: localizedPaths((locale) => getCategoryPath(locale, category.id)),
    })),
  ...getPublishedTools().map((tool) => ({
    id: `tool:${tool.id}`,
    paths: localizedPaths((locale) => getToolPath(locale, tool.id)),
  })),
];

const publicSeoPages = buildPublicSeoInventory(locales, resources);

export function getPublicSeoPages(): readonly PublicSeoPage[] {
  return publicSeoPages;
}

export function getPublicSeoPage(locale: Locale, path: string): PublicSeoPage | undefined {
  return publicSeoPages.find((page) => page.locale === locale && page.path === path);
}
