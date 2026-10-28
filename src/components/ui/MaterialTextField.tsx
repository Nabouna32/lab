"use client";

import { useId, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import styles from "./MaterialTextField.module.css";

export type MaterialTextFieldProps = {
  id: string; name?: string; label: string; value: string; onChange: (value: string) => void;
  variant?: "filled" | "outlined"; type?: "text" | "email" | "number" | "search" | "password";
  placeholder?: string; supportingText?: string; error?: string; prefix?: ReactNode; suffix?: ReactNode;
  leadingContent?: ReactNode; trailingContent?: ReactNode; minLength?: number; maxLength?: number;
  showCharacterCount?: boolean; secure?: boolean; disabled?: boolean; required?: boolean;
  autoComplete?: string; autoFocus?: boolean; inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
};

/** React/Web adaptation of AndroidX Material 3 TextField and OutlinedTextField. */
export function MaterialTextField({
  id, name, label, value, onChange, variant = "outlined", type = "text", placeholder,
  supportingText, error, prefix, suffix, leadingContent, trailingContent, minLength, maxLength,
  showCharacterCount = false, secure = false, disabled = false, required = false, autoComplete,
  autoFocus = false, inputMode,
}: MaterialTextFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const generatedId = useId();
  const errorId = `${generatedId}-error`;
  const supportingId = `${generatedId}-supporting`;
  const counterId = `${generatedId}-counter`;
  const describedBy = [error ? errorId : supportingText ? supportingId : "", showCharacterCount && maxLength !== undefined ? counterId : ""].filter(Boolean).join(" ") || undefined;
  const inputType = secure ? (revealed ? "text" : "password") : type;
  function handleChange(event: ChangeEvent<HTMLInputElement>) { onChange(event.target.value); }

  return (
    <div className={styles.root} data-variant={variant} data-error={error ? "true" : "false"} data-disabled={disabled ? "true" : "false"}>
      <div className={styles.field}>
        {leadingContent && <span className={styles.leading} aria-hidden="true">{leadingContent}</span>}
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <div className={styles.inputContainer}>
          <input id={id} name={name} className={styles.input} type={inputType} value={value}
            placeholder={placeholder ?? " "} disabled={disabled} required={required} minLength={minLength}
            maxLength={maxLength} autoFocus={autoFocus} inputMode={inputMode}
            autoComplete={autoComplete ?? (secure ? "current-password" : undefined)}
            spellCheck={secure ? false : undefined} autoCapitalize={secure ? "off" : undefined}
            aria-invalid={Boolean(error)} aria-describedby={describedBy} onChange={handleChange} />
          <label className={styles.label} htmlFor={id}>{label}</label>
        </div>
        {suffix && <span className={styles.affix}>{suffix}</span>}
        {secure && <button type="button" className={styles.trailing} aria-label={revealed ? "Hide password" : "Show password"} aria-pressed={revealed} onClick={() => setRevealed((visible) => !visible)} disabled={disabled}>{revealed ? "Hide" : "Show"}</button>}
        {!secure && trailingContent && <span className={styles.trailingContent}>{trailingContent}</span>}
      </div>
      <div className={styles.supportingRow}>
        <span id={error ? errorId : supportingId} className={error ? styles.error : styles.supporting} role={error ? "alert" : undefined}>{error || supportingText || ""}</span>
        {showCharacterCount && maxLength !== undefined && <span id={counterId} className={styles.counter}>{value.length}/{maxLength}</span>}
      </div>
    </div>
  );
}
