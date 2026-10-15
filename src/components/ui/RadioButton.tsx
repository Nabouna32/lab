"use client";

import type { ChangeEvent } from "react";
import styles from "./RadioButton.module.css";

type RadioButtonProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

/** Source-informed Web adaptation of AndroidX Material 3 RadioButton. */
export function RadioButton({ name, value, label, checked, onChange, disabled = false, className = "" }: RadioButtonProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) onChange(value);
  };
  return <label className={[styles.root, disabled ? styles.disabled : "", className].filter(Boolean).join(" ")}>
    <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={handleChange}/>
    <span className={styles.indicator} aria-hidden="true"><span/></span>
    <span className={styles.label}>{label}</span>
  </label>;
}
