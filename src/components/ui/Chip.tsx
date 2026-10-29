"use client";

import type { ButtonHTMLAttributes } from "react";
import { MaterialIcon, type MaterialIconName } from "@/components/ui/MaterialIcon";
import styles from "./Chip.module.css";

export type ChipVariant = "assist" | "elevated-assist" | "filter" | "elevated-filter" | "input" | "suggestion" | "elevated-suggestion";
type ChipBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: ChipVariant;
  label: string;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  leadingIcon?: MaterialIconName;
  trailingIcon?: MaterialIconName;
};

type ChipProps = ChipBaseProps &
  (
    | { onDismiss: () => void; dismissLabel: string }
    | { onDismiss?: undefined; dismissLabel?: never }
  );

/** Adaptation Web des chips Material 3 ; voir le contrat du composant pour les écarts documentés. */
export function Chip({
  variant = "assist",
  label,
  selected = false,
  onSelectedChange,
  leadingIcon,
  trailingIcon,
  onDismiss,
  className = "",
  onClick,
  ...props
}: ChipProps) {
  const filter = variant === "filter" || variant === "elevated-filter";
  const input = variant === "input";
  const isElevated = variant.startsWith("elevated-");

  return (
    <span className={[styles.wrap, isElevated ? styles.elevated : ""].filter(Boolean).join(" ")}>
      <button
        {...props}
        type={props.type ?? "button"}
        aria-pressed={filter || input ? selected : undefined}
        className={["m3-type-label-large", styles.chip, styles[variant], selected ? styles.selected : "", className].filter(Boolean).join(" ")}
        onClick={(event) => {
          onClick?.(event);
          if (filter && onSelectedChange && !props.disabled) onSelectedChange(!selected);
        }}
      >
        {selected && filter ? <MaterialIcon name="check" size={18} /> : leadingIcon ? <MaterialIcon name={leadingIcon} size={18} /> : null}
        <span>{label}</span>
        {trailingIcon && !input && <MaterialIcon name={trailingIcon} size={18} />}
      </button>
      {input && onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={dismissLabel}
          disabled={props.disabled}
          onClick={onDismiss}
        >
          <MaterialIcon name="close" size={16} />
        </button>
      )}
    </span>
  );
}
