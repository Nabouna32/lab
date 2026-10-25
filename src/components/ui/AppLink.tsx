import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { materialButtonVariantStyles } from "@/components/ui/material-button-variant-styles";

export type AppLinkVariant =
  | "inline"
  | "navigation"
  | "tonal"
  | "action-filled"
  | "action-elevated"
  | "action-filled-tonal"
  | "action-outlined"
  | "action-text";

export type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    variant?: AppLinkVariant;
  };

const actionBaseStyles = [
  "inline-flex min-h-12 shrink-0 items-center justify-center rounded-full py-2.5 text-sm font-semibold tracking-[.01em]",
  "transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-standard)] motion-reduce:transition-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
].join(" ");

const variantStyles: Record<AppLinkVariant, string> = {
  inline: [
    "rounded-sm text-[var(--primary)] underline decoration-[var(--outline-variant)] underline-offset-4",
    "transition-colors duration-[var(--motion-standard)] hover:decoration-current",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    "motion-reduce:transition-none",
  ].join(" "),
  navigation: [
    "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border border-transparent px-3",
    "text-sm font-semibold text-[var(--muted)] outline-none",
    "transition-[border-color,background-color,color] duration-[var(--motion-standard)]",
    "hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none",
  ].join(" "),
  tonal: [
    "inline-flex min-h-12 items-center justify-center rounded-full border border-transparent px-3",
    "text-sm font-semibold text-[var(--muted)] outline-none",
    "transition-[background-color,color,border-color] duration-[var(--motion-standard)]",
    "hover:border-[var(--outline-variant)]/60 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] motion-reduce:transition-none",
  ].join(" "),
  "action-filled": [actionBaseStyles, "px-5", materialButtonVariantStyles.filled].join(" "),
  "action-elevated": [actionBaseStyles, "px-5", materialButtonVariantStyles.elevated].join(" "),
  "action-filled-tonal": [actionBaseStyles, "px-5", materialButtonVariantStyles["filled-tonal"]].join(" "),
  "action-outlined": [actionBaseStyles, "px-5", materialButtonVariantStyles.outlined].join(" "),
  "action-text": [actionBaseStyles, "px-3", materialButtonVariantStyles.text].join(" "),
};

/**
 * Shared semantic link styles. Navigation remains a real anchor; action variants
 * reuse the Material button state-layer styles without changing link semantics.
 */
export default function AppLink({
  variant = "inline",
  className = "",
  ...props
}: AppLinkProps) {
  return (
    <NextLink
      {...props}
      className={[variantStyles[variant], className].filter(Boolean).join(" ")}
    />
  );
}
