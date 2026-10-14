import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "tonal" | "outlined" | "text" | "danger" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

const variants: Record<ButtonVariant, string> = {
  primary: "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] active:scale-[.98]",
  tonal: "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))] active:scale-[.98]",
  outlined: "border border-[var(--outline)] bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--primary))] active:bg-[color-mix(in_srgb,var(--surface)_88%,var(--primary))] active:scale-[.98]",
  text: "border border-transparent bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--primary))] active:bg-[color-mix(in_srgb,var(--surface)_88%,var(--primary))] active:scale-[.98]",
  danger: "border border-transparent bg-[var(--error)] text-[var(--on-error)] hover:bg-[color-mix(in_srgb,var(--error)_92%,var(--on-error))] active:bg-[color-mix(in_srgb,var(--error)_88%,var(--on-error))] active:scale-[.98]",
  // Compatibility names retained while existing call sites migrate by intent.
  secondary: "border border-[var(--outline)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--foreground))] active:bg-[color-mix(in_srgb,var(--surface)_88%,var(--foreground))] active:scale-[.98]",
  ghost: "border border-transparent bg-transparent text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--on-surface-variant))] hover:text-[var(--foreground)] active:bg-[color-mix(in_srgb,var(--surface)_88%,var(--on-surface-variant))]",
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-[.01em]",
        "transition-[background-color,border-color,color,box-shadow,transform,filter] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
