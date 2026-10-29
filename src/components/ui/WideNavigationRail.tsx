"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./WideNavigationRail.module.css";

export type WideNavigationRailItem = {
  key: string;
  label: string;
  icon: MaterialIconName;
  disabled?: boolean;
};

export type WideNavigationRailProps = {
  items: WideNavigationRailItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  mode?: "standard" | "modal";
  label: string;
  expandLabel: string;
  collapseLabel: string;
  closeLabel: string;
  header?: ReactNode;
};

/**
 * Web adaptation of AndroidX WideNavigationRail / ModalWideNavigationRail.
 * Modal expansion uses a Web scrim and focus management; AndroidX state/insets
 * and exact adaptive layout behavior are not implemented here.
 */
export function WideNavigationRail({
  items,
  selectedKey,
  onSelect,
  expanded,
  onExpandedChange,
  mode = "standard",
  label,
  expandLabel,
  collapseLabel,
  closeLabel,
  header,
}: WideNavigationRailProps) {
  const id = useId().replace(/:/g, "");
  const railRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const modal = mode === "modal" && expanded;

  useEffect(() => {
    if (!modal) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    toggleRef.current?.focus();
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onExpandedChange(false);
        toggleRef.current?.focus();
      } else if (event.key === "Tab") {
        const focusable = Array.from(railRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []);
        if (!focusable.length) {
          event.preventDefault();
          railRef.current?.focus();
        } else if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
          event.preventDefault();
          focusable[0].focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [modal, onExpandedChange]);

  return (
    <>
      {modal && <button type="button" className={styles.scrim} aria-label={closeLabel} onClick={() => onExpandedChange(false)} />}
      <nav
        ref={railRef}
        id={`wide-navigation-rail-${id}`}
        aria-label={label}
        aria-modal={modal ? "true" : undefined}
        role={modal ? "dialog" : "navigation"}
        tabIndex={modal ? -1 : undefined}
        className={[styles.rail, expanded ? styles.expanded : styles.collapsed, mode === "modal" ? styles.modal : styles.standard, modal ? styles.modalOpen : ""].join(" ")}
      >
        <div className={styles.header}>
          {header}
          <button ref={toggleRef} type="button" className={styles.expandButton} aria-label={expanded ? collapseLabel : expandLabel} aria-expanded={expanded} aria-controls={`wide-navigation-rail-${id}`} onClick={() => onExpandedChange(!expanded)}><MaterialIcon name={expanded ? "chevron_left" : "chevron_right"} size={20} /></button>
        </div>
        <div className={styles.items}>
          {items.map((item) => {
            const selected = item.key === selectedKey;
            return <button
              key={item.key}
              type="button"
              className={styles.item}
              data-selected={selected ? "true" : "false"}
              aria-current={selected ? "page" : undefined}
              aria-label={item.label}
              title={!expanded ? item.label : undefined}
              disabled={item.disabled}
              onClick={() => { onSelect(item.key); if (mode === "modal") onExpandedChange(false); }}
            >
              <span className={styles.icon}><MaterialIcon name={item.icon} size={24}/></span>
              <span className={styles.itemLabel}>{item.label}</span>
            </button>;
          })}
        </div>
      </nav>
    </>
  );
}
