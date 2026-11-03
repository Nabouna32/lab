"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./SplitButton.module.css";

export type SplitButtonItem = { label: string; onSelect: () => void; disabled?: boolean };

type SplitButtonVariant = "filled" | "filled-tonal" | "outlined" | "elevated";

type SplitButtonProps = {
  label: string;
  onClick: () => void;
  items: SplitButtonItem[];
  variant?: SplitButtonVariant;
  icon?: ReactNode;
  menuLabel: string;
  disabled?: boolean;
};

/**
 * Web adaptation of AndroidX Material 3 SplitButtonLayout.
 * Combines a primary action button with an overflow menu for secondary actions.
 * Based on AndroidX 1.4.0 SplitButtonLayout pattern.
 */
export function SplitButton({
  label,
  onClick,
  items,
  variant = "filled",
  icon,
  menuLabel,
  disabled = false,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const id = useId().replace(/:/g, "");
  const menuRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" && open) {
      event.preventDefault();
      menuRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
    }
  }

  return (
    <div ref={rootRef} className={styles.root} onKeyDown={handleKeyDown}>
      <div className={[styles.group, styles[variant]].join(" ")}>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={onClick}
          disabled={disabled}
        >
          {icon && <span aria-hidden="true">{icon}</span>}
          {label}
        </button>
        <button
          ref={triggerRef}
          type="button"
          className={styles.menuAction}
          aria-label={menuLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`split-menu-${id}`}
          onClick={() => setOpen((value) => !value)}
          disabled={disabled}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5H7z" fill="currentColor"/></svg>
        </button>
      </div>
      {open && (
        <div
          id={`split-menu-${id}`}
          ref={menuRef}
          className={styles.menu}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}