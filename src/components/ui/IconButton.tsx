import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
  size?: "default" | "compact";
  variant?: IconButtonVariant;
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
  size = "default",
  variant = "standard",
  ...props
}: IconButtonProps) {
  const dimensions = size === "compact" ? "h-10 w-10" : "h-12 w-12";

  return (
    <button
      type={type}
      aria-label={label}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-standard)]",
        "active:scale-[.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        dimensions,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
