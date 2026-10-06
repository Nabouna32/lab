import type { ReactNode } from "react";

type CalculatorShellProps = {
  children: ReactNode;
  className?: string;
};

export function CalculatorShell({ children, className = "" }: CalculatorShellProps) {
  return (
    <section
      className={[
        "relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] px-4 py-5 sm:px-6 sm:py-6 lg:px-7",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[var(--accent)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
