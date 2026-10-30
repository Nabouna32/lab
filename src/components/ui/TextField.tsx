import type { InputHTMLAttributes } from "react";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  inputId: string;
  unit?: string;
};

export function TextField({
  label,
  inputId,
  unit,
  className = "",
  type = "text",
  inputMode,
  step,
  placeholder,
  disabled = false,
  ...inputProps
}: TextFieldProps) {
  const resolvedInputMode = inputMode ?? (type === "number" ? "decimal" : undefined);
  const isInvalid = !disabled && Boolean(inputProps["aria-invalid"]);
  const inputClasses = [
    "min-h-[var(--m3-size-text-field-min-height)] w-full rounded-[var(--shape-corner-extra-small)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] ease-[var(--motion-standard-easing)] motion-reduce:transition-none placeholder:text-[var(--muted)]",
    "hover:border-[var(--border-strong)]",
    "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
    "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:cursor-not-allowed disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:bg-[var(--surface)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:placeholder:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    unit ? "pr-12" : "",
    className,
  ].join(" ");
  return (
    <div>
      <label htmlFor={inputId} className={"m3-type-body-medium mb-2 block " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : isInvalid ? "text-[var(--danger)]" : "text-[var(--foreground)]")}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          inputMode={resolvedInputMode}
          step={step ?? (type === "number" ? "any" : undefined)}
          disabled={disabled}
          placeholder={placeholder}
          {...inputProps}
          id={inputId}
          className={inputClasses}
        />
        {unit && (
          <span className={"m3-type-body-large pointer-events-none absolute inset-y-0 right-3.5 flex items-center " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : "text-[var(--muted)]")}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
