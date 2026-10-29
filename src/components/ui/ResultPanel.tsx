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
      ? "border-[var(--accent)]/25 bg-[var(--surface-soft)]"
      : "border-[var(--border)] bg-[var(--surface-soft)]";
  const isEmpty = value === null || value === undefined;

  return (
    <section
      aria-label={label}
      className={["rounded-[var(--shape-corner-medium)] border p-5", toneClass].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="m3-type-label-medium text-[var(--muted)]">{label}</p>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div
        aria-live="polite"
        className="mt-2 min-h-20 flex items-center"
      >
        {isEmpty ? (
          <p className="m3-type-body-medium text-[var(--muted)]">{emptyMessage}</p>
        ) : (
          <p className="m3-type-display-small text-[var(--foreground)] sm:text-[length:var(--m3-type-display-medium-size)] sm:leading-[var(--m3-type-display-medium-line-height)] sm:font-[var(--m3-type-display-medium-weight)] sm:tracking-[var(--m3-type-display-medium-tracking)]">{value}</p>
        )}
      </div>
    </section>
  );
}
