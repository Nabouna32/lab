import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { materialButtonVariantStyles, type MaterialButtonVariant } from "@/components/ui/material-button-variant-styles";
import { ButtonRipple } from "@/components/ui/ButtonRipple";

export type AppLinkVariant = "inline" | "navigation" | MaterialButtonVariant;

type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    variant?: AppLinkVariant;
    /** Apply AndroidX Button leading-icon insets while retaining anchor semantics. */
    leadingIcon?: boolean;
  };

const variantStyles: Partial<Record<AppLinkVariant, string>> = {
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
};

/**
 * Shared semantic link styles. Keep navigation as a real anchor and choose
 * the visual treatment by context rather than using a button for navigation.
 */
export default function AppLink({
  variant = "inline",
  leadingIcon = false,
  className = "",
  children,
  ...props
}: AppLinkProps) {
  const isMaterialButton = variant === "filled" || variant === "elevated" || variant === "filled-tonal" || variant === "outlined" || variant === "text";
  const isTextVariant = variant === "text";
  const horizontalPadding = isTextVariant
    ? leadingIcon ? "pl-3 pr-4" : "px-3"
    : leadingIcon ? "pl-4 pr-6" : "px-6";
  const materialButtonLayout = [
    "relative isolate inline-flex min-h-10 min-w-[58px] shrink-0 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium leading-5 tracking-[.006em] whitespace-nowrap",
    horizontalPadding,
    "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)] motion-reduce:transition-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    materialButtonVariantStyles[variant as MaterialButtonVariant],
  ].join(" ");

  return (
    <NextLink
      {...props}
      data-material-button-link={isMaterialButton ? "true" : undefined}
      className={[isMaterialButton ? materialButtonLayout : variantStyles[variant], className].filter(Boolean).join(" ")}
    >
      {children}
      {isMaterialButton ? <ButtonRipple /> : null}
    </NextLink>
  );
}
