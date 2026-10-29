"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import styles from "./FloatingToolbar.module.css";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export type FloatingToolbarItem = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
};

export type FloatingToolbarProps = {
  label: string;
  orientation?: "horizontal" | "vertical";
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  expandLabel: string;
  collapseLabel: string;
  items: FloatingToolbarItem[];
};

/** Web adaptation of HorizontalFloatingToolbar / VerticalFloatingToolbar. */
export function FloatingToolbar({
  label,
  orientation = "horizontal",
  expanded,
  onExpandedChange,
  expandLabel,
  collapseLabel,
  items,
}: FloatingToolbarProps) {
  const toggleRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && expanded) {
      event.preventDefault();
      onExpandedChange(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <div className={[styles.root, orientation === "vertical" ? styles.vertical : styles.horizontal].join(" ")} onKeyDown={handleKeyDown}>
      {expanded && <div className={styles.toolbar} role="toolbar" aria-label={label} aria-orientation={orientation}>
        {items.map((item) => <button key={item.key} type="button" className={styles.item} aria-label={item.label} aria-pressed={item.selected} title={item.label} disabled={item.disabled} onClick={item.onClick}>
          <span aria-hidden="true">{item.icon}</span>
          <span className={styles.itemLabel}>{item.label}</span>
        </button>)}
      </div>}
      <button ref={toggleRef} type="button" className={styles.toggle} aria-label={expanded ? collapseLabel : expandLabel} aria-expanded={expanded} onClick={() => onExpandedChange(!expanded)}>
        <span aria-hidden="true"><MaterialIcon name={expanded ? "close" : "add"} size={24} /></span>
      </button>
    </div>
  );
}
