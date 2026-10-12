"use client";

import { useState } from "react";
import Link from "next/link";
import type { ToolSearchResult } from "@/lib/tools/search";
import { getToolPath } from "@/lib/tools/routes";
import type { Locale } from "@/lib/i18n/config";

interface SearchResultsClientProps {
  locale: Locale;
  initialQuery: string;
  initialResults: ToolSearchResult[];
}

export function SearchResultsClient({ locale, initialQuery, initialResults }: SearchResultsClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ToolSearchResult[]>(initialResults);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setIsSearching(true);
    // Note: In a real implementation, you'd call the search API here
    // For now, we'll just use the initial results
    setIsSearching(false);
  };

  if (!initialQuery && !query) {
    return (
      <div className="text-center py-12 text-[var(--muted)]">
        <p>Entrez une recherche pour trouver des outils.</p>
      </div>
    );
  }

  return (
    <div>
      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map(({ tool }) => (
            <Link
              key={tool.id}
              href={getToolPath(locale, tool.id)}
              className="group block rounded-xl border border-[var(--outline-variant)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-variant)] text-xl" aria-hidden="true">
                {tool.icon}
              </span>
              <h3 className="mt-3 truncate font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
                {tool.content[locale]?.name ?? tool.id}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                {tool.content[locale]?.description ?? ""}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--muted)]">
                <span>{tool.categories[0]}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <p>Aucun résultat pour « {query} »</p>
        </div>
      )}
    </div>
  );
}