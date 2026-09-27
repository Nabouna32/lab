import type { LanguageDefinition } from "@/lib/i18n/config";

type LanguageFlagProps = {
  code: LanguageDefinition["flagCode"];
};

export default function LanguageFlag({ code }: LanguageFlagProps) {
  return (
    <span
      className="language-flag flex h-4 w-6 shrink-0 items-center justify-center rounded-[3px] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)] transition-transform duration-150"
      data-flag-code={code}
      aria-hidden="true"
    >
      {code === "world" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.4 2.5 3.7 5.5 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-6.5-3.7-9S9.6 5.5 12 3Z" />
        </svg>
      ) : (
        <span className="block h-4 w-6" />
      )}
    </span>
  );
}
