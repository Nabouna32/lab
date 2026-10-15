import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type IconButtonVariant = "standard" | "filled" | "filled-tonal" | "tonal" | "outlined";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children" | "aria-pressed"> & {
  label: string;
  children: ReactNode;
  variant?: IconButtonVariant;
  /** Pass only for toggle actions; momentary actions should omit it. */
  selected?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

const standard = "border border-transparent bg-transparent text-[var(--on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] hover:text-[var(--foreground)] active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const filled = "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const filledTonal = "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const outlined = "border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)] disabled:border-[color-mix(in_srgb,var(--outline-variant)_38%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";

const variants: Record<IconButtonVariant, string> = {
  standard,
  filled,
  "filled-tonal": filledTonal,
  // Compatibility name retained for existing call sites.
  tonal: filledTonal,
  outlined,
};

export function IconButton({
  label,
  children,
  className = "",
  type = "button",
  variant = "standard",
  selected,
  ref,
  ...props
}: IconButtonProps) {
  // Android guidance uses a 48dp touch target; 48×48 CSS px is this web implementation choice, not a dp equivalence.
  const selectedStyles = !selected ? "" : ({
    standard: "text-[var(--primary)] hover:text-[var(--primary)] active:text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] active:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]",
    filled: "",
    "filled-tonal": "bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[color-mix(in_srgb,var(--secondary)_92%,var(--on-secondary))] active:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--on-secondary))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
    tonal: "bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[color-mix(in_srgb,var(--secondary)_92%,var(--on-secondary))] active:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--on-secondary))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
    outlined: "bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] hover:bg-[color-mix(in_srgb,var(--inverse-surface)_92%,var(--inverse-on-surface))] active:bg-[color-mix(in_srgb,var(--inverse-surface)_88%,var(--inverse-on-surface))] disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
  } satisfies Record<IconButtonVariant, string>)[variant];
  const dimensions = "h-12 min-h-12 w-12 min-w-12";

  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={selected}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
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
