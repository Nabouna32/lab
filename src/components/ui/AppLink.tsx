import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export type AppLinkVariant = "inline" | "navigation" | "tonal";

type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    variant?: AppLinkVariant;
  };

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
};

/**
 * Shared semantic link styles. Keep navigation as a real anchor and choose
 * the visual treatment by context rather than using a button for navigation.
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
