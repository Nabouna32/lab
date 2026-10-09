import type { Locale } from "@/lib/i18n/config";
import { getCategoryPath } from "@/lib/tools/routes";
import { getCategoryColor, getCategoryContainerColor, type ToolCategory } from "@/lib/tools/categories";

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
      className="group flex min-h-24 items-center gap-4 rounded-[var(--radius-lg)] border-t border-[var(--border)] py-5 outline-none transition-[background-color,padding] duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:px-3"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] text-2xl transition-transform duration-[var(--motion-standard)] group-hover:scale-105" style={{ color: getCategoryColor(category.id), backgroundColor: getCategoryContainerColor(category.id) }} aria-hidden="true">
        {category.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold tracking-[-0.015em] text-[var(--foreground)]">{name}</span>
        <span className="mt-1 block text-sm text-[var(--muted)]">{toolCount} {toolLabel}</span>
      </span>
      <span className="text-[var(--muted)] transition-[transform,color] duration-[var(--motion-standard)] group-hover:translate-x-1" style={{ color: getCategoryColor(category.id) }} aria-hidden="true">→</span>
    </a>
  );
}
