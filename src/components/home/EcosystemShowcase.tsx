import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getCategoryPath } from "@/lib/tools/routes";

function Radial({ locale, counts }: { locale: Locale; counts: { id: string; count: number }[] }) {
  const t = getMessages(locale);
  const total = counts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="mt-7 grid items-center gap-6 rounded-[1.25rem] bg-[var(--background)] p-4 sm:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] sm:gap-8 sm:p-6 lg:gap-10">
      <svg
        viewBox="0 0 260 260"
        className="mx-auto block w-full max-w-[15rem] sm:max-w-[17rem]"
        role="img"
        aria-label={t.home.ecosystemVariants.radial}
      >
        <circle cx="130" cy="130" r="91" fill="none" stroke="var(--surface-soft)" strokeWidth="24" />
        {counts.map((item, index) => {
          const angle = (item.count / total) * 360;
          const start = -90 + counts.slice(0, index).reduce((sum, segment) => sum + (segment.count / total) * 360, 0);
          const large = angle > 180 ? 1 : 0;
          const startRad = (start * Math.PI) / 180;
          const endRad = ((start + angle - 1) * Math.PI) / 180;
          const x1 = 130 + 91 * Math.cos(startRad);
          const y1 = 130 + 91 * Math.sin(startRad);
          const x2 = 130 + 91 * Math.cos(endRad);
          const y2 = 130 + 91 * Math.sin(endRad);

          return (
            <Link key={item.id} href={getCategoryPath(locale, item.id)} className="loculary-radial-segment">
              <path
                d={"M " + x1 + " " + y1 + " A 91 91 0 " + large + " 1 " + x2 + " " + y2}
                fill="none"
                stroke={getCategoryColor(item.id)}
                strokeWidth="24"
                strokeLinecap="round"
              />
              <title>{getCategoryName(locale, item.id)} — {item.count}</title>
            </Link>
          );
        })}
        <text x="130" y="126" textAnchor="middle" className="fill-[var(--foreground)] text-[28px] font-black">{total}</text>
        <text x="130" y="147" textAnchor="middle" className="fill-[var(--muted)] text-[9px] font-bold uppercase tracking-[0.18em]">{t.home.ecosystemToolsLabel}</text>
      </svg>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1 sm:gap-0.5">
        {counts.map((item) => (
          <Link
            key={item.id}
            href={getCategoryPath(locale, item.id)}
            className="group flex min-h-10 items-center gap-2 rounded-lg px-2.5 py-2 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: getCategoryColor(item.id) }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold sm:text-sm">{getCategoryName(locale, item.id)}</span>
            <span className="text-xs tabular-nums text-[var(--muted)] group-hover:text-[var(--foreground)]">{item.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const categoryColors: Record<string, string> = {
  calculations: "var(--category-calculations)",
  dates: "var(--category-dates)",
  computing: "var(--category-computing)",
  images: "var(--category-images)",
  files: "var(--category-files)",
  video: "var(--category-video)",
  development: "var(--category-development)",
};

function getCategoryColor(categoryId: string): string {
  return categoryColors[categoryId] ?? "var(--accent)";
}

export default function EcosystemShowcase({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const counts = categories
    .map((category) => ({ id: category.id, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);
  const total = getPublishedTools().length;

  return (
    <section className="border-t border-[var(--border)] px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-10" aria-labelledby="ecosystem-title">
      <div className="mx-auto max-w-[var(--content-wide)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--accent)] sm:text-xs">{t.home.ecosystemEyebrow}</p>
            <h2 id="ecosystem-title" className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">{t.home.ecosystemTitle}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">{t.home.ecosystemDescription}</p>
          </div>
          <p className="shrink-0 text-xs font-semibold text-[var(--muted)] sm:text-sm">
            <span className="mr-1 text-xl font-black text-[var(--foreground)]">{total}</span>
            {t.home.ecosystemToolsLabel}
          </p>
        </div>

        <Radial locale={locale} counts={counts} />
      </div>
    </section>
  );
}
