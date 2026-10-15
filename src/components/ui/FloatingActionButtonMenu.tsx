"use client";

import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import styles from "./FloatingActionButtonMenu.module.css";

export type FloatingActionButtonMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
};

export type FloatingActionButtonMenuProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  items: FloatingActionButtonMenuItem[];
  label: string;
  closeLabel: string;
  addLabel: string;
};

/** Web adaptation of AndroidX FloatingActionButtonMenu / MenuItem. */
export function FloatingActionButtonMenu({
  expanded,
  onExpandedChange,
  items,
  label,
  closeLabel,
  addLabel,
}: FloatingActionButtonMenuProps) {
  const id = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) onExpandedChange(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onExpandedChange(false);
        toggleRef.current?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        menuRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", handleKeyDown as unknown as (event: globalThis.KeyboardEvent) => void);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", handleKeyDown as unknown as (event: globalThis.KeyboardEvent) => void);
    };
  }, [expanded, onExpandedChange]);

  return (
    <div ref={rootRef} className={styles.root}>
      {expanded && <div id={`fab-menu-${id}`} ref={menuRef} className={styles.menu} role="group" aria-label={label}>
        {items.map((item, index) => <button
          key={item.key}
          type="button"
          className={styles.menuItem}
          style={{ "--fab-menu-order": index } as React.CSSProperties}
          disabled={item.disabled}
          onClick={() => { item.onSelect(); onExpandedChange(false); toggleRef.current?.focus(); }}
        >
          <span>{item.label}</span><span className={styles.menuIcon} aria-hidden="true">{item.icon}</span>
        </button>)}
      </div>}
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-label={expanded ? closeLabel : addLabel}
        aria-expanded={expanded}
        aria-controls={`fab-menu-${id}`}
        onClick={() => onExpandedChange(!expanded)}
      >
        <span aria-hidden="true" className={expanded ? styles.closeIcon : styles.plusIcon}>{expanded ? "×" : "+"}</span>
      </button>
    </div>
  );
}
