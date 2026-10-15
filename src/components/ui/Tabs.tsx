"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import styles from "./Tabs.module.css";

export type M3TabItem = {
  key: string;
  label: string;
  enabled?: boolean;
  icon?: ReactNode;
  content?: ReactNode;
};

export type TabsProps = {
  items: M3TabItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  variant?: "primary" | "secondary";
  scrollable?: boolean;
  ariaLabel: string;
  className?: string;
};

/**
 * Reusable Web adaptation of AndroidX Material 3 Tab + PrimaryTabRow /
 * SecondaryTabRow. It is not a native Compose component. Keyboard navigation
 * follows the web tab pattern; consumers own the selected state and panel.
 */
export function Tabs({
  items,
  selectedKey,
  onSelect,
  variant = "primary",
  scrollable = false,
  ariaLabel,
  className,
}: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabledItems = items.filter((item) => item.enabled !== false);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (enabledItems.length === 0) return;

    const currentKey = items[index]?.key;
    const enabledIndex = enabledItems.findIndex((item) => item.key === currentKey);
    let nextIndex = enabledIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = enabledItems.length - 1;
    else if (event.key === "ArrowRight") nextIndex = (enabledIndex + 1) % enabledItems.length;
    else if (event.key === "ArrowLeft") nextIndex = (enabledIndex - 1 + enabledItems.length) % enabledItems.length;

    const next = enabledItems[nextIndex];
    const nextItemIndex = items.findIndex((item) => item.key === next.key);
    tabRefs.current[nextItemIndex]?.focus();
    onSelect(next.key);
  }

  const classNames = [
    styles.root,
    styles[variant],
    scrollable ? styles.scrollable : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      <div className={styles.row} role="tablist" aria-label={ariaLabel} aria-orientation="horizontal">
        {items.map((item, index) => {
          const selected = item.key === selectedKey;
          const disabled = item.enabled === false;
          return (
            <button
              key={item.key}
              ref={(node) => { tabRefs.current[index] = node; }}
              type="button"
              role="tab"
              id={`m3-tab-${item.key}`}
              aria-selected={selected}
              aria-controls={item.content ? `m3-tab-panel-${item.key}` : undefined}
              tabIndex={selected ? 0 : -1}
              disabled={disabled}
              className={styles.tab}
              onClick={() => onSelect(item.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.divider} aria-hidden="true" />
    </div>
  );
}

export function TabPanel({
  tabKey,
  selectedKey,
  children,
  className,
}: {
  tabKey: string;
  selectedKey: string;
  children: ReactNode;
  className?: string;
}) {
  if (tabKey !== selectedKey) return null;
  return (
    <div
      id={`m3-tab-panel-${tabKey}`}
      role="tabpanel"
      aria-labelledby={`m3-tab-${tabKey}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
