import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
};

export function Panel({ children, className = "", as = "div" }: PanelProps) {
  const Component = as;

  return (
    <Component
      className={[
        "rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7",
        className,
      ].join(" ")}
    >
      {children}
    </Component>
  );
}