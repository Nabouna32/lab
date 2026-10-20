import type { ButtonHTMLAttributes } from "react";
import { ButtonRipple } from "@/components/ui/ButtonRipple";

export type ButtonVariant = "filled" | "elevated" | "filled-tonal" | "outlined" | "text" | "primary" | "tonal" | "danger" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** Applies Material 3 content padding for a leading icon; the caller still renders the icon. */
  leadingIcon?: boolean;
  /** Opt into wrapping a long label or honoring explicit line breaks. Constrain the width when wrapping is desired. */
  multiline?: boolean;
};

const disabledContainer10 = "disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]";
const disabledContainer12 = "disabled:bg-[color-mix(in_srgb,var(--on-surface)_12%,transparent)]";
const disabledContentVariant = "disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]";
const disabledContentSurface = "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const disabledOutline = "disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)]";

const filled = "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] hover:shadow-[var(--button-elevation-1)] focus-visible:bg-[color-mix(in_srgb,var(--primary)_90%,var(--on-primary))] active:shadow-none focus-visible:shadow-none " + disabledContainer10 + " " + disabledContentVariant + " disabled:shadow-none";
const elevated = "border border-transparent bg-[var(--surface-container-low)] text-[var(--primary)] shadow-[var(--button-elevation-1)] hover:shadow-[var(--button-elevation-2)] hover:bg-[color-mix(in_srgb,var(--surface-container-low)_92%,var(--primary))] focus-visible:bg-[color-mix(in_srgb,var(--surface-container-low)_90%,var(--primary))] focus-visible:shadow-[var(--button-elevation-1)] active:shadow-[var(--button-elevation-1)] " + disabledContainer10 + " " + disabledContentVariant + " disabled:shadow-none";
const filledTonal = "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] hover:shadow-[var(--button-elevation-1)] focus-visible:bg-[color-mix(in_srgb,var(--secondary-container)_90%,var(--on-secondary-container))] active:shadow-none focus-visible:shadow-none " + disabledContainer12 + " " + disabledContentSurface + " disabled:shadow-none";
const outlined = "border border-[var(--outline)] bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] " + disabledOutline + " " + disabledContentVariant;
const text = "border border-transparent bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] " + disabledContentVariant;
const danger = "border border-transparent bg-[var(--error)] text-[var(--on-error)] hover:bg-[color-mix(in_srgb,var(--error)_92%,var(--on-error))] " + disabledContainer12 + " " + disabledContentSurface;

const variants: Record<ButtonVariant, string> = {
  filled,
  elevated,
  "filled-tonal": filledTonal,
  outlined,
  text,
  // Compatibility aliases retained for existing call sites.
  primary: filled,
  tonal: filledTonal,
  secondary: outlined,
  ghost: text,
  // App-specific semantic destructive action; not an official M3 variant.
  danger,
};

export function Button({ variant = "filled", leadingIcon = false, multiline = false, className = "", type = "button", children, ...props }: ButtonProps) {
  const layout = multiline ? "min-w-0 shrink whitespace-pre-line text-center" : "min-w-[58px] shrink-0 whitespace-nowrap";
  const isTextVariant = variant === "text" || variant === "ghost";
  const textPadding = leadingIcon ? "pl-3 pr-4" : "px-3";
  const standardPadding = leadingIcon ? "pl-4 pr-6" : "px-6";
  const horizontalPadding = isTextVariant ? textPadding : standardPadding;
  return (
    <button
      type={type}
      className={[
        "relative isolate inline-flex min-h-10 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium leading-5 tracking-[.006em]",
        layout, horizontalPadding,
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        variants[variant], className,
      ].join(" ")}
      {...props}
    >
      {children}
      <ButtonRipple />
    </button>
  );
}
