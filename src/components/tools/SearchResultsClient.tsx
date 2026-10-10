"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ToolCard from "@/components/tools/ToolCard";
import ToolSearch from "@/components/tools/ToolSearch";
import { Button } from "@/components/ui/Button";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { getCategoryName } from "@/lib/tools/categories";
import { getSearchResultsPath, getToolsPath } from "@/lib/tools/routes";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import type { ToolSearchResult } from "@/lib/tools/search";
import type { Locale } from "@/lib/i18n/config";

export default function SearchResultsClient({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = getMessages(locale);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState(false);
  const [searchRetryCount, setSearchRetryCount] = useState(0);
  const requestId = useRef(0);

  const runSearch = useCallback((nextQuery: string) => {
    const currentRequest = ++requestId.current;
    setIsSearching(true);
    setSearchError(false);
    setResults([]);

    void import("@/lib/tools/search-client")
      .then(({ searchToolCatalog }) => {
        if (currentRequest !== requestId.current) return;
        setResults(searchToolCatalog(nextQuery, locale));
        setIsSearching(false);
      })
      .catch(() => {
        if (currentRequest !== requestId.current) return;
        setSearchError(true);
        setIsSearching(false);
      });
  }, [locale]);

  useEffect(() => {
    const syncFromHash = () => {
      const nextQuery = new URLSearchParams(window.location.hash.slice(1)).get("q")?.trim().slice(0, 120) ?? "";
      if (!nextQuery) {
        router.replace(getToolsPath(locale));
        return;
      }
      setQuery(nextQuery);
      runSearch(nextQuery);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
      requestId.current += 1;
    };
  }, [locale, router, runSearch, searchRetryCount]);

  const handleSearchSubmitted = useCallback((nextQuery: string) => {
    const submittedQuery = nextQuery.trim().slice(0, 120);
    if (!submittedQuery) return;
    router.push(getSearchResultsPath(locale, submittedQuery), { scroll: false });
    setQuery(submittedQuery);
    runSearch(submittedQuery);
  }, [locale, router, runSearch]);

  return (
    <main className="min-h-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[var(--content-wide)]">
        <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)] sm:p-7 lg:p-9" aria-labelledby="search-results-title">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.9fr)] lg:items-end lg:gap-12">
            <div className="motion-reveal min-w-0">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                {t.tools.eyebrow}
              </p>
              <h1 id="search-results-title" className="mt-3 break-words text-3xl font-black tracking-[-0.055em] sm:text-4xl lg:text-5xl">
                {query ? t.tools.searchResultsTitle(query) : t.tools.searchResultsMetaTitle}
              </h1>
              {query && (
                <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
                  {isSearching ? t.tools.searching : searchError ? t.tools.searchError : formatPlural(locale, results.length, { one: t.tools.resultCountOne, other: t.tools.resultCountMany })}
                </p>
              )}
            </div>
            {query && (
              <div className="motion-reveal motion-reveal-delay min-w-0">
                <ToolSearch
                  key={query}
                  locale={locale}
                  instanceId="search-results-page-search"
                  initialQuery={query}
                  onSearchSubmitted={handleSearchSubmitted}
                />
              </div>
            )}
          </div>
        </section>

        {isSearching ? (
          <section className="mt-5 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8" role="status">
            <p className="text-sm font-medium text-[var(--foreground)]">{t.tools.searching}</p>
          </section>
        ) : searchError ? (
          <section className="mt-5 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8" aria-labelledby="search-results-error-title">
            <h2 id="search-results-error-title" className="text-xl font-bold">{t.tools.searchError}</h2>
            <Button type="button" variant="secondary" className="mt-4" onClick={() => setSearchRetryCount((count) => count + 1)}>
              {t.tools.retrySearch}
            </Button>
          </section>
        ) : results.length > 0 ? (
          <section id="search-results-list" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label={t.tools.searchResultsTitle(query)}>
            {results.map(({ tool }) => {
              const categoryId = getPrimaryToolCategory(tool);
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  locale={locale}
                  categoryId={categoryId}
                  categoryName={getCategoryName(locale, categoryId)}
                />
              );
            })}
          </section>
        ) : (
          <section className="mt-5 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8" aria-labelledby="search-results-empty-title">
            <h2 id="search-results-empty-title" className="text-xl font-bold tracking-[-0.03em] sm:text-2xl">
              {t.tools.noResults} « {query} »
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{t.tools.noResultsHelp}</p>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">{t.tools.tryThese}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.tools.noResultsSuggestions.map((suggestion) => (
                <a
                  key={suggestion}
                  href={getSearchResultsPath(locale, suggestion)}
                  className="inline-flex min-h-10 items-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] outline-none transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {suggestion}
                </a>
              ))}
            </div>
            <a
              href={getToolsPath(locale)}
              className="mt-6 inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-[var(--accent)] outline-none transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {t.tools.allToolsTitle}
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
