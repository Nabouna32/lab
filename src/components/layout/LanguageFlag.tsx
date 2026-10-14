import type { LanguageDefinition } from "@/lib/i18n/config";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
<MaterialIcon name="language" size={16} className="h-4 w-5 text-[var(--accent)]" />
      ) : (
        <span className="block h-4 w-6" />
      )}
    </span>
  );
}
