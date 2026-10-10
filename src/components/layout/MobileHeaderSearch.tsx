"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ToolSearch from "@/components/tools/ToolSearch";
import type { Locale } from "@/lib/i18n/config";

const iconButton =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-[border-color,background-color,color] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function CloseIcon() {
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // React's guarded render-time state adjustment avoids a cascading effect
  // update while ensuring the old search panel never survives navigation.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const input = document.getElementById("header-tool-search-mobile-input");
    if (input instanceof HTMLInputElement) input.focus();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) return;

      // Do not steal focus from the control the user clicked outside.
      restoreFocusRef.current = false;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      // Let an active suggestion/error surface consume Escape first. A second
      // Escape dismisses the surrounding mobile search panel.
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        rootRef.current?.querySelector(
          "#header-tool-search-mobile [role='listbox'], #header-tool-search-mobile [role='region']",
        )
      ) {
        return;
      }

      event.preventDefault();
      restoreFocusRef.current = true;
      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open]);

  useEffect(() => {
    if (open || !restoreFocusRef.current) return;
    triggerRef.current?.focus();
    restoreFocusRef.current = false;
  }, [open]);

  function closeSearch() {
    restoreFocusRef.current = true;
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="contents">
      <button
        ref={triggerRef}
        type="button"
        className={iconButton + " lg:hidden"}
        aria-label={searchLabel}
        aria-expanded={open}
        aria-controls={open ? "header-tool-search-mobile-panel" : undefined}
        title={searchLabel}
        onClick={() => {
          if (open) {
            closeSearch();
          } else {
            restoreFocusRef.current = false;
            setOpen(true);
          }
        }}
      >
        <SearchIcon />
      </button>
      {open && (
        <div
          id="header-tool-search-mobile-panel"
          className="absolute left-0 right-0 top-full flex items-start gap-2 border-b border-[var(--border)] bg-[var(--background)] px-3 pb-3 pt-2 lg:hidden sm:px-6"
        >
          <ToolSearch
            locale={locale}
            instanceId="header-tool-search-mobile"
            compact
            className="min-w-0 flex-1"
          />
          <button
            type="button"
            className={iconButton}
            aria-label={closeLabel}
            title={closeLabel}
            onClick={closeSearch}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}
