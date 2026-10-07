import type { ReactNode } from "react";

type ResultPanelProps = {
  label: string;
  value: ReactNode;
  emptyMessage?: string;
  tone?: "accent" | "neutral";
  actions?: ReactNode;
};

export function ResultPanel({ label, value, emptyMessage, tone = "neutral", actions }: ResultPanelProps) {
  const toneClass =
    tone === "accent"
      ? "border-[var(--accent)]/25 bg-[var(--accent-soft)]"
      : "border-[var(--border)] bg-[var(--surface-soft)]";
  const isEmpty = value === null || value === undefined;

  return (
    <section
      aria-label={label}
      className={["rounded-[var(--radius-lg)] border p-5", toneClass].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-[var(--muted)]">{label}</p>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div
        aria-live="polite"
        className="mt-2 min-h-20 flex items-center"
      >
        {isEmpty ? (
          <p className="text-sm leading-6 text-[var(--muted)]">{emptyMessage}</p>
        ) : (
          <p className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">{value}</p>
        )}
      </div>
    </section>
  );
}
