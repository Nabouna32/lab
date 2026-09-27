"use client";

import { useEffect, useState } from "react";
import ToolSearch from "@/components/tools/ToolSearch";
import type { Locale } from "@/lib/i18n/config";

const iconButton =
  "flex h-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-[border-color,background-color,color] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

function Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function MobileHeaderSearch({
  locale,
  searchLabel,
  closeLabel,
}: {
  locale: Locale;
  searchLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const input = document.getElementById("header-tool-search-mobile-input");
    if (input instanceof HTMLInputElement) input.focus();
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        className={iconButton + " w-10 sm:hidden"}
        aria-label={searchLabel}
        aria-expanded="false"
        title={searchLabel}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </button>
    );
  }

  return (
    <div className="contents">
      <button
        type="button"
        className={iconButton + " w-10 sm:hidden"}
        aria-label={searchLabel}
        aria-expanded="true"
        title={searchLabel}
        onClick={() => setOpen(false)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </button>
      <div className="absolute left-0 right-0 top-full flex items-start gap-2 border-b border-[var(--border)] bg-[var(--background)] px-3 pb-3 pt-2 md:hidden sm:px-6">
        <ToolSearch
          locale={locale}
          instanceId="header-tool-search-mobile"
          compact
          className="min-w-0 flex-1"
        />
        <button
          type="button"
          className={iconButton + " w-10"}
          aria-label={closeLabel}
          title={closeLabel}
          onClick={() => setOpen(false)}
        >
          <Icon />
        </button>
      </div>
    </div>
  );
}
