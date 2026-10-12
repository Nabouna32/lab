import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import { searchToolCatalog } from "@/lib/tools/search-client";
import { getToolPath, getSearchResultsPath } from "@/lib/tools/routes";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import ToolSearch from "@/components/tools/ToolSearch";
import { SearchResultsClient } from "./SearchResultsClient";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  if (!isLocale(locale)) return {};

  const t = getMessages(locale);
  const query = q?.trim() ?? "";

  return getPublicPageMetadata({
    title: query ? `${t.tools.searchResultsTitle(query)}` : t.tools.metaTitle,
    description: query
      ? `${t.tools.searchResultsMetaTitle} "${query}".`
      : t.tools.description,
    path: getSearchResultsPath(locale, query),
  }, locale);
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  if (!isLocale(locale)) return null;

  const t = getMessages(locale);
  const query = q?.trim() ?? "";
  const results = query ? searchToolCatalog(query, locale) : [];

  return (
    <main className="min-h-full pt-10">
      <div className="mx-auto max-w-[var(--content-wide)] px-4 pb-10 sm:px-6 lg:px-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {query ? t.tools.searchResultsTitle(query) : t.tools.metaTitle}
          </h1>
          {query && (
            <p className="mt-2 text-[var(--muted)]">
              {results.length} {results.length === 1 ? t.tools.one : t.tools.many}
            </p>
          )}
        </header>

        <div id="search-header" className="mb-6">
          <ToolSearch
            locale={locale}
            instanceId="search-page-tool-search"
            initialQuery={query}
            placeholder={t.tools.searchPlaceholder}
            compact={false}
          />
        </div>

        <SearchResultsClient
          locale={locale}
          initialQuery={query}
          initialResults={results}
        />
      </div>
    </main>
  );
}
