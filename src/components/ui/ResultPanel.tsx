import type { ReactNode } from "react";

type ResultPanelProps = {
  label: string;
  value: ReactNode;
  emptyMessage?: string;
  tone?: "accent" | "neutral";
  actions?: ReactNode;
};

export function ResultPanel({ label, value, emptyMessage, tone = "neutral", actions }: ResultPanelProps) {
  const toneClasses =
    tone === "accent"
      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
      : "border-[var(--border)] bg-[var(--surface-soft)]";
  const isEmpty = value === null || value === undefined;

  return (
    <section
      aria-label={label}
      className={["border-l-2 px-4 py-4 sm:px-5", toneClasses].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div aria-live="polite" className="mt-2 min-h-16 flex items-center">
        {isEmpty ? (
          <p className="text-sm leading-6 text-[var(--muted)]">{emptyMessage}</p>
        ) : (
          <p className="text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">{value}</p>
        )}
      </div>
    </section>
  );
}
