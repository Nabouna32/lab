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
      <details className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:p-7 [&::-webkit-details-marker]:hidden">
          <span className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{title}</span>
          <span className="shrink-0 text-xl text-[var(--muted)] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-5 text-base leading-7 text-[var(--muted)] sm:px-7 sm:pb-7">
          {children}
        </div>
      </details>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
      <div className="mt-5 text-base leading-7 text-[var(--muted)]">{children}</div>
    </section>
  );
}
