"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ToolSearch from "@/components/tools/ToolSearch";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { IconButton } from "@/components/ui/IconButton";
import type { Locale } from "@/lib/i18n/config";
import { Alignment } from "@/components/layout/compose/Alignment";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Row } from "@/components/layout/compose/Row";


type HeaderSearchProps = {
  locale: Locale;
  searchLabel: string;
};

export default function HeaderSearch(props: HeaderSearchProps) {
  const pathname = usePathname();
  return <HeaderSearchPanel key={pathname} {...props} />;
}

function HeaderSearchPanel({
  locale,
  searchLabel,
}: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const input = document.getElementById("header-tool-search-input");
    if (input instanceof HTMLInputElement) input.focus();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const searchPopup = target instanceof Element
        ? target.closest('[data-search-popup-owner="header-tool-search"]')
        : null;
      if (rootRef.current?.contains(target) || searchPopup) return;

      // Do not steal focus from the control the user clicked outside.
      restoreFocusRef.current = false;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      // The portal/input consumes Escape while suggestions or status feedback are open.
      // A later Escape closes this surrounding panel.
      if (document.querySelector('[data-search-popup-owner="header-tool-search"]')) {
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
      <IconButton
        ref={triggerRef}
        label={searchLabel}
        selected={open}
        aria-expanded={open}
        aria-controls={open ? "header-tool-search-panel" : undefined}
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
        <MaterialIcon name="search" size={24} />
      </IconButton>
      {open && (
        <Row
          id="header-tool-search-panel"
          horizontalArrangement={Arrangement.spacedByCss("var(--space-2)")}
          verticalAlignment={Alignment.Top}
          className="absolute left-0 right-0 top-full border-b border-[var(--border)] bg-[var(--background)] px-3 pb-3 pt-2 sm:px-6"
        >
          <ToolSearch
            locale={locale}
            instanceId="header-tool-search"
            compact
            className="min-w-0 flex-1"
          />
        </Row>
      )}
    </div>
  );
}
