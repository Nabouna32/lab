import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  inputId: string;
  /** Fidelity keeps the Web baseline; Expressive is a source-informed visual adaptation. */
  variant?: "fidelity" | "expressive";
  helperText?: string;
  error?: string;
};

/**
 * Web implementation of a multiline Material 3 TextField use case.
 * AndroidX exposes TextField with minLines/maxLines; TextArea is not a separate
 * named Material 3 Compose component. This component does not claim Compose parity.
 */
export function TextArea({
  label,
  inputId,
  className = "",
  disabled = false,
  variant = "fidelity",
  helperText,
  error,
  rows = 4,
  placeholder,
  ...props
}: TextAreaProps) {
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const expressive = variant === "expressive";

  return (
    <div className="grid gap-2">
      <label
        htmlFor={inputId}
        className={"block text-sm font-medium " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : "text-[var(--foreground)]")}
      >
        {label}
      </label>
      <textarea
        id={inputId}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={[
          "w-full resize-y border px-[var(--m3-space-3)] py-[var(--m3-space-3)] text-[var(--on-surface)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)] placeholder:text-[var(--on-surface-variant)]",
          expressive
            ? "min-h-[var(--m3-size-multiline-text-field-min-height)] rounded-[var(--shape-corner-extra-large)] border-transparent bg-[var(--surface-container-highest)]"
            : "min-h-[var(--m3-size-multiline-text-field-min-height)] rounded-[var(--shape-corner-extra-small)] border-[var(--outline)] bg-[var(--surface)]",
          "hover:border-[var(--outline)]",
          "focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "aria-[invalid=true]:border-[var(--error)] aria-[invalid=true]:focus-visible:ring-[var(--error)]/20",
          "disabled:cursor-not-allowed disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:bg-[var(--surface)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:placeholder:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
          "motion-reduce:transition-none",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs leading-4 text-[var(--error)]">{error}</p>
      ) : helperText ? (
        <p id={helperId} className="text-xs leading-4 text-[var(--on-surface-variant)]">{helperText}</p>
      ) : null}
    </div>
  );
}
