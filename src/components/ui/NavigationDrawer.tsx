"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./NavigationDrawer.module.css";

export type NavigationDrawerItem<Key extends string = string> = {
  key: Key; label: string; icon?: MaterialIconName; section?: string;
};
type NavigationDrawerProps<Key extends string> = {
  open: boolean; onOpenChange: (open: boolean) => void;
  items: NavigationDrawerItem<Key>[]; selectedKey: Key; onSelect: (key: Key) => void;
  label: string; title?: string; mode?: "modal" | "standard" | "dismissible" | "permanent"; className?: string;
  content?: ReactNode; dismissLabel?: string;
};

/** Source-informed Web adaptation of AndroidX Material 3 NavigationDrawer. */
export function NavigationDrawer<Key extends string>({
  open, onOpenChange, items, selectedKey, onSelect, label, title,
  mode = "modal", className, content, dismissLabel,
}: NavigationDrawerProps<Key>) {
  const panelRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open || mode !== "modal") return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onOpenChange(false); return; }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes.length) { event.preventDefault(); panel?.focus(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
      previousFocus.current?.focus();
    };
  }, [open, mode, onOpenChange]);

  if (mode === "modal" && !open) return null;

  const groups: { section?: string; items: NavigationDrawerItem<Key>[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (!last || last.section !== item.section) groups.push({ section: item.section, items: [item] });
    else last.items.push(item);
  }

  const panel = <aside ref={panelRef} className={[styles.sheet, className].filter(Boolean).join(" ")}
    aria-label={label} aria-modal={mode === "modal" ? true : undefined}
    role={mode === "modal" ? "dialog" : "navigation"} tabIndex={-1}>
    {(title || mode === "dismissible") && <div className={styles.titleRow}>{title && <h2 className={styles.title}>{title}</h2>}{mode === "dismissible" && <button type="button" className={styles.dismiss} aria-label={dismissLabel ?? "Close navigation drawer"} onClick={() => onOpenChange(false)}>×</button>}</div>}
    <nav aria-label={label} className={styles.nav}>
      {groups.map((group, index) => <div className={styles.group} key={group.section ?? `group-${index}`}>
        {group.section && <h3 className={styles.section}>{group.section}</h3>}
        {group.items.map((item) => {
          const selected = item.key === selectedKey;
          return <button key={item.key} type="button" className={styles.item}
            aria-current={selected ? "page" : undefined} aria-pressed={selected}
            data-selected={selected ? "true" : "false"}
            onClick={() => { onSelect(item.key); if (mode === "modal" || mode === "dismissible") onOpenChange(false); }}>
            {item.icon && <MaterialIcon name={item.icon} size={24}/>}<span>{item.label}</span>
          </button>;
        })}
      </div>)}
    </nav>
  </aside>;

  if (mode === "standard" || mode === "permanent") return <div className={styles.standard}>{panel}</div>;
  if (mode === "dismissible") return <div className={styles.dismissible}><div className={styles.dismissibleSlot} data-open={open ? "true" : "false"}>{open ? panel : null}</div><div className={styles.drawerContent}>{content}</div></div>;
  return <div className={styles.modalRoot} data-open={open ? "true" : "false"}>
    <button type="button" className={styles.scrim} aria-label={label + " overlay"} tabIndex={-1}
      onClick={() => onOpenChange(false)}/>
    {panel}
  </div>;
}
