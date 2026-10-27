import type { ReactNode } from "react";
import Link from "next/link";

type CardProps = { children: ReactNode; className?: string };

const baseClasses = "rounded-[var(--shape-corner-medium)]";
const filledClasses = "border border-transparent bg-[var(--surface-container-highest)]";
const elevatedClasses = "border border-transparent bg-[var(--surface-container-low)] shadow-[var(--shadow-sm)]";
const outlinedClasses = "border border-[var(--outline-variant)] bg-[var(--surface)]";

/** Partial Web port of androidx.compose.material3.Card (filled, non-interactive). */
export function Card({ children, className = "" }: CardProps) {
  return <div className={[baseClasses, filledClasses, className].filter(Boolean).join(" ")}>{children}</div>;
}

/** Partial Web port of androidx.compose.material3.ElevatedCard (non-interactive). */
export function ElevatedCard({ children, className = "" }: CardProps) {
  return <div className={[baseClasses, elevatedClasses, className].filter(Boolean).join(" ")}>{children}</div>;
}

/** Partial Web port of androidx.compose.material3.OutlinedCard (non-interactive). */
export function OutlinedCard({ children, className = "" }: CardProps) {
  return <div className={[baseClasses, outlinedClasses, className].filter(Boolean).join(" ")}>{children}</div>;
}

/** Loculary Web composition: an outlined card that navigates through a native link. */
export function CardLink({ children, className = "", href }: CardProps & { href: string }) {
  const classes = [
    baseClasses,
    outlinedClasses,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    className,
  ].filter(Boolean).join(" ");

  return <Link href={href} className={classes}>{children}</Link>;
}
