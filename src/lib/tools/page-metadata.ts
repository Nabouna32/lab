import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getIntlLocale, type Locale } from "@/lib/i18n/config";
import type { Tool } from "./types";
import { getToolPath } from "./routes";
import { getPublicSeoPage } from "@/lib/seo/public-pages";

export type PublicPageSeo = {
  title: string;
  description: string;
  path: string;
  /**
   * Optional paths for deliberately non-indexable pages, such as search.
   * Indexable public pages always use the shared public SEO inventory.
   */
  alternatePaths?: Partial<Record<Locale, string>>;
};

export function getPublicPageMetadata(seo: PublicPageSeo, locale: Locale): Metadata {
  const siteUrl = getSiteUrl();
  const url = new URL(seo.path, siteUrl);
  const inventoryPage = getPublicSeoPage(locale, seo.path);
  const localizedPaths = inventoryPage?.localizedPaths ?? seo.alternatePaths;
  const languages = localizedPaths
    ? Object.fromEntries(
        Object.entries(localizedPaths).map(([availableLocale, path]) => [
          availableLocale,
          new URL(path, siteUrl).toString(),
        ]),
      )
    : undefined;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url.toString(),
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: "website",
      url: url.toString(),
      title: seo.title,
      description: seo.description,
      siteName: "Loculary",
      locale: getIntlLocale(locale).replace("-", "_"),
    },
  };
}

export function getToolPageMetadata(tool: Tool, locale: Locale): Metadata {
  const seo = tool.seo[locale];
  return getPublicPageMetadata({
    title: seo.title,
    description: seo.description,
    path: getToolPath(locale, tool.id),
  }, locale);
}
