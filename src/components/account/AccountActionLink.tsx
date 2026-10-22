import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "border border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_92%,var(--on-primary))] active:bg-[color-mix(in_srgb,var(--primary)_88%,var(--on-primary))] active:scale-[.98]",
  secondary:
    "border border-[var(--outline)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--foreground))] active:bg-[color-mix(in_srgb,var(--surface)_88%,var(--foreground))] active:scale-[.98]",
  danger:
    "border border-transparent bg-transparent text-[var(--error)] hover:bg-[color-mix(in_srgb,var(--error)_8%,transparent)] active:scale-[.98]",
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
        "inline-flex min-h-12 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-[.01em]",
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
