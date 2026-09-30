import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { locales } from "@/lib/i18n/config";
import { categories } from "@/lib/tools/categories";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import { getCategoryPath, getToolPath, getToolsPath } from "@/lib/tools/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const publishedTools = getPublishedTools();
  const urls = new Set<string>();

  for (const locale of locales) {
    urls.add(new URL(`/${locale}`, siteUrl).toString());
    urls.add(new URL(getToolsPath(locale), siteUrl).toString());

    for (const category of categories) {
      if (publishedTools.some((tool) => getPrimaryToolCategory(tool) === category.id)) {
        urls.add(new URL(getCategoryPath(locale, category.id), siteUrl).toString());
      }
    }

    for (const tool of publishedTools) {
      urls.add(
        new URL(getToolPath(locale, getPrimaryToolCategory(tool), tool.id), siteUrl).toString(),
      );
    }
  }

  return Array.from(urls, (url) => ({ url }));
}
