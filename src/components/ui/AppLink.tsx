import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { ButtonColors } from "@/components/ui/Button";
import { getMaterialButtonInlineStyle, materialButtonVariantStyles, type MaterialButtonVariant } from "@/components/ui/material-button-variant-styles";
import { ButtonRipple } from "@/components/ui/ButtonRipple";
import { getMaterialButtonLayoutClasses } from "@/components/ui/material-button-layout";

export type AppLinkVariant = "inline" | "navigation" | MaterialButtonVariant;

export type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    variant?: AppLinkVariant;
    /** Apply AndroidX Button leading-icon insets while retaining anchor semantics. */
    leadingIcon?: boolean;
    /** Same semantic color overrides as AndroidX ButtonColors, applied to the link appearance. */
    colors?: ButtonColors;
  };

const variantStyles: Partial<Record<AppLinkVariant, string>> = {
  inline: [
    "rounded-sm text-[var(--primary)] underline decoration-[var(--outline-variant)] underline-offset-4",
    "transition-colors duration-[var(--motion-standard)] hover:decoration-current",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    "motion-reduce:transition-none",
  ].join(" "),
  navigation: [
    "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[var(--shape-corner-full)] border border-transparent px-3",
    "m3-type-label-large text-[var(--muted)] outline-none",
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
  style,
  colors,
  children,
  ...props
}: AppLinkProps) {
  const isMaterialButton = variant === "filled" || variant === "elevated" || variant === "filled-tonal" || variant === "outlined" || variant === "text";
  const mergedStyle = getMaterialButtonInlineStyle(isMaterialButton ? variant as MaterialButtonVariant : null, colors, style);
  const materialButtonLayout = isMaterialButton
    ? [
        getMaterialButtonLayoutClasses(variant, { leadingIcon }),
        materialButtonVariantStyles[variant],
      ].join(" ")
    : null;

  return (
    <NextLink
      {...props}
      data-material-button-link={isMaterialButton ? "true" : undefined}
      style={mergedStyle}
      className={[materialButtonLayout ?? variantStyles[variant], className].filter(Boolean).join(" ")}
    >
      {children}
      {isMaterialButton ? <ButtonRipple /> : null}
    </NextLink>
  );
}
