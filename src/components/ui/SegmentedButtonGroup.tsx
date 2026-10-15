"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import styles from "./SegmentedButtonGroup.module.css";

export type SegmentedButtonOption = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SegmentedButtonGroupProps = {
  label: string;
  options: SegmentedButtonOption[];
  mode: "single" | "multi";
  selectedKeys: string[];
  onSelectionChange: (selectedKeys: string[]) => void;
};

/**
 * Shared Web adaptation of SingleChoiceSegmentedButtonRow /
 * MultiChoiceSegmentedButtonRow and SegmentedButton.
 */
export function SegmentedButtonGroup({
  label,
  options,
  mode,
  selectedKeys,
  onSelectionChange,
}: SegmentedButtonGroupProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function choose(option: SegmentedButtonOption) {
    if (option.disabled) return;
    if (mode === "single") onSelectionChange([option.key]);
    else onSelectionChange(selectedKeys.includes(option.key)
      ? selectedKeys.filter((key) => key !== option.key)
      : [...selectedKeys, option.key]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const enabled = options.map((option, itemIndex) => option.disabled ? -1 : itemIndex).filter((itemIndex) => itemIndex >= 0);
    if (!enabled.length) return;
    const position = enabled.indexOf(index);
    const nextPosition = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (position + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length;
    const nextIndex = enabled[nextPosition];
    buttonRefs.current[nextIndex]?.focus();
    if (mode === "single") choose(options[nextIndex]);
  }

  return (
    <div className={styles.root} role={mode === "single" ? "radiogroup" : "group"} aria-label={label} data-mode={mode}>
      {options.map((option, index) => {
        const selected = selectedKeys.includes(option.key);
        return <button
          key={option.key}
          ref={(node) => { buttonRefs.current[index] = node; }}
          type="button"
          role={mode === "single" ? "radio" : "checkbox"}
          aria-checked={selected}
          aria-pressed={undefined}
          tabIndex={mode === "single" ? (selected || (!selectedKeys.length && index === 0) ? 0 : -1) : 0}
          disabled={option.disabled}
          className={[styles.button, index === 0 ? styles.first : "", index === options.length - 1 ? styles.last : "", selected ? styles.selected : ""].filter(Boolean).join(" ")}
          onClick={() => choose(option)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {option.icon && <span className={styles.icon} aria-hidden="true">{option.icon}</span>}
          <span>{option.label}</span>
        </button>;
      })}
    </div>
  );
}
