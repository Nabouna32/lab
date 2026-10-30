"use client";

import { useId } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import styles from "./OutlinedTextField.module.css";

export type OutlinedTextFieldProps = {
  id: string; name?: string; label: string; value: string; onChange: (value: string) => void;
  type?: "text" | "email" | "number" | "search" | "password";
  placeholder?: string; supportingText?: string; error?: string; prefix?: ReactNode; suffix?: ReactNode;
  leadingContent?: ReactNode; trailingContent?: ReactNode; minLength?: number; maxLength?: number;
  showCharacterCount?: boolean; disabled?: boolean; required?: boolean;
  autoComplete?: string; autoFocus?: boolean; spellCheck?: boolean;
  autoCapitalize?: InputHTMLAttributes<HTMLInputElement>["autoCapitalize"];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
};

/** React/Web adaptation of AndroidX Material 3 OutlinedTextField using a native HTML input. */
export function OutlinedTextField({
  id, name, label, value, onChange, type = "text", placeholder,
  supportingText, error, prefix, suffix, leadingContent, trailingContent, minLength, maxLength,
  disabled = false, required = false, autoComplete, spellCheck, autoCapitalize,
  autoFocus = false, inputMode, showCharacterCount = false,
}: OutlinedTextFieldProps) {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;
  const supportingId = `${generatedId}-supporting`;
  const counterId = `${generatedId}-counter`;
  const describedBy = [error ? errorId : supportingText ? supportingId : "", showCharacterCount && maxLength !== undefined ? counterId : ""].filter(Boolean).join(" ") || undefined;
  function handleChange(event: ChangeEvent<HTMLInputElement>) { onChange(event.target.value); }

  return (
    <div className={styles.root} data-error={error ? "true" : "false"} data-disabled={disabled ? "true" : "false"}>
      <div className={styles.field}>
        {leadingContent && <span className={styles.leading} aria-hidden="true">{leadingContent}</span>}
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <div className={styles.inputContainer}>
          <input id={id} name={name} className={styles.input} type={type} value={value}
            placeholder={placeholder ?? " "} disabled={disabled} required={required} minLength={minLength}
            maxLength={maxLength} autoFocus={autoFocus} inputMode={inputMode}
            autoComplete={autoComplete}
            spellCheck={spellCheck} autoCapitalize={autoCapitalize}
            aria-invalid={Boolean(error)} aria-describedby={describedBy} onChange={handleChange} />
          <label className={styles.label} htmlFor={id}>{label}</label>
        </div>
        {suffix && <span className={styles.affix}>{suffix}</span>}

        {trailingContent && <span className={styles.trailingContent}>{trailingContent}</span>}
      </div>
      <div className={styles.supportingRow}>
        <span id={error ? errorId : supportingId} className={error ? styles.error : styles.supporting}>{error || supportingText || ""}</span>
        {showCharacterCount && maxLength !== undefined && <span id={counterId} className={styles.counter}>{value.length}/{maxLength}</span>}
      </div>
    </div>
  );
}
