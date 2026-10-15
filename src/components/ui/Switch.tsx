import type { CSSProperties, InputHTMLAttributes } from "react";

type SwitchStyle = CSSProperties & {
  "--switch-active"?: string;
  "--switch-on-thumb"?: string;
  "--switch-track"?: string;
  "--switch-thumb"?: string;
  "--switch-outline"?: string;
  "--switch-focus-ring"?: string;
  "--switch-focus-offset"?: string;
  "--switch-disabled-track"?: string;
  "--switch-disabled-outline"?: string;
  "--switch-disabled-thumb"?: string;
};

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "role" | "checked" | "defaultChecked" | "onChange" | "className" | "style"
> & {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  style?: SwitchStyle;
};

export function Switch({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  style,
  ...inputProps
}: SwitchProps) {
  const semanticStyle: SwitchStyle = {
    "--switch-active": "var(--primary)",
    "--switch-on-thumb": "var(--on-primary)",
    "--switch-track": "var(--surface-container-highest)",
    "--switch-thumb": "var(--outline)",
    "--switch-outline": "var(--outline)",
    "--switch-focus-ring": "var(--focus-ring)",
    "--switch-focus-offset": "var(--background)",
    "--switch-disabled-track": "color-mix(in srgb, var(--on-surface) 12%, transparent)",
    "--switch-disabled-outline": "color-mix(in srgb, var(--on-surface) 38%, transparent)",
    "--switch-disabled-thumb": "color-mix(in srgb, var(--on-surface) 38%, transparent)",
    ...style,
    ...(disabled ? {
      "--switch-active": "var(--switch-disabled-track)",
      "--switch-on-thumb": "var(--switch-disabled-thumb)",
      "--switch-track": "var(--switch-disabled-track)",
      "--switch-thumb": "var(--switch-disabled-thumb)",
      "--switch-outline": "var(--switch-disabled-outline)",
    } : {}),
  };

  return (
    <label style={semanticStyle} className={["inline-flex cursor-pointer items-center", disabled ? "cursor-not-allowed" : "", className].join(" ")}>
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
          "relative inline-flex h-8 w-[52px] shrink-0 rounded-full border border-[var(--switch-outline)] bg-[var(--switch-track)]",
          "transition-[background-color,border-color] duration-[var(--motion-standard)]",
          "peer-checked:border-[var(--switch-active)] peer-checked:bg-[var(--switch-active)]",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--switch-focus-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--switch-focus-offset)]",
          "peer-disabled:cursor-not-allowed",
          "after:absolute after:left-[7px] after:top-[7px] after:h-4 after:w-4 after:rounded-full after:bg-[var(--switch-thumb)]",
          "after:transition-[width,height,transform,background-color] after:duration-[var(--motion-standard)]",
          "peer-checked:after:left-[7px] peer-checked:after:top-[3px] peer-checked:after:h-6 peer-checked:after:w-6 peer-checked:after:translate-x-[18px] peer-checked:after:bg-[var(--switch-on-thumb)]",
        ].join(" ")}
      />
    </label>
  );
}
