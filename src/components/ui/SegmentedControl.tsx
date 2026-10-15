import type { KeyboardEvent, ReactNode } from "react";

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
      role="radiogroup"
      aria-label={ariaLabel}
      className={["grid grid-flow-col auto-cols-fr gap-0", className].join(" ")}
    >
      {items.map((item, index) => {
        const active = value === item.id;
        const edgeShape = items.length === 1
          ? "rounded-full"
          : index === 0
            ? "rounded-l-full"
            : index === items.length - 1
              ? "rounded-r-full"
              : "rounded-none";

        const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
          const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
          const boundary = event.key === "Home" ? 1 : event.key === "End" ? -1 : 0;
          if (!direction && !boundary) return;
          event.preventDefault();
          for (let step = 1; step <= items.length; step += 1) {
            const nextIndex = boundary === 1 ? step - 1 : boundary === -1 ? items.length - step : (index + direction * step + items.length * 2) % items.length;
            const nextItem = items[nextIndex];
            if (nextItem && !nextItem.disabled) {
              onChange(nextItem.id);
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
              return;
            }
          }
        };

        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={handleKeyDown}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={[
              "relative min-h-[var(--m3-size-segmented-button-min-height)] min-w-0 whitespace-nowrap border border-[var(--outline)] px-[var(--m3-space-3)] py-[var(--m3-space-2)] text-center text-[length:var(--m3-type-label-large-size)] font-medium leading-[var(--m3-type-label-large-line-height)] tracking-[.006em] transition-[background-color,color,box-shadow] duration-[var(--motion-standard)]",
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
