"use client";

import type { ReactNode } from "react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import styles from "./ButtonGroup.module.css";

export type ButtonGroupItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ButtonGroupProps = {
  label: string;
  items: ButtonGroupItem[];
  selectedKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  mode?: "single" | "multi";
  maxVisible?: number;
  expandedRatio?: number;
  overflowLabel: string;
};

/**
 * Web adaptation of AndroidX Material3 ButtonGroup / ButtonGroupScope.
 * maxVisible is a Web-only demonstration setting; AndroidX overflows based on
 * measured available width and its customItem/clickableItem DSL.
 */
export function ButtonGroup({
  label,
  items,
  selectedKeys,
  onSelectionChange,
  mode = "multi",
  maxVisible = 4,
  expandedRatio = 1.15,
  overflowLabel,
}: ButtonGroupProps) {
  const visibleCount = Math.max(1, Math.min(items.length, maxVisible));
  const visible = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount);

  function select(key: string) {
    if (mode === "single") onSelectionChange([key]);
    else onSelectionChange(selectedKeys.includes(key) ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key]);
  }

  return (
    <div className={styles.root} role="group" aria-label={label}>
      <div className={styles.items}>
        {visible.map((item) => {
          const selected = selectedKeys.includes(item.key);
          return <button
            key={item.key}
            type="button"
            className={styles.item}
            aria-pressed={selected}
            disabled={item.disabled}
            style={{ flexGrow: selected ? expandedRatio : 1 }}
            onClick={() => select(item.key)}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
          </button>;
        })}
      </div>
      {overflow.length > 0 && <DropdownMenu
        label={overflowLabel}
        triggerLabel={overflowLabel}
        triggerContent={<><span aria-hidden="true">⋯</span><span>{overflowLabel}</span></>}
        items={overflow.map((item) => ({
          key: item.key,
          label: item.label,
          leadingIcon: item.icon,
          disabled: item.disabled,
          selected: selectedKeys.includes(item.key),
          selectionMode: mode,
          onSelect: () => select(item.key),
        }))}
      />}
    </div>
  );
}
