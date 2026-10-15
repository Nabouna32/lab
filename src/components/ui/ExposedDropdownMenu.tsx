"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./ExposedDropdownMenu.module.css";

export type ExposedDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
  dividerBefore?: boolean;
};

type ExposedDropdownMenuProps = {
  id?: string;
  label: string;
  value: string;
  options: ExposedDropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  variant?: "fidelity" | "expressive";
};

/**
 * Web implementation informed by AndroidX Material 3 ExposedDropdownMenuBox.
 * It preserves combobox/listbox semantics and keyboard selection, but is not
 * AndroidX Compose and does not claim popup/inset/animation parity.
 */
export function ExposedDropdownMenu({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  error,
  helperText,
  variant = "fidelity",
}: ExposedDropdownMenuProps) {
  const generatedId = useId();
  const controlId = id ?? `m3-exposed-dropdown-${generatedId}`;
  const listboxId = `${controlId}-listbox`;
  const helperId = `${controlId}-helper`;
  const errorId = `${controlId}-error`;
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const firstEnabledIndex = options.findIndex((option) => !option.disabled);
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : Math.max(0, firstEnabledIndex));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeOption = options[activeIndex];
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [open]);

  const findEnabled = (start: number, direction: 1 | -1) => {
    if (options.length === 0) return -1;
    for (let step = 0; step < options.length; step += 1) {
      const index = (start + direction * step + options.length * 2) % options.length;
      if (!options[index].disabled) return index;
    }
    return -1;
  };

  const openAt = (index: number) => {
    if (firstEnabledIndex < 0) return;
    const next = options[index]?.disabled ? findEnabled(index, 1) : index;
    setActiveIndex(next >= 0 ? next : Math.max(0, firstEnabledIndex));
    setOpen(true);
  };

  const choose = (option: ExposedDropdownOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) openAt(selectedIndex >= 0 ? selectedIndex : Math.max(0, firstEnabledIndex));
      else setActiveIndex((current) => findEnabled(current + 1, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openAt(selectedIndex >= 0 ? selectedIndex : options.length - 1);
      else setActiveIndex((current) => findEnabled(current - 1, -1));
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(findEnabled(0, 1));
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(findEnabled(options.length - 1, -1));
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      if (activeOption) choose(activeOption);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab" && open) {
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef} data-variant={variant}>
      <label className={styles.label} htmlFor={controlId}>{label}</label>
      <button
        id={controlId}
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && activeOption ? `${controlId}-option-${activeIndex}` : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex >= 0 ? selectedIndex : Math.max(0, firstEnabledIndex)))}
        onKeyDown={onTriggerKeyDown}
      >
        <span>{selectedOption?.label ?? ""}</span>
        <svg className={open ? styles.chevronOpen : styles.chevron} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div className={styles.menu} role="listbox" id={listboxId} aria-labelledby={controlId}>
          {options.map((option, index) => (
            <div key={option.value}>
              {option.dividerBefore ? <div className={styles.divider} role="separator" /> : null}
              <button
                type="button"
                tabIndex={-1}
                role="option"
                id={`${controlId}-option-${index}`}
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                disabled={option.disabled}
                className={styles.option}
                data-active={index === activeIndex}
                onPointerMove={() => !option.disabled && setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>
                {option.value === value ? <span aria-hidden="true">✓</span> : null}
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {error ? <p id={errorId} className={styles.error}>{error}</p> : helperText ? <p id={helperId} className={styles.helper}>{helperText}</p> : null}
    </div>
  );
}
