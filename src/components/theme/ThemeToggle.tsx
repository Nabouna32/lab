"use client";

import { useTheme } from "@teispace/next-themes";
import { useLocale } from "@/lib/i18n/use-locale";
import { getMessages } from "@/lib/i18n/messages";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const labels = getMessages(locale).theme;

  const currentLabel = theme === "light" ? labels.light : theme === "dark" ? labels.dark : labels.system;

  return (
    <details className="relative">
      <summary
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-transparent text-[var(--muted)] outline-none transition-[border-color,background-color,color] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        aria-label={labels.choose + ": " + currentLabel}
        title={labels.title + ": " + currentLabel}
      >
<MaterialIcon name={theme === "dark" ? "dark_mode" : theme === "light" ? "light_mode" : "devices"} size={20} />
        <span className="sr-only">{currentLabel}</span>
      </summary>

      <div className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-md)]">
        {[
          { value: "system", label: labels.system },
          { value: "light", label: labels.light },
          { value: "dark", label: labels.dark },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
              setTheme(option.value);
            }}
            className={"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm " + (theme === option.value
              ? "bg-[var(--accent-soft)] text-[var(--on-primary-container)]"
              : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]")}
            aria-pressed={theme === option.value}
          >
<MaterialIcon name={option.value === "system" ? "devices" : option.value === "dark" ? "dark_mode" : "light_mode"} size={16} />
            <span className="flex-1">{option.label}</span>
            {theme === option.value && <MaterialIcon name="check" size={16} />}
          </button>
        ))}
      </div>
    </details>
  );
}
