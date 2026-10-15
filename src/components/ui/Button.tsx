import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "filled" | "elevated" | "filled-tonal" | "outlined" | "text" | "primary" | "tonal" | "danger" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

const filled = "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]";
const elevated = "border border-transparent bg-[var(--surface-container-low)] text-[var(--primary)] shadow-[var(--shadow-sm)] hover:bg-[color-mix(in_srgb,var(--surface-container-low)_92%,var(--primary))] active:bg-[color-mix(in_srgb,var(--surface-container-low)_88%,var(--primary))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:shadow-none";
const filledTonal = "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const outlined = "border border-[var(--outline)] bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] active:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]";
const text = "border border-transparent bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] active:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]";
const danger = "border border-transparent bg-[var(--error)] text-[var(--on-error)] hover:bg-[color-mix(in_srgb,var(--error)_92%,var(--on-error))] active:bg-[color-mix(in_srgb,var(--error)_88%,var(--on-error))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)]";

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
  // App-specific semantic destructive action; it reuses M3 state and disabled roles.
  danger,
};

export function Button({ variant = "filled", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        // M3 small button baseline: 40px high, 64px minimum width, 14/20 label typography.
        // Keep labels on one line; action groups should wrap the buttons, not their text.
        "inline-flex min-h-10 min-w-16 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium leading-5 tracking-[.006em]",
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
