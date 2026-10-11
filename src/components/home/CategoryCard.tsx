import type { Locale } from "@/lib/i18n/config";
import { Card } from "@/components/ui/Card";
import { getCategoryPath } from "@/lib/tools/routes";
import { getCategoryColor, type ToolCategory } from "@/lib/tools/categories";

type CategoryCardProps = {
  category: ToolCategory;
  name: string;
  toolLabel: string;
  toolCount: number;
  locale: Locale;
};

export default function CategoryCard({ category, name, toolLabel, toolCount, locale }: CategoryCardProps) {
  return (
    <Card
      href={getCategoryPath(locale, category.id)}
      variant="elevated"
      className="group flex min-h-20 min-w-0 items-center gap-3 p-3 outline-none transition-[background-color,box-shadow,transform] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:min-h-44 sm:flex-col sm:items-stretch sm:gap-0 sm:p-5"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-soft)] text-2xl transition-transform duration-[var(--motion-standard)] group-hover:scale-105 sm:h-12 sm:w-12" aria-hidden="true">
        {category.icon}
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[var(--surface-elevated)]" style={{ backgroundColor: getCategoryColor(category.id) }} />
      </span>

      <span className="min-w-0 flex-1 sm:mt-5 sm:flex-none">
        <span className="block truncate font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:whitespace-normal">{name}</span>
        <span className="mt-1 block text-sm text-[var(--muted)]">{toolCount} {toolLabel}</span>
      </span>

      <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-auto h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-[var(--motion-standard)] group-hover:translate-x-0.5 group-hover:text-[var(--foreground)] sm:ml-auto sm:mt-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Card>
  );
}
