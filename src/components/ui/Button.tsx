import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "tonal" | "outlined" | "text" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

const variants: Record<ButtonVariant, string> = {
  primary: "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-[.94] active:scale-[.98]",
  tonal: "border border-transparent bg-[var(--primary-container)] text-[var(--on-primary-container)] hover:brightness-[.97] active:scale-[.98]",
  outlined: "border border-[var(--outline)] bg-transparent text-[var(--primary)] hover:bg-[var(--surface-soft)] active:scale-[.98]",
  text: "border border-transparent bg-transparent text-[var(--primary)] hover:bg-[var(--surface-soft)] active:scale-[.98]",
  // Compatibility names retained while existing call sites migrate by intent.
  secondary: "border border-[var(--outline)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-soft)] active:scale-[.98]",
  ghost: "border border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
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
