"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { MaterialIconName } from "@/components/ui/MaterialIcon";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import styles from "./FloatingActionButton.module.css";

export type FloatingActionButtonSize = "small" | "default" | "large" | "extended";
type FloatingActionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  size?: FloatingActionButtonSize;
  icon?: MaterialIconName;
  label?: string;
  ariaLabel?: string;
  children?: ReactNode;
};

/** Source-informed Web adaptation of AndroidX Material 3 FAB variants. */
export function FloatingActionButton({
  size = "default", icon = "add", label, ariaLabel, children, className = "", ...props
}: FloatingActionButtonProps) {
  const extended = size === "extended";
  const accessibleName = ariaLabel ?? label;
  return <button {...props}
    type={props.type ?? "button"}
    aria-label={extended ? undefined : accessibleName}
    className={[styles.fab, styles[size], className].filter(Boolean).join(" ")}
    data-size={size}>
    {icon && <MaterialIcon name={icon} size={size === "large" ? 36 : 24} />}
    {extended && <span>{label ?? children}</span>}
    {!extended && children}
  </button>;
}
