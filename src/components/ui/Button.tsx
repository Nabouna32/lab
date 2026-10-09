import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

const variants: Record<ButtonVariant, string> = {
  primary: "border border-transparent bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)]",
  secondary: "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]",
  ghost: "border border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-lg)] px-4 py-2.5 text-sm font-semibold",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
