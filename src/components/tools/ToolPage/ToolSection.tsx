import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type ToolSectionProps = {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
};

export default function ToolSection({
  title,
  children,
  collapsible = false,
}: ToolSectionProps) {
  if (collapsible) {
    return (
      <details className="group border-t border-[var(--border)] first:border-t-0">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none transition-colors hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:py-5 [&::-webkit-details-marker]:hidden">
          <span className="m3-type-title-medium text-[var(--foreground)]">{title}</span>
          <MaterialIcon name="keyboard_arrow_down" size={24} className="shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180" />
        </summary>
        <div className="pb-5 m3-type-body-medium text-[var(--muted)] sm:pb-6">{children}</div>
      </details>
    );
  }

  return (
    <section className="border-t border-[var(--border)] py-5 first:border-t-0 sm:py-6">
      <h2 className="m3-type-title-medium text-[var(--foreground)]">{title}</h2>
      <div className="mt-3 m3-type-body-medium text-[var(--muted)]">{children}</div>
    </section>
  );
}