"use client";

import { useId, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./MaterialTextField.module.css";

type MaterialTextFieldBaseProps = {
  id: string; name?: string; label: string; value: string; onChange: (value: string) => void;
  variant?: "filled" | "outlined"; type?: "text" | "email" | "number" | "search" | "password";
  placeholder?: string; supportingText?: string; error?: string; prefix?: ReactNode; suffix?: ReactNode;
  leadingContent?: ReactNode; trailingContent?: ReactNode; minLength?: number; maxLength?: number;
  showCharacterCount?: boolean; disabled?: boolean; required?: boolean;
  autoComplete?: string; autoFocus?: boolean; inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
};

type MaterialTextFieldSecurityProps =
  | { secure?: false; showPasswordLabel?: never; hidePasswordLabel?: never }
  | { secure: true; type: "password"; showPasswordLabel: string; hidePasswordLabel: string };

export type MaterialTextFieldProps = MaterialTextFieldBaseProps & MaterialTextFieldSecurityProps;

/** React/Web adaptation of AndroidX Material 3 TextField and OutlinedTextField. */
export function MaterialTextField(props: MaterialTextFieldProps) {
  const {
    id, name, label, value, onChange, variant = "outlined", type = "text", placeholder,
    supportingText, error, prefix, suffix, leadingContent, trailingContent, minLength, maxLength,
    secure = false, disabled = false, required = false, autoComplete,
    autoFocus = false, inputMode, showCharacterCount = false,
  } = props;
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
        {secure && (
          <IconButton
            label={revealed ? props.hidePasswordLabel! : props.showPasswordLabel!}
            onClick={() => setRevealed((visible) => !visible)}
            disabled={disabled}
          >
            <MaterialIcon name={revealed ? "visibility_off" : "visibility"} size={24} />
          </IconButton>
        )}
        {!secure && trailingContent && <span className={styles.trailingContent}>{trailingContent}</span>}
      </div>
      <div className={styles.supportingRow}>
        <span id={error ? errorId : supportingId} className={error ? styles.error : styles.supporting}>{error || supportingText || ""}</span>
        {showCharacterCount && maxLength !== undefined && <span id={counterId} className={styles.counter}>{value.length}/{maxLength}</span>}
      </div>
    </div>
  );
}
