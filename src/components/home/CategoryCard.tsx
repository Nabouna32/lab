import type { Locale } from "@/lib/i18n/config";
import { getCategoryPath } from "@/lib/tools/routes";
import type { ToolCategory } from "@/lib/tools/categories";

type CategoryCardProps = {
  category: ToolCategory;
  name: string;
  toolLabel: string;
  toolCount: number;
  locale: Locale;
};

export default function CategoryCard({ category, name, toolLabel, toolCount, locale }: CategoryCardProps) {
  return (
    <a
      href={getCategoryPath(locale, category.id)}
      className="group flex min-h-24 items-center gap-4 border-t border-[var(--border)] py-5 transition-[background-color,padding] duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] sm:px-3"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-soft)] text-2xl" aria-hidden="true">
        {category.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold tracking-[-0.015em] text-[var(--foreground)]">{name}</span>
        <span className="mt-1 block text-sm text-[var(--muted)]">{toolCount} {toolLabel}</span>
      </span>
      <span className="text-[var(--muted)] transition-transform duration-[var(--motion-standard)] group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
    </a>
  );
}
