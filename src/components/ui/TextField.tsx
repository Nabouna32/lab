import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
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
  disabled = false,
  ...inputProps
}: TextFieldProps) {
  const resolvedInputMode = inputMode ?? (type === "number" ? "decimal" : undefined);

  return (
    <div>
      <label htmlFor={inputId} className={"mb-2 block text-sm font-medium " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : "text-[var(--foreground)]")}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          inputMode={resolvedInputMode}
          step={type === "number" ? "any" : undefined}
          disabled={disabled}
          {...inputProps}
          className={[
            "min-h-12 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] placeholder:text-[var(--muted)]",
            "hover:border-[var(--border-strong)]",
            "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
            "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            "disabled:cursor-not-allowed disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:bg-[var(--surface)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:placeholder:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
            unit ? "pr-12" : "",
            className,
          ].join(" ")}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-[var(--muted)]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
