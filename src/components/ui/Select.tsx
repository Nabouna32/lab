import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, id, className = "", ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      <select
        id={id}
        className={[
          "min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-medium text-[var(--foreground)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-standard)]",
          "hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]",
          "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:focus-visible:border-[var(--danger)] aria-[invalid=true]:focus-visible:ring-[var(--danger)]/20",
          "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:cursor-not-allowed disabled:bg-[var(--surface-soft)] disabled:opacity-60",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
}