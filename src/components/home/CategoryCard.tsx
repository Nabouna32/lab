import type { Locale } from "@/lib/i18n/config";
import type { ToolCategory } from "@/lib/tools/categories";
import { Card } from "@/components/ui/Card";

type CategoryCardProps = { category: ToolCategory; name: string; toolLabel: string; toolCount: number; locale: Locale; index?: number };

export default function CategoryCard({ category, name, toolLabel, toolCount, locale }: CategoryCardProps) {
  return (
    <Card href={"/" + locale + "/outils/" + category.id} className="group relative overflow-hidden p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)] transition-transform duration-500 group-hover:scale-150" />
      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[var(--accent-soft)] text-3xl shadow-sm transition-transform duration-300 group-hover:scale-105">{category.icon}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]" aria-hidden="true">↗</span>
      </div>
      <div className="relative mt-7">
        <h3 className="text-lg font-bold tracking-[-0.02em]">{name}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{toolCount} {toolLabel}</p>
      </div>
    </Card>
  );
}
