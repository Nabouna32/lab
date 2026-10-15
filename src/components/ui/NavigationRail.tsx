"use client";

import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./NavigationRail.module.css";

export type NavigationRailItem<Key extends string = string> = {
  key: Key; label: string; icon: MaterialIconName; badge?: string;
};
type NavigationRailProps<Key extends string> = {
  items: NavigationRailItem<Key>[]; selectedKey: Key; onSelect: (key: Key) => void;
  label: string; header?: ReactNode; footer?: ReactNode; className?: string;
};

/** Source-informed Web adaptation of AndroidX Material 3 NavigationRail. */
export function NavigationRail<Key extends string>({
  items, selectedKey, onSelect, label, header, footer, className,
}: NavigationRailProps<Key>) {
  return <nav aria-label={label} className={[styles.rail, className].filter(Boolean).join(" ")}>
    {header && <div className={styles.header}>{header}</div>}
    <div className={styles.items}>
      {items.map((item) => {
        const selected = item.key === selectedKey;
        return <button key={item.key} type="button" className={styles.item}
          aria-current={selected ? "page" : undefined} aria-pressed={selected}
          data-selected={selected ? "true" : "false"} onClick={() => onSelect(item.key)}>
          <span className={styles.iconContainer}><MaterialIcon name={item.icon} size={24}/>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </span>
          <span className={styles.label}>{item.label}</span>
        </button>;
      })}
    </div>
    {footer && <div className={styles.footer}>{footer}</div>}
  </nav>;
}
