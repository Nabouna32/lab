import type { ReactNode } from "react";
import styles from "./ToggleButton.module.css";

export type ToggleButtonVariant = "filled" | "filled-tonal" | "outlined" | "elevated";
export type ToggleButtonSize = "extra-small" | "small" | "medium" | "large" | "extra-large";

export type ToggleButtonProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  variant?: ToggleButtonVariant;
  size?: ToggleButtonSize;
  disabled?: boolean;
  className?: string;
};

/** Shared Web adaptation of AndroidX Material 3 ToggleButton variants and sizes. */
export function ToggleButton({
  label,
  checked,
  onCheckedChange,
  icon,
  variant = "filled",
  size = "small",
  disabled = false,
  className = "",
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={[styles.button, styles[variant], styles[size], checked ? styles.checked : "", className].filter(Boolean).join(" ")}
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
