import type { InputHTMLAttributes } from "react";

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "role" | "checked" | "defaultChecked" | "onChange" | "className"
> & {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

export function Switch({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ...inputProps
}: SwitchProps) {
  return (
    <label className={["inline-flex cursor-pointer items-center", disabled ? "cursor-not-allowed" : "", className].join(" ")}>
      <input
        {...inputProps}
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={[
          "relative inline-flex h-8 w-[52px] shrink-0 rounded-full border border-[var(--outline)] bg-[var(--surface-container-highest)]",
          "transition-[background-color,border-color] duration-[var(--motion-standard)]",
          "peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-45",
          "after:absolute after:left-[7px] after:top-[7px] after:h-4 after:w-4 after:rounded-full after:bg-[var(--outline)]",
          "after:transition-[width,height,transform,background-color] after:duration-[var(--motion-standard)]",
          "peer-checked:after:left-[7px] peer-checked:after:top-[3px] peer-checked:after:h-6 peer-checked:after:w-6 peer-checked:after:translate-x-[18px] peer-checked:after:bg-[var(--on-primary)]",
        ].join(" ")}
      />
    </label>
  );
}
