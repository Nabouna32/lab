import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-[.94] active:scale-[.98]",
  secondary:
    "border border-[var(--outline)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-soft)] active:scale-[.98]",
  danger:
    "border border-[var(--error)] bg-transparent text-[var(--error)] hover:bg-[var(--error-container)] active:scale-[.98]",
};

type AccountActionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    variant?: Variant;
  };

export function AccountActionLink({
  children,
  variant = "secondary",
  className = "",
  ...props
}: AccountActionLinkProps) {
  return (
    <Link
      {...props}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-[.01em]",
        "transition-[background-color,border-color,color,box-shadow,transform,filter] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
