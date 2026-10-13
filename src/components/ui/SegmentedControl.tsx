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
      className={["grid grid-flow-col auto-cols-fr gap-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-soft)] p-1", className].join(" ")}
    >
      {items.map((item, index) => {
        const active = value === item.id;
        const edgeShape = [
          index === 0 ? "rounded-l-full" : "rounded-l-sm",
          index === items.length - 1 ? "rounded-r-full" : "rounded-r-sm",
        ].join(" ");

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.id)}
            className={[
              "relative min-h-10 min-w-0 px-3 py-2.5 text-center text-sm transition-[background-color,color,box-shadow,transform] duration-[var(--motion-standard)]",
              edgeShape,
              "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-soft)]",
              active
                ? "z-[1] bg-[var(--secondary-container)] font-semibold text-[var(--on-secondary-container)] shadow-[var(--shadow-sm)]"
                : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            <span className="block">{item.label}</span>
            {item.description && (
              <span className="mt-0.5 block text-xs font-normal opacity-80">{item.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
