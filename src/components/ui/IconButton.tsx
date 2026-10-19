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

const standard = "border border-transparent bg-transparent text-[var(--on-surface-variant)] group-hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] group-active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const filled = "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] group-hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] group-active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const filledTonal = "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] group-hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] group-active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";
const outlined = "border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface-variant)] group-hover:bg-[color-mix(in_srgb,var(--on-surface-variant)_8%,transparent)] group-active:bg-[color-mix(in_srgb,var(--on-surface-variant)_12%,transparent)] group-disabled:border-[color-mix(in_srgb,var(--outline-variant)_38%,transparent)] group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]";

const variants: Record<IconButtonVariant, string> = {
  standard,
  filled,
  "filled-tonal": filledTonal,
  // Compatibility name retained for existing call sites.
  tonal: filledTonal,
  outlined,
};

const selectedStyles: Record<IconButtonVariant, string> = {
  standard: "text-[var(--primary)] group-hover:text-[var(--primary)] group-active:text-[var(--primary)] group-hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] group-active:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]",
  filled: "",
  "filled-tonal": "bg-[var(--secondary)] text-[var(--on-secondary)] group-hover:bg-[color-mix(in_srgb,var(--secondary)_92%,var(--on-secondary))] group-active:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--on-secondary))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
  tonal: "bg-[var(--secondary)] text-[var(--on-secondary)] group-hover:bg-[color-mix(in_srgb,var(--secondary)_92%,var(--on-secondary))] group-active:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--on-secondary))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
  outlined: "border-transparent bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] group-hover:bg-[color-mix(in_srgb,var(--inverse-surface)_92%,var(--inverse-on-surface))] group-active:bg-[color-mix(in_srgb,var(--inverse-surface)_88%,var(--inverse-on-surface))] group-disabled:bg-[color-mix(in_srgb,var(--on-surface)_10%,transparent)]",
};

const targetDimensions = "h-12 min-h-12 w-12 min-w-12";
const surfaceDimensions = "h-10 min-h-10 w-10 min-w-10";

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
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={selected}
      className={[
        "group inline-flex shrink-0 items-center justify-center rounded-full bg-transparent p-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        targetDimensions,
        className,
      ].join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex shrink-0 items-center justify-center rounded-full",
          "transition-[background-color,border-color,color] duration-[var(--motion-standard)] motion-reduce:transition-none",
          surfaceDimensions,
          variants[variant],
          selectedStyles[variant] && selected ? selectedStyles[variant] : "",
        ].join(" ")}
      >
        {children}
      </span>
    </button>
  );
}
