"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { getCategoryName } from "@/lib/tools/categories";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { normalizeSearchText } from "@/lib/tools/search-utils";
import { Button } from "@/components/ui/Button";
import { getToolPath } from "@/lib/tools/routes";

type ToolSearchResult = {
  tool: Tool;
  score: number;
};

function getNormalizedMatchRange(text: string, query: string): [number, number] | null {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return null;

  let normalized = "";
  const starts: number[] = [];
  const ends: number[] = [];

  for (let index = 0; index < text.length; index += 1) {
    const chunk = normalizeSearchText(text[index]);
    if (!chunk) continue;
    for (const character of chunk) {
      normalized += character;
      starts.push(index);
      ends.push(index + 1);
    }
  }

  const matchIndex = normalized.indexOf(normalizedQuery);
  if (matchIndex < 0) return null;
  return [starts[matchIndex], ends[matchIndex + normalizedQuery.length - 1]];
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const range = getNormalizedMatchRange(text, query);
  if (!range) return <>{text}</>;
  const [start, end] = range;
  return <>{text.slice(0, start)}<mark className="rounded bg-[var(--accent-soft)] px-0.5 text-[var(--foreground)]">{text.slice(start, end)}</mark>{text.slice(end)}</>;
}

export default function ToolSearch({
  className = "",
  placeholder,
  locale: localeProp,
  instanceId = "tool-search",
  compact = false,
}: {
  className?: string;
  placeholder?: string;
  locale?: Locale;
  instanceId?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const segment = pathname.split("/")[1];
  const locale: Locale = localeProp ?? (isLocale(segment) ? segment : defaultLocale);
  const t = getMessages(locale);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<ToolSearchResult[]>([]);
  const [resultsQuery, setResultsQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const searchRequest = useRef(0);
  const showResults = isFocused && query.trim().length > 0;
  const inputId = instanceId + "-input";
  const resultsId = instanceId + "-results";

  useEffect(() => {
    const normalizedQuery = deferredQuery.trim();
    if (!normalizedQuery) return;

    const requestId = ++searchRequest.current;
    let cancelled = false;

    import("@/lib/tools/search-client").then(({ searchToolCatalog }) => {
      if (cancelled || requestId !== searchRequest.current) return;
      setResults(searchToolCatalog(normalizedQuery, locale).slice(0, 6));
      setResultsQuery(normalizedQuery);
      setIsSearching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery, locale]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const search = document.getElementById(instanceId);
      if (search && !search.contains(target)) {
        setIsFocused(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [instanceId]);

  function hrefFor(toolId: string, categoryId: string) {
    return getToolPath(locale, categoryId, toolId);
  }

  const visibleResults = normalizeSearchText(query) === resultsQuery ? results : [];

  function openResult(index: number) {
    const result = visibleResults[index];
    if (result) router.push(hrefFor(result.tool.id, getPrimaryToolCategory(result.tool)));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsFocused(false);
      setActiveIndex(-1);
      return;
    }
    if (!showResults || visibleResults.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % visibleResults.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? visibleResults.length - 1 : index - 1));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openResult(activeIndex >= 0 ? activeIndex : 0);
    }
  }

  return (
    <div id={instanceId} className={"relative " + className}>
      <label htmlFor={inputId} className="sr-only">{t.tools.searchLabel}</label>
      <div className={
        "group flex items-center border bg-[var(--surface)] transition-[border-color,box-shadow,transform] duration-[var(--motion-standard)] " +
        (compact
          ? "border-y-0 rounded-[var(--radius-md)] p-1 shadow-[var(--shadow-sm)] "
          : "rounded-[var(--radius-2xl)] p-2 shadow-[var(--shadow-md)] ") +
        (isFocused
          ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/10"
          : "border-[var(--border)]")
      }>
        <span
          className={
            "flex shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--muted)] transition-[transform,color] duration-[var(--motion-fast)] " +
            (compact ? "h-8 w-8 text-base" : "h-10 w-10 rounded-[var(--radius-md)] bg-[var(--surface-soft)] text-lg")
          }
          aria-hidden="true"
        >
          ⌕
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder ?? t.tools.searchPlaceholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls={resultsId}
          aria-activedescendant={activeIndex >= 0 ? instanceId + "-result-" + activeIndex : undefined}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(-1); setIsSearching(event.target.value.trim().length > 0); }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={
            "min-w-0 flex-1 bg-transparent text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] " +
            (compact ? "px-2 py-2 text-sm" : "px-3 py-2.5 text-base sm:text-lg")
          }
        />
        {query && (
          <Button
            variant="ghost"
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => { setQuery(""); setActiveIndex(-1); setIsFocused(true); }}
            className={(compact ? "min-h-8 w-8 text-base " : "min-h-10 w-10 text-lg ") + "rounded-lg p-0"}
            aria-label={t.tools.clearSearch}
          >
            ×
          </Button>
        )}
        {!compact && (
          <Button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => openResult(0)}
            disabled={query.trim().length === 0 || visibleResults.length === 0}
            className="hidden min-h-10 rounded-[var(--radius-md)] px-5 sm:inline-flex"
          >
            {t.tools.searchButton}
          </Button>
        )}
      </div>

      {showResults && (
        <div id={resultsId} role="listbox" aria-busy={isSearching} className="absolute left-0 right-0 top-full z-[60] mt-3 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-lg)]">
          {isSearching ? (
            <div className="px-4 py-6" role="status">
              <p className="text-sm font-medium text-[var(--foreground)]">{t.tools.searching}</p>
            </div>
          ) : visibleResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-3 pb-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.tools.suggestions}</p>
                <p className="text-xs text-[var(--muted)]">{formatPlural(locale, visibleResults.length, { one: t.tools.resultCountOne, other: t.tools.resultCountMany })}</p>
              </div>
              {visibleResults.map(({ tool }, index) => {
                const content = getToolContent(tool, locale);
                return (
                  <a
                    key={tool.id}
                    id={instanceId + "-result-" + index}
                    href={hrefFor(tool.id, getPrimaryToolCategory(tool))}
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={"group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3.5 text-left transition-[background-color,transform] duration-[var(--motion-fast)] " + (activeIndex === index ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-soft)]")}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-xl transition-transform duration-[var(--motion-fast)] group-hover:scale-[1.04]">{tool.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[var(--foreground)]"><HighlightMatch text={content.name} query={query} /></span>
                      <span className="mt-1 block text-xs text-[var(--muted)]"><span className="font-medium text-[var(--foreground)]/70">{getCategoryName(locale, getPrimaryToolCategory(tool))}</span><span aria-hidden="true"> · </span>{content.description}</span>
                    </span>
                    <span className="text-lg text-[var(--muted)] transition-[transform,color] duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">→</span>
                  </a>
                );
              })}
            </>
          ) : (
            <div className="px-4 py-6">
              <p className="text-sm font-medium text-[var(--foreground)]">{t.tools.noResults} « {query.trim()} »</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{t.tools.noResultsHelp}</p>
              <div className="mt-4 flex flex-wrap gap-2" aria-label={t.tools.tryThese}>
                {t.tools.noResultsSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => { setQuery(suggestion); setActiveIndex(-1); setIsFocused(true); setIsSearching(true); }}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
