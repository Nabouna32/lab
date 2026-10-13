import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
  size?: "default" | "compact";
  variant?: IconButtonVariant;
};

const variants: Record<IconButtonVariant, string> = {
  standard: "border border-transparent bg-transparent text-[var(--on-surface-variant)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
  filled: "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-[.94] shadow-[var(--shadow-sm)]",
  tonal: "border border-transparent bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:brightness-[.97]",
  outlined: "border border-[var(--outline)] bg-transparent text-[var(--on-surface-variant)] hover:bg-[var(--surface-soft)]",
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
        "transition-[background-color,border-color,color,box-shadow,transform,filter] duration-[var(--motion-standard)]",
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
