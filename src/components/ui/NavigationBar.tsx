"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./NavigationBar.module.css";

export type NavigationBarItem<Key extends string = string> = {
  key: Key;
  label: string;
  icon: MaterialIconName;
  /** Optional product icon node (e.g. brand/collection icons) overriding the Material Symbol. */
  iconNode?: ReactNode;
  /** When provided, the destination renders as a link so navigation keeps its native semantics. */
  href?: string;
  /** Test/selector hook forwarded as `data-nav-key`; not part of the AndroidX contract. */
  navKey?: string;
  disabled?: boolean;
};
type NavigationBarProps<Key extends string> = { items: NavigationBarItem<Key>[]; selectedKey: Key; onSelect?: (key: Key) => void; label: string; className?: string };

/** Responsive Web adaptation of M3 NavigationBar; not the native AndroidX Compose component. */
export function NavigationBar<Key extends string>({ items, selectedKey, onSelect, label, className }: NavigationBarProps<Key>) {
  return <nav className={[styles.navigationBar, className].filter(Boolean).join(" ")} aria-label={label}>
    {items.map((item) => {
      const selected = item.key === selectedKey;
      const content = <>
        <span className={styles.iconContainer} aria-hidden="true">{item.iconNode ?? <MaterialIcon name={item.icon} size={24} />}</span>
        <span className={styles.label}>{item.label}</span>
      </>;
      const shared = {
        "data-selected": selected ? "true" : "false",
        "data-nav-key": item.navKey,
        "aria-current": selected ? ("page" as const) : undefined,
      };
      return item.href
        ? <Link key={item.key} href={item.href} className={styles.item} {...shared}>{content}</Link>
        : <button key={item.key} type="button" className={styles.item} disabled={item.disabled} aria-pressed={selected} onClick={() => onSelect?.(item.key)} {...shared}>{content}</button>;
    })}
  </nav>;
}
