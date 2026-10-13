import type { Locale } from "@/lib/i18n/config";
import { Card } from "@/components/ui/Card";
import { getCategoryPath } from "@/lib/tools/routes";
import { getCategoryColor, getCategoryContainerColor, getCategoryOnContainerColor, type ToolCategory } from "@/lib/tools/categories";

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
      className="group grid min-h-20 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 outline-none transition-[background-color,box-shadow,transform] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:min-h-44 sm:grid-cols-2 sm:grid-rows-[auto_1fr] sm:items-start sm:gap-0 sm:p-5"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] text-2xl transition-[transform,background-color,color] duration-[var(--motion-standard)] group-hover:scale-105 sm:h-12 sm:w-12" style={{ backgroundColor: getCategoryContainerColor(category.id), color: getCategoryOnContainerColor(category.id) }} aria-hidden="true">
        {category.icon}
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[var(--surface-elevated)]" style={{ backgroundColor: getCategoryColor(category.id) }} />
      </span>

      <span className="min-w-0 sm:col-span-2 sm:row-start-2 sm:mt-5">
        <span className="block font-semibold tracking-[-0.015em] text-[var(--foreground)] text-pretty">{name}</span>
        <span className="mt-1 block text-sm text-[var(--muted)]">{toolCount} {toolLabel}</span>
      </span>

      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)] transition-[transform,color] duration-[var(--motion-standard)] group-hover:translate-x-0.5 group-hover:text-[var(--primary)] sm:col-start-2 sm:row-start-1 sm:justify-self-end" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Card>
  );
}
