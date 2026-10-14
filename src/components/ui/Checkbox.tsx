import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "defaultChecked" | "onChange" | "className"
> & {
  inputId: string;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

export function Checkbox({
  inputId,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ...inputProps
}: CheckboxProps) {
  return (
    <label
      htmlFor={inputId}
      className={[
        "group flex min-h-12 cursor-pointer items-center gap-3 text-sm text-[var(--foreground)]",
        "disabled:cursor-not-allowed",
        disabled ? "cursor-not-allowed opacity-45" : "",
        className,
      ].join(" ")}
    >
      <input
        {...inputProps}
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={[
          "relative inline-flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-[var(--outline)] bg-[var(--surface)]",
          "transition-[background-color,border-color,box-shadow] duration-[var(--motion-standard)]",
          "peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--surface)]",
          "peer-disabled:cursor-not-allowed",
        ].join(" ")}
      >
        {checked && <MaterialIcon name="check" size={16} className="text-[var(--on-primary)]" />}
      </span>
      <span>{label}</span>
    </label>
  );
}
