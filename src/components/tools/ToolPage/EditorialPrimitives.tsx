import type { ReactNode } from "react";
import { Card as SharedCard } from "@/components/ui/Card";

export function Card({ children }: { children: ReactNode }) {
  return <SharedCard className="mt-4 p-4">{children}</SharedCard>;
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-[var(--shape-corner-medium)] bg-[var(--surface-soft)] p-4">
      {children}
    </div>
  );
}
