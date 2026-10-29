"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./DropdownMenu.module.css";

export type DropdownMenuItemData = {
  key: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  selected?: boolean;
  leadingIcon?: ReactNode;
  trailingContent?: ReactNode;
  supportingText?: string;
  dividerBefore?: boolean;
  group?: string;
  selectionMode?: "single" | "multi";
};

export type DropdownMenuProps = {
  label: string;
  triggerLabel: string;
  items: DropdownMenuItemData[];
  triggerContent?: ReactNode;
  align?: "start" | "end";
  disabled?: boolean;
};

/** Shared Web adaptation of AndroidX DropdownMenu / DropdownMenuItem. */
export function DropdownMenu({
  label,
  triggerLabel,
  items,
  triggerContent,
  align = "end",
  disabled = false,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const enabledIndices = items.map((item, index) => item.disabled ? -1 : index).filter((index) => index >= 0);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [open]);

  useEffect(() => {
    if (open) menuRef.current?.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]')[activeIndex]?.focus();
  }, [open, activeIndex]);

  function moveActive(direction: 1 | -1) {
    if (enabledIndices.length === 0) return;
    const position = enabledIndices.indexOf(activeIndex);
    const nextPosition = (position + direction + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[nextPosition]);
  }

  function closeMenu(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        closeMenu();
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(enabledIndices[0] ?? 0);
        setOpen(true);
      } else moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(enabledIndices[enabledIndices.length - 1] ?? 0);
        setOpen(true);
      } else moveActive(-1);
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(enabledIndices[0] ?? 0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(enabledIndices[enabledIndices.length - 1] ?? 0);
    }
  }

  return (
    <div ref={rootRef} className={styles.root} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`m3-dropdown-menu-${id}`}
        disabled={disabled}
        onClick={() => {
          if (open) closeMenu(false);
          else {
            const selectedIndex = items.findIndex((item) => item.selected && !item.disabled);
            setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndices[0] ?? 0);
            setOpen(true);
          }
        }}
      >
        {triggerContent ?? label}<span aria-hidden="true" className={styles.chevron}><MaterialIcon name="keyboard_arrow_down" size={18} /></span>
      </button>
      {open && <div ref={menuRef} id={`m3-dropdown-menu-${id}`} role="menu" aria-label={label} className={`${styles.menu} ${align === "start" ? styles.alignStart : styles.alignEnd}`}>
        {items.map((item, index) => (
          <div key={item.key}>
            {item.group && (index === 0 || items[index - 1]?.group !== item.group) && <div className={styles.groupLabel}>{item.group}</div>}
            {item.dividerBefore && <div className={styles.divider} role="separator" />}
            <button
              type="button"
              role={item.selected === undefined ? "menuitem" : item.selectionMode === "single" ? "menuitemradio" : "menuitemcheckbox"}
              aria-checked={item.selected}
              disabled={item.disabled}
              tabIndex={index === activeIndex ? 0 : -1}
              className={styles.item}
              onMouseEnter={() => !item.disabled && setActiveIndex(index)}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect();
                closeMenu();
              }}
            >
              {item.leadingIcon && <span className={styles.leading} aria-hidden="true">{item.leadingIcon}</span>}
              <span className={styles.copy}>
                <span className={styles.itemLabel}>{item.label}</span>
                {item.supportingText && <span className={styles.supporting}>{item.supportingText}</span>}
              </span>
              {item.selected && <span className={styles.selectedMark} aria-hidden="true"><MaterialIcon name="check" size={18} /></span>}
              {item.trailingContent && <span className={styles.trailing}>{item.trailingContent}</span>}
            </button>
          </div>
        ))}
      </div>}
    </div>
  );
}
