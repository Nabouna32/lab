"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./SearchBar.module.css";

export type SearchBarProps = {
  label: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
  mode?: "docked" | "full-screen";
  locale?: string;
};

/**
 * Shared Web adaptation of AndroidX Material 3 SearchBar / expanded search
 * patterns. It is not native Compose. Expansion, suggestions, keyboard choice,
 * and query submission are implemented; exact AndroidX window/inset/motion
 * behavior and newer SearchBarState APIs remain version-sensitive.
 */
export function SearchBar({
  label,
  query,
  onQueryChange,
  onSearch,
  suggestions = [],
  placeholder,
  mode = "docked",
  locale = "en",
}: SearchBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId().replace(/:/g, "");
  const listId = `m3-search-results-${id}`;
  const filteredSuggestions = suggestions.filter((item) => !query.trim() || item.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)));
  const visible = expanded && (filteredSuggestions.length > 0 || query.trim().length > 0);
  const fullScreen = mode === "full-screen" && expanded;

  function submit(value: string) {
    onQueryChange(value);
    onSearch(value);
    setExpanded(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function closeSearch() {
    setExpanded(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (expanded) {
        event.preventDefault();
        closeSearch();
      }
      return;
    }
    if (event.key === "ArrowDown" && filteredSuggestions.length > 0) {
      event.preventDefault();
      setExpanded(true);
      setActiveIndex((index) => (index + 1) % filteredSuggestions.length);
    } else if (event.key === "ArrowUp" && filteredSuggestions.length > 0) {
      event.preventDefault();
      setExpanded(true);
      setActiveIndex((index) => index <= 0 ? filteredSuggestions.length - 1 : index - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) submit(filteredSuggestions[activeIndex]);
      else submit(query);
    }
  }

  return (
    <div className={`${styles.root} ${fullScreen ? styles.fullScreenRoot : ""}`}>
      {fullScreen && <button type="button" className={styles.scrim} aria-label={locale.startsWith("fr") ? "Fermer la recherche" : "Close search"} onClick={closeSearch} />}
      <div className={`${styles.searchSurface} ${expanded ? styles.expanded : ""} ${fullScreen ? styles.fullScreenSurface : ""}`}>
        <form className={styles.inputRow} role="search" onSubmit={(event) => { event.preventDefault(); submit(query); }}>
          <span className={styles.searchGlyph} aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="search"
            aria-label={label}
            role="combobox"
            aria-autocomplete="list"\n            aria-haspopup="listbox"
            aria-expanded={visible}
            aria-controls={listId}
            aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
            value={query}
            placeholder={placeholder}
            onFocus={() => setExpanded(true)}
            onChange={(event) => { onQueryChange(event.target.value); setExpanded(true); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
          />
          {query && <button type="button" className={styles.trailingAction} aria-label={locale.startsWith("fr") ? "Effacer la recherche" : "Clear search"} onClick={() => { onQueryChange(""); setActiveIndex(-1); inputRef.current?.focus(); }}>×</button>}
          {mode === "full-screen" && expanded && <button type="button" className={styles.trailingAction} aria-label={locale.startsWith("fr") ? "Fermer la recherche" : "Close search"} onClick={closeSearch}>←</button>}
        </form>
        {visible && (
          <div id={listId} className={styles.results} role="listbox" aria-label={locale.startsWith("fr") ? "Suggestions de recherche" : "Search suggestions"}>
            {filteredSuggestions.length ? filteredSuggestions.map((suggestion, index) => (
              <button
                id={`${listId}-option-${index}`}
                key={suggestion}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={styles.result}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => submit(suggestion)}
              >
                <span className={styles.resultGlyph} aria-hidden="true">⌕</span>
                <span>{suggestion}</span>
              </button>
            )) : <p className={styles.empty}>{locale.startsWith("fr") ? "Appuyez sur Entrée pour rechercher cette expression." : "Press Enter to search for this phrase."}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
