import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children" | "aria-pressed"> & {
  label: string;
  children: ReactNode;
  variant?: IconButtonVariant;
  /** Pass only for toggle actions; momentary actions should omit it. */
  selected?: boolean;
};

const variants: Record<IconButtonVariant, string> = {
  standard: "border border-transparent bg-transparent text-[var(--on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] hover:text-[var(--foreground)] active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)]",
  filled: "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] shadow-[var(--shadow-sm)]",
  tonal: "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))]",
  outlined: "border border-[var(--outline)] bg-transparent text-[var(--on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)]",
};

export function IconButton({
  label,
  children,
  className = "",
  type = "button",
  variant = "standard",
  selected,
  ...props
}: IconButtonProps) {
  // M3 icon buttons require a 48×48px minimum touch target and typically a 24px icon.
  const selectedStyles = selected && (variant === "standard" || variant === "outlined")
    ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
    : "";
  const dimensions = "h-12 min-h-12 w-12 min-w-12";

  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={selected}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        selectedStyles,
        dimensions,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
