import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  inputId: string;
  unit?: string;
  /** M3 Fidelity is the unchanged Web baseline; Expressive is an opt-in source-backed Web adaptation. */
  variant?: "fidelity" | "expressive";
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
  variant = "fidelity",
  ...inputProps
}: TextFieldProps) {
  const resolvedInputMode = inputMode ?? (type === "number" ? "decimal" : undefined);
  const isExpressive = variant === "expressive";
  const isInvalid = !disabled && Boolean(inputProps["aria-invalid"]);
  const inputClasses = [
    "min-h-14 w-full rounded-[var(--shape-corner-extra-small)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] placeholder:text-[var(--muted)]",
    "hover:border-[var(--border-strong)]",
    "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
    "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:cursor-not-allowed disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:bg-[var(--surface)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:placeholder:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    unit ? "pr-12" : "",
    className,
  ].join(" ");
  const expressiveInputClasses = [
    "peer min-h-14 w-full rounded-[var(--shape-corner-extra-large)] border border-transparent bg-[var(--surface-container-highest)] px-3.5 pb-2 pt-5 text-[var(--on-surface)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] placeholder:text-transparent focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:placeholder:text-[var(--on-surface-variant)] motion-reduce:transition-none",
    "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
    "disabled:cursor-not-allowed disabled:bg-[var(--surface)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    unit ? "pr-12" : "",
    className,
  ].join(" ");

  if (isExpressive) {
    return (
      <div className="relative">
        <input
          id={inputId}
          type={type}
          inputMode={resolvedInputMode}
          step={step ?? (type === "number" ? "any" : undefined)}
          disabled={disabled}
          placeholder={placeholder ?? " "}
          {...inputProps}
          className={expressiveInputClasses}
        />
        <label
          htmlFor={inputId}
          className={[
            "m3-type-label-small pointer-events-none absolute left-3.5 top-2 z-10 text-[var(--on-surface-variant)] transition-[top,transform,font-size,color] duration-[var(--motion-standard)]",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[length:var(--m3-type-body-large-size)] peer-placeholder-shown:leading-[var(--m3-type-body-large-line-height)]",
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[length:var(--m3-type-label-small-size)] peer-focus:leading-[var(--m3-type-label-small-line-height)] peer-focus:text-[var(--primary)]",
            disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : isInvalid ? "text-[var(--danger)] peer-aria-[invalid=true]:text-[var(--danger)]" : "",
            "motion-reduce:transition-none",
          ].join(" ")}
        >
          {label}
        </label>
        {unit && (
          <span className={"m3-type-body-large pointer-events-none absolute inset-y-0 right-3.5 flex items-center " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : "text-[var(--on-surface-variant)]")}>
            {unit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={inputId} className={"m3-type-body-medium mb-2 block " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : isInvalid ? "text-[var(--danger)]" : "text-[var(--foreground)]")}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          inputMode={resolvedInputMode}
          step={step ?? (type === "number" ? "any" : undefined)}
          disabled={disabled}
          placeholder={placeholder}
          {...inputProps}
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
