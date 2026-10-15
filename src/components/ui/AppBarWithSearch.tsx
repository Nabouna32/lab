"use client";

import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./AppBarWithSearch.module.css";

export type AppBarWithSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  title: string;
  searchLabel: string;
  placeholder?: string;
  navigationIcon?: MaterialIconName;
  navigationLabel: string;
  onNavigationClick?: () => void;
  actions?: ReactNode;
  locale?: string;
};

/**
 * Shared Web composition inspired by AndroidX AppBarWithSearch. It combines
 * navigation/actions with the shared SearchBar, but does not implement the
 * AndroidX SearchBarState, nested-scroll behavior, or platform window insets.
 */
export function AppBarWithSearch({
  query,
  onQueryChange,
  onSearch,
  suggestions = [],
  title,
  searchLabel,
  placeholder,
  navigationIcon = "menu",
  navigationLabel,
  onNavigationClick,
  actions,
  locale = "en",
}: AppBarWithSearchProps) {
  return (
    <header className={styles.root} aria-label={title}>
      <button type="button" className={styles.navigation} aria-label={navigationLabel} onClick={onNavigationClick}>
        <MaterialIcon name={navigationIcon} size={24}/>
      </button>
      <div className={styles.search}>
        <SearchBar
          label={searchLabel}
          query={query}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
          suggestions={suggestions}
          placeholder={placeholder}
          mode="docked"
          locale={locale}
        />
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
