import type { ReactNode } from "react";

type ResultPanelProps = {
  label: string;
  value: ReactNode;
  emptyMessage?: string;
  tone?: "accent" | "neutral";
};

export function ResultPanel({ label, value, emptyMessage, tone = "neutral" }: ResultPanelProps) {
  const toneClass = tone === "accent"
    ? "border-[var(--accent)]/20 bg-[var(--accent-soft)]"
    : "border-[var(--border)] bg-[var(--background)]";
  const isEmpty = value === null || value === undefined;

  return (
    <div className={["rounded-[var(--radius-xl)] border p-5", toneClass].join(" ")}>
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <div className="mt-2 min-h-20 flex items-center">
        {isEmpty ? (
          <p className="text-sm leading-6 text-[var(--muted)]">{emptyMessage}</p>
        ) : (
          <p className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">{value}</p>
        )}
      </div>
    </div>
  );
}
