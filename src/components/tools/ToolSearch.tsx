"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { getCategoryName } from "@/lib/tools/categories";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import type { ToolId } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { normalizeSearchText } from "@/lib/tools/search-utils";
import { executeToolSearch } from "@/lib/tools/search-request";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { getSearchResultsPath, getToolPath } from "@/lib/tools/routes";

type ToolSearchResult = {
  tool: Tool;
  score: number;
};

type SearchOverlayPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "above" | "below";
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
  initialQuery,
  locale: localeProp,
  instanceId = "tool-search",
  compact = false,
  onSearchSubmitted,
}: {
  className?: string;
  placeholder?: string;
  initialQuery?: string;
  locale?: Locale;
  instanceId?: string;
  compact?: boolean;
  onSearchSubmitted?: (query: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const segment = pathname.split("/")[1];
  const locale: Locale = localeProp ?? (isLocale(segment) ? segment : defaultLocale);
  const t = getMessages(locale);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<ToolSearchResult[]>([]);
  const [resultsQuery, setResultsQuery] = useState("");
  const [isSearching, setIsSearching] = useState(Boolean(initialQuery?.trim()));
  const [searchError, setSearchError] = useState(false);
  const [searchRetryCount, setSearchRetryCount] = useState(0);
  const [overlayPosition, setOverlayPosition] = useState<SearchOverlayPosition | null>(null);
  const deferredQuery = useDeferredValue(query);
  const searchRequest = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showResults = isFocused && query.trim().length > 0;
  const inputId = instanceId + "-input";
  const resultsId = instanceId + "-results";

  useEffect(() => {
    const normalizedQuery = deferredQuery.trim();
    if (!normalizedQuery) return;

    const requestId = ++searchRequest.current;
    let cancelled = false;

    void executeToolSearch(normalizedQuery, locale).then((outcome) => {
      if (cancelled || requestId !== searchRequest.current) return;
      if (outcome.status === "error") {
        setSearchError(true);
        setIsSearching(false);
        return;
      }
      setResults(outcome.results);
      setResultsQuery(normalizedQuery);
      setSearchError(false);
      setIsSearching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery, locale, searchRetryCount]);

  useEffect(() => {
    if (!showResults) return;

    if (!rootRef.current) return;

    function updatePosition() {
      const anchor = rootRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const margin = 12;
      const gap = 8;
      const maxRight = viewportLeft + viewportWidth - margin;
      const width = Math.min(rect.width, Math.max(0, viewportWidth - margin * 2));
      const left = Math.max(viewportLeft + margin, Math.min(rect.left, maxRight - width));
      const belowSpace = viewportTop + viewportHeight - margin - (rect.bottom + gap);
      const aboveSpace = rect.top - viewportTop - margin - gap;
      const opensAbove = belowSpace < 200 && aboveSpace > belowSpace;
      const availableSpace = opensAbove ? aboveSpace : belowSpace;
      const maxHeight = Math.max(80, Math.min(360, availableSpace));
      const top = opensAbove ? rect.top - gap : rect.bottom + gap;

      setOverlayPosition({ top, left, width, maxHeight, placement: opensAbove ? "above" : "below" });
    }

    const initialFrame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [showResults]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) || popupRef.current?.contains(target)) return;
      setIsFocused(false);
      setActiveIndex(-1);
      setOverlayPosition(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function hrefFor(toolId: ToolId) {
    return getToolPath(locale, toolId);
  }

  const visibleResults = !isSearching && !searchError && normalizeSearchText(query) === normalizeSearchText(resultsQuery) ? results : [];

  function openResult(index: number) {
    const result = visibleResults[index];
    if (result) router.push(hrefFor(result.tool.id));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedQuery = query.trim().slice(0, 120);
    if (!submittedQuery) return;

    if (visibleResults.length === 1) {
      router.push(hrefFor(visibleResults[0].tool.id));
    } else if (onSearchSubmitted) {
      onSearchSubmitted(submittedQuery);
    } else {
      router.push(getSearchResultsPath(locale, submittedQuery));
    }
    setIsFocused(false);
    setActiveIndex(-1);
    setOverlayPosition(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsFocused(false);
      setActiveIndex(-1);
      setOverlayPosition(null);
      return;
    }
    if (!showResults || visibleResults.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % visibleResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? visibleResults.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      openResult(activeIndex);
    }
  }

  return (
    <div id={instanceId} ref={rootRef} className={"relative " + className}>
      <form role="search" aria-label={t.tools.searchLabel} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">{t.tools.searchLabel}</label>
      <div className={
        "flex items-center border bg-[var(--surface)] transition-[border-color,box-shadow] duration-200 " +
        (compact
          ? "rounded-xl p-1 shadow-[var(--shadow-sm)] "
          : "min-h-12 rounded-full p-1 shadow-[var(--shadow-sm)] sm:min-h-14 sm:p-1.5 ") +
        (isFocused
          ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/12"
          : "border-[var(--outline-variant)]")
      }>
        <span
          className={
            "flex shrink-0 items-center justify-center rounded-lg text-[var(--muted)] " +
            (compact ? "h-8 w-8 text-base" : "h-10 w-10 rounded-full text-base sm:text-lg")
          }
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.3" />
            <path d="m15.5 15.5 4.2 4.2" />
          </svg>
        </span>
        <input
          id={inputId}
          type="text"
          value={query}
          placeholder={placeholder ?? t.tools.searchPlaceholder}
          autoComplete="off"
          maxLength={120}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults && overlayPosition !== null && visibleResults.length > 0}
          aria-controls={showResults && overlayPosition !== null && visibleResults.length > 0 ? resultsId : undefined}
          aria-activedescendant={showResults && overlayPosition !== null && activeIndex >= 0 ? instanceId + "-result-" + activeIndex : undefined}
          inputMode="search"
          enterKeyHint="search"
          onChange={(event) => { const nextQuery = event.target.value; searchRequest.current += 1; setQuery(nextQuery); setActiveIndex(-1); setSearchError(false); setIsSearching(nextQuery.trim().length > 0); if (!nextQuery.trim()) setOverlayPosition(null); }}
          onFocus={() => setIsFocused(true)}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          className={
            "min-w-0 flex-1 bg-transparent text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] " +
            (compact ? "px-2 py-2 text-sm" : "px-2 py-2 text-base sm:px-3 sm:py-3 sm:text-lg")
          }
        />
        {query && (
          <Button
            variant="ghost"
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              searchRequest.current += 1;
              setQuery("");
              setActiveIndex(-1);
              setIsFocused(true);
              setIsSearching(false);
              setSearchError(false);
              setOverlayPosition(null);
              inputRef.current?.focus();
            }}
            className="min-h-10 w-10 shrink-0 rounded-full p-0"
            aria-label={t.tools.clearSearch}
            title={t.tools.clearSearch}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </Button>
        )}
        <IconButton label={t.tools.searchSubmit} type="submit" disabled={!query.trim()} size={compact ? "compact" : "default"}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </IconButton>
      </div>
      </form>

      {showResults && overlayPosition && typeof document !== "undefined" && createPortal(
        <div
          ref={popupRef}
          data-search-popup-owner={instanceId}
          role="region"
          aria-label={t.tools.searchLabel}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            setIsFocused(false);
            setActiveIndex(-1);
            setOverlayPosition(null);
            inputRef.current?.focus();
          }}
          style={{
            position: "fixed",
            top: overlayPosition.top,
            left: overlayPosition.left,
            width: overlayPosition.width,
            maxHeight: overlayPosition.maxHeight,
            transform: overlayPosition.placement === "above" ? "translateY(-100%)" : undefined,
            zIndex: 1000,
          }}
          className="overflow-y-auto overscroll-contain rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-elevated)] p-2 text-[var(--foreground)] shadow-[var(--shadow-lg)]"
        >
          {isSearching ? (
            <div className="flex items-center gap-3 px-4 py-5" role="status" aria-live="polite">
              <span className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <p className="text-sm font-medium text-[var(--foreground)]">{t.tools.searching}</p>
            </div>
          ) : searchError ? (
            <div className="px-4 py-5" role="alert">
              <p className="text-sm font-medium text-[var(--foreground)]">{t.tools.searchError}</p>
              <Button
                type="button"
                variant="secondary"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { setSearchError(false); setIsSearching(true); setSearchRetryCount((count) => count + 1); }}
                className="mt-3 min-h-10 rounded-full px-4"
              >
                {t.tools.retrySearch}
              </Button>
            </div>
          ) : visibleResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-1">
                <p className="text-xs font-semibold text-[var(--muted)]">{t.tools.suggestions}</p>
                <p className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
                  {formatPlural(locale, visibleResults.length, { one: t.tools.resultCountOne, other: t.tools.resultCountMany })}
                </p>
              </div>
              <div id={resultsId} role="listbox" aria-label={t.tools.suggestions} aria-busy={false} className="grid gap-1">
                {visibleResults.map(({ tool }, index) => {
                  const content = getToolContent(tool, locale);
                  const selected = activeIndex === index;
                  return (
                    <a
                      key={tool.id}
                      id={instanceId + "-result-" + index}
                      href={hrefFor(tool.id)}
                      role="option"
                      aria-selected={selected}
                      tabIndex={-1}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      className={
                        "group flex min-h-[4.25rem] items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-left outline-none transition-colors " +
                        (selected
                          ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                          : "text-[var(--foreground)] hover:bg-[var(--surface-soft)]")
                      }
                    >
                      <span
                        className={
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-xl " +
                          (selected
                            ? "bg-[var(--on-primary-container)]/10"
                            : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]")
                        }
                        aria-hidden="true"
                      >
                        {tool.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          <HighlightMatch text={content.name} query={query} />
                        </span>
                        <span className="mt-1 block line-clamp-2 text-xs leading-5 opacity-80">
                          <span className="font-medium">{getCategoryName(locale, getPrimaryToolCategory(tool))}</span>
                          <span aria-hidden="true"> · </span>
                          {content.description}
                        </span>
                      </span>
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-3 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]" role="status">
                {t.tools.noResults} « {query.trim()} »
              </p>
              <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{t.tools.noResultsHelp}</p>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.tools.tryThese}>
                {t.tools.noResultsSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      searchRequest.current += 1;
                      setQuery(suggestion);
                      setActiveIndex(-1);
                      setIsFocused(true);
                      setSearchError(false);
                      setIsSearching(true);
                      inputRef.current?.focus();
                    }}
                    className="min-h-10 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
