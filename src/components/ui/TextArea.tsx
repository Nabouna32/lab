import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  inputId: string;
};

export function TextArea({ label, inputId, className = "", disabled = false, ...props }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={inputId} className={"mb-2 block text-sm font-medium " + (disabled ? "text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]" : "text-[var(--foreground)]")}>
        {label}
      </label>
      <textarea
        id={inputId}
        disabled={disabled}
        className={[
          "min-h-56 w-full resize-y rounded-[var(--shape-corner-extra-small)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-[var(--foreground)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-standard)] placeholder:text-[var(--muted)]",
          "hover:border-[var(--border-strong)]",
          "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
          "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:cursor-not-allowed disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)] disabled:bg-[var(--surface)] disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] disabled:placeholder:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
}
