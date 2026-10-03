import type { ReactNode } from "react";

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
          <span className="text-base font-bold tracking-tight text-[var(--foreground)] sm:text-lg">{title}</span>
          <span className="shrink-0 text-lg text-[var(--muted)] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="pb-5 text-sm leading-6 text-[var(--muted)] sm:pb-6">{children}</div>
      </details>
    );
  }

  return (
    <section className="border-t border-[var(--border)] py-5 first:border-t-0 sm:py-6">
      <h2 className="text-base font-bold tracking-tight text-[var(--foreground)] sm:text-lg">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[var(--muted)]">{children}</div>
    </section>
  );
}