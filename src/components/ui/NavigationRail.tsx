"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./NavigationRail.module.css";

export type NavigationRailItem<Key extends string = string> = {
  key: Key; label: string; icon: MaterialIconName; badge?: string;
  /** Optional product icon node (e.g. brand/collection icons) overriding the Material Symbol. */
  iconNode?: ReactNode;
  /** When provided, the destination renders as a link so navigation keeps its native semantics. */
  href?: string;
  /** Test/selector hook forwarded as `data-nav-key`; not part of the AndroidX contract. */
  navKey?: string;
};
type NavigationRailProps<Key extends string> = {
  items: NavigationRailItem<Key>[]; selectedKey: Key; onSelect?: (key: Key) => void;
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
        const content = <>
          <span className={styles.iconContainer}>{item.iconNode ?? <MaterialIcon name={item.icon} size={24}/>}
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </span>
          <span className={styles.label}>{item.label}</span>
        </>;
        const shared = {
          "data-selected": selected ? "true" : "false",
          "data-nav-key": item.navKey,
          "aria-current": selected ? ("page" as const) : undefined,
        };
        return item.href
          ? <Link key={item.key} href={item.href} className={styles.item} {...shared}>{content}</Link>
          : <button key={item.key} type="button" className={styles.item} aria-pressed={selected} onClick={() => onSelect?.(item.key)} {...shared}>{content}</button>;
      })}
    </div>
    {footer && <div className={styles.footer}>{footer}</div>}
  </nav>;
}
