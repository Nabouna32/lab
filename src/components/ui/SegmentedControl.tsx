import type { ReactNode } from "react";

export type SegmentedControlItem<T extends string> = {
  id: T;
  label: ReactNode;
  description?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  items: readonly SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={["grid gap-1 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-soft)] p-1", className].join(" ")}
    >
      {items.map((item) => {
        const active = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.id)}
            className={[
              "rounded-[var(--radius-md)] px-3.5 py-2.5 text-left transition-[background-color,color,box-shadow] duration-[var(--motion-standard)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-soft)]",
              active
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                : "text-[var(--muted)] hover:bg-[var(--surface)]/70 hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            <span className="block font-semibold">{item.label}</span>
            {item.description && (
              <span className="mt-0.5 block text-xs text-[var(--muted)]">{item.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}