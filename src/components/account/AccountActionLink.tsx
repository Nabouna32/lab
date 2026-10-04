import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "border border-transparent bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]",
  danger:
    "border border-[var(--danger)] bg-transparent text-[var(--danger-foreground)] hover:bg-[var(--danger-soft)]",
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
        "inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-standard)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
