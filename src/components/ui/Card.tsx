import type { ReactNode } from "react";
import Link from "next/link";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type CardContainerProps = CardProps & (
  | { href: string }
  | { href?: undefined }
);

const baseClasses =
  "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]";

export function Card({ children, className = "", href }: CardContainerProps) {
  const classes = [baseClasses, className].join(" ");

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <div className={classes}>{children}</div>;
}
