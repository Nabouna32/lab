import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--accent-soft)] p-4">{children}</div>;
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-4">
      {children}
    </div>
  );
}
