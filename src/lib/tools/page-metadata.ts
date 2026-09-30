import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getIntlLocale, locales, type Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory } from "./types";
import type { Tool } from "./types";
import { getToolPath } from "./routes";

export type PublicPageSeo = {
  title: string;
  description: string;
  path: string;
};

export function getPublicPageMetadata(seo: PublicPageSeo, locale: Locale): Metadata {
  const siteUrl = getSiteUrl();
  const url = new URL(seo.path, siteUrl);
  const alternates = Object.fromEntries(
    locales.map((availableLocale) => [
      availableLocale,
      new URL(`/${availableLocale}${seo.path.slice(`/${locale}`.length)}`, siteUrl).toString(),
    ]),
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url.toString(),
      languages: alternates,
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
  const siteUrl = getSiteUrl();
  const path = getToolPath(locale, getPrimaryToolCategory(tool), tool.id);
  const url = new URL(path, siteUrl);

  const alternates = Object.fromEntries(
    locales.map((availableLocale) => [
      availableLocale,
      new URL(getToolPath(availableLocale, getPrimaryToolCategory(tool), tool.id), siteUrl).toString(),
    ]),
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url.toString(),
      languages: alternates,
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
