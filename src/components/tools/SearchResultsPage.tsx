import type { Metadata } from "next";
import SearchResultsClient from "@/components/tools/SearchResultsClient";
import { getMessages } from "@/lib/i18n/messages";
import { getSearchResultsPagePath } from "@/lib/tools/routes";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

export function getSearchResultsMetadata(locale: Locale): Metadata {
  const t = getMessages(locale);
  return {
    ...getPublicPageMetadata({
      title: t.tools.searchResultsMetaTitle,
      description: t.tools.description,
      path: getSearchResultsPagePath(locale),
      alternatePaths: Object.fromEntries(
        locales.map((availableLocale) => [availableLocale, getSearchResultsPagePath(availableLocale)]),
      ),
    }, locale),
    robots: { index: false, follow: true },
  };
}

export default function SearchResultsPage({ locale }: { locale: Locale }) {
  return <SearchResultsClient locale={locale} />;
}
