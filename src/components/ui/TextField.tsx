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
  ...inputProps
}: TextFieldProps) {
  const resolvedInputMode = inputMode ?? (type === "number" ? "decimal" : undefined);

  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          inputMode={resolvedInputMode}
          step={type === "number" ? "any" : undefined}
          {...inputProps}
          className={[
            "min-h-11 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] placeholder:text-[var(--muted)]",
            "hover:border-[var(--border-strong)]",
            "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
            "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
            "disabled:cursor-not-allowed disabled:bg-[var(--surface-soft)] disabled:opacity-60",
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