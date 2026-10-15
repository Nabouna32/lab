"use client";

import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./NavigationBar.module.css";

export type NavigationBarItem<Key extends string = string> = { key: Key; label: string; icon: MaterialIconName };
type NavigationBarProps<Key extends string> = { items: NavigationBarItem<Key>[]; selectedKey: Key; onSelect: (key: Key) => void; label: string; className?: string };

/** Responsive Web adaptation of M3 NavigationBar; not the native AndroidX Compose component. */
export function NavigationBar<Key extends string>({ items, selectedKey, onSelect, label, className }: NavigationBarProps<Key>) {
  return <nav className={[styles.navigationBar, className].filter(Boolean).join(" ")} aria-label={label}>
    {items.map((item) => {
      const selected = item.key === selectedKey;
      return <button key={item.key} type="button" className={styles.item} aria-pressed={selected} data-selected={selected ? "true" : "false"} onClick={() => onSelect(item.key)}>
        <span className={styles.iconContainer} aria-hidden="true"><MaterialIcon name={item.icon} size={24} /></span>
        <span className={styles.label}>{item.label}</span>
      </button>;
    })}
  </nav>;
}
