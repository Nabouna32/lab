import type { ReactNode } from "react";
import Link from "next/link";

type CardVariant = "elevated" | "filled" | "outlined";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
};

type CardContainerProps = CardProps & (
  | { href: string }
  | { href?: undefined }
);

const variantClasses: Record<CardVariant, string> = {
  elevated: "border border-transparent bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)]",
  filled: "border border-transparent bg-[var(--surface-variant)]",
  outlined: "border border-[var(--outline-variant)] bg-[var(--surface)]",
};

export function Card({ children, className = "", href, variant = "outlined" }: CardContainerProps) {
  const classes = [
    "rounded-[var(--radius-xl)]",
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <div className={classes}>{children}</div>;
}
