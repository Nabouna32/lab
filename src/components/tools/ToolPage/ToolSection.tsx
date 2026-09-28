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
      <details className="group rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-xl)] p-5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:p-6 [&::-webkit-details-marker]:hidden">
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">{title}</span>
          <span className="shrink-0 text-xl text-[var(--muted)] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-5 text-base leading-7 text-[var(--muted)] sm:px-6 sm:pb-6">
          {children}
        </div>
      </details>
    );
  }

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">{title}</h2>
      <div className="mt-5 text-base leading-7 text-[var(--muted)]">{children}</div>
    </section>
  );
}