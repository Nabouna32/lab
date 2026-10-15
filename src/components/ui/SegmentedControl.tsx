import type { ReactNode } from "react";

export type SegmentedControlItem<T extends string> = {
  id: T;
  label: ReactNode;
  disabled?: boolean;
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
      className={["grid grid-flow-col auto-cols-fr gap-0", className].join(" ")}
    >
      {items.map((item, index) => {
        const active = value === item.id;
        const edgeShape = items.length === 1
          ? "rounded-[var(--shape-corner-small)]"
          : index === 0
            ? "rounded-l-[var(--shape-corner-small)]"
            : index === items.length - 1
              ? "rounded-r-[var(--shape-corner-small)]"
              : "rounded-none";

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={[
              "relative min-h-10 min-w-0 whitespace-nowrap border border-[var(--outline)] px-3 py-2 text-center text-sm font-medium leading-5 tracking-[.006em] transition-[background-color,color,box-shadow] duration-[var(--motion-standard)]",
              index === 0 ? "" : "border-l-0",
              edgeShape,
              "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
              "disabled:cursor-not-allowed disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
              active
                ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))] active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))]"
                : "bg-transparent text-[var(--on-surface)] hover:bg-[color-mix(in_srgb,var(--on-surface)_8%,transparent)] active:bg-[color-mix(in_srgb,var(--on-surface)_12%,transparent)]",
            ].join(" ")}
          >
            <span className="block">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
