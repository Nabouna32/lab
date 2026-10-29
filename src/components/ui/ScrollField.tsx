"use client";

import { useId } from "react";
import type { WheelEvent, KeyboardEvent } from "react";
import styles from "./ScrollField.module.css";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export type ScrollFieldProps = {
  label: string;
  options: string[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  enabled?: boolean;
  itemAccessibilityLabel?: (index: number) => string;
};

/**
 * Web adaptation of AndroidX Material3 ScrollField. The official API is an
 * experimental/Expressive wheel picker; this version uses a bounded five-row
 * wheel and native buttons instead of Compose PagerState.
 */
export function ScrollField({
  label,
  options,
  selectedIndex,
  onSelectedIndexChange,
  enabled = true,
  itemAccessibilityLabel = (index) => options[index] ?? String(index),
}: ScrollFieldProps) {
  const id = useId().replace(/:/g, "");
  const selected = Math.max(0, Math.min(selectedIndex, options.length - 1));

  function choose(index: number) {
    if (!enabled || index < 0 || index >= options.length) return;
    onSelectedIndexChange(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!enabled) return;
    if (event.key === "ArrowUp") { event.preventDefault(); choose(selected - 1); }
    else if (event.key === "ArrowDown") { event.preventDefault(); choose(selected + 1); }
    else if (event.key === "PageUp") { event.preventDefault(); choose(selected - 5); }
    else if (event.key === "PageDown") { event.preventDefault(); choose(selected + 5); }
    else if (event.key === "Home") { event.preventDefault(); choose(0); }
    else if (event.key === "End") { event.preventDefault(); choose(options.length - 1); }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (!enabled || Math.abs(event.deltaY) < 2) return;
    event.preventDefault();
    choose(selected + (event.deltaY > 0 ? 1 : -1));
  }

  return (
    <div className={styles.root} role="group" aria-label={label} data-disabled={enabled ? "false" : "true"} onKeyDown={handleKeyDown} onWheel={handleWheel}>
      <button type="button" className={styles.step} aria-label={label + " previous"} disabled={!enabled || selected <= 0} onClick={() => choose(selected - 1)}><MaterialIcon name="keyboard_arrow_up" size={20} /></button>
      <div className={styles.wheel} role="listbox" aria-label={label} aria-activedescendant={`${id}-option-${selected}`} tabIndex={enabled ? 0 : -1}>
        {[-2, -1, 0, 1, 2].map((offset) => {
          const index = selected + offset;
          if (index < 0 || index >= options.length) return <span key={offset} className={styles.empty} aria-hidden="true" />;
          const isSelected = index === selected;
          return <button
            key={index}
            id={`${id}-option-${index}`}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-label={itemAccessibilityLabel(index)}
            tabIndex={-1}
            className={styles.option}
            disabled={!enabled}
            onClick={() => choose(index)}
          >{options[index]}</button>;
        })}
      </div>
      <button type="button" className={styles.step} aria-label={label + " next"} disabled={!enabled || selected >= options.length - 1} onClick={() => choose(selected + 1)}><MaterialIcon name="keyboard_arrow_down" size={20} /></button>
    </div>
  );
}
