import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getCategoryPath } from "@/lib/tools/routes";

type VariantName = "constellation" | "radial" | "network" | "surfaces";

function getTone(count: number, max: number): string {
  if (max === 0) return "var(--muted)";
  const ratio = count / max;
  if (ratio >= 0.66) return "var(--accent)";
  if (ratio >= 0.33) return "var(--info)";
  return "var(--success)";
}

function VariantHeading({ locale, variant }: { locale: Locale; variant: VariantName }) {
  const t = getMessages(locale);
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] pb-4">
      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t.home.ecosystemVariantLabel}</p>
        <h3 className="mt-1 text-lg font-bold tracking-[-0.025em] sm:text-xl">{t.home.ecosystemVariants[variant]}</h3>
      </div>
      <p className="text-xs text-[var(--muted)]">{t.home.ecosystemVariantHint}</p>
    </div>
  );
}

function CategoryLinks({ locale, counts }: { locale: Locale; counts: { id: string; count: number }[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--border)] pt-4">
      {counts.map(({ id, count }) => (
        <Link
          key={id}
          href={getCategoryPath(locale, id)}
          className="group inline-flex min-h-9 items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--muted)] outline-none transition-[background-color,color] duration-[var(--motion-fast)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getTone(count, Math.max(...counts.map((item) => item.count))) }} aria-hidden="true" />
          {getCategoryName(locale, id)}
          <span className="text-[var(--foreground)]">{count}</span>
        </Link>
      ))}
    </div>
  );
}

function Constellation({ locale, counts }: { locale: Locale; counts: { id: string; count: number }[] }) {
  const max = Math.max(...counts.map((item) => item.count), 1);
  const center = 210;
  const radius = 142;
  return (
    <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--background)] px-2 py-5 sm:px-6 sm:py-7">
      <svg viewBox="0 0 420 330" className="mx-auto block h-auto w-full max-w-2xl" role="img" aria-label={getMessages(locale).home.ecosystemVariants.constellation}>
        <circle cx={center} cy="145" r="48" fill="var(--surface)" stroke="var(--border-strong)" />
        <text x={center} y="140" textAnchor="middle" className="fill-[var(--foreground)] text-[17px] font-bold">{getPublishedTools().length}</text>
        <text x={center} y="159" textAnchor="middle" className="fill-[var(--muted)] text-[9px] uppercase tracking-[0.18em]">Loculary</text>
        {counts.map((item, index) => {
          const angle = (index / counts.length) * Math.PI * 2 - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = 145 + Math.sin(angle) * radius * 0.86;
          const size = 9 + (item.count / max) * 15;
          return (
            <g key={item.id}>
              <line x1={center} y1="145" x2={x} y2={y} stroke="var(--border)" strokeDasharray="3 7" />
              <Link href={getCategoryPath(locale, item.id)}>
                <circle cx={x} cy={y} r={size} fill={getTone(item.count, max)} fillOpacity="0.18" stroke={getTone(item.count, max)} strokeWidth="2" />
                <text x={x} y={y + 3} textAnchor="middle" className="pointer-events-none fill-[var(--foreground)] text-[9px] font-bold">{item.count}</text>
                <title>{getCategoryName(locale, item.id)} — {item.count}</title>
              </Link>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Radial({ locale, counts }: { locale: Locale; counts: { id: string; count: number }[] }) {
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(...counts.map((item) => item.count), 1);
  return (
    <div className="mt-6 grid items-center gap-7 rounded-[var(--radius-xl)] bg-[var(--background)] p-5 sm:grid-cols-[minmax(16rem,0.9fr)_1.1fr] sm:p-7">
      <svg viewBox="0 0 260 260" className="mx-auto w-full max-w-[18rem]" role="img" aria-label={getMessages(locale).home.ecosystemVariants.radial}>
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
          return <path key={item.id} d={"M " + x1 + " " + y1 + " A 91 91 0 " + large + " 1 " + x2 + " " + y2} fill="none" stroke={getTone(item.count, max)} strokeWidth="24" strokeLinecap="round" />;
        })}
        <text x="130" y="126" textAnchor="middle" className="fill-[var(--foreground)] text-[28px] font-black">{total}</text>
        <text x="130" y="147" textAnchor="middle" className="fill-[var(--muted)] text-[9px] font-bold uppercase tracking-[0.18em]">outils</text>
      </svg>
      <div className="space-y-2">
        {counts.map((item) => (
          <Link key={item.id} href={getCategoryPath(locale, item.id)} className="group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: getTone(item.count, max) }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{getCategoryName(locale, item.id)}</span>
            <span className="text-sm tabular-nums text-[var(--muted)] group-hover:text-[var(--foreground)]">{item.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Network({ locale, counts }: { locale: Locale; counts: { id: string; count: number }[] }) {
  const max = Math.max(...counts.map((item) => item.count), 1);
  return (
    <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--background)] p-4 sm:p-7">
      <svg viewBox="0 0 760 330" className="mx-auto block h-auto w-full" role="img" aria-label={getMessages(locale).home.ecosystemVariants.network}>
        <circle cx="380" cy="165" r="58" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
        <text x="380" y="160" textAnchor="middle" className="fill-[var(--foreground)] text-[20px] font-black">{getPublishedTools().length}</text>
        <text x="380" y="179" textAnchor="middle" className="fill-[var(--muted)] text-[9px] font-bold uppercase tracking-[0.18em]">outils</text>
        {counts.map((item, index) => {
          const angle = (index / counts.length) * Math.PI * 2 - Math.PI / 2;
          const x = 380 + Math.cos(angle) * 250;
          const y = 165 + Math.sin(angle) * 105;
          const size = 22 + (item.count / max) * 18;
          return (
            <g key={item.id}>
              <line x1="380" y1="165" x2={x} y2={y} stroke="var(--border)" strokeWidth="1.5" />
              <Link href={getCategoryPath(locale, item.id)}>
                <circle cx={x} cy={y} r={size} fill="var(--surface)" stroke={getTone(item.count, max)} strokeWidth="3" />
                <text x={x} y={y + 3} textAnchor="middle" className="pointer-events-none fill-[var(--foreground)] text-[9px] font-bold">{item.count}</text>
                <title>{getCategoryName(locale, item.id)} — {item.count}</title>
              </Link>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Surfaces({ locale, counts }: { locale: Locale; counts: { id: string; count: number }[] }) {
  const max = Math.max(...counts.map((item) => item.count), 1);
  return (
    <div className="mt-6 grid gap-3 rounded-[var(--radius-xl)] bg-[var(--background)] p-4 sm:grid-cols-6 sm:auto-rows-[5.25rem] sm:p-7">
      {counts.map((item, index) => {
        const wide = index === 0 || item.count === max;
        return (
          <Link key={item.id} href={getCategoryPath(locale, item.id)} className={(wide ? "sm:col-span-3 " : "sm:col-span-2 ") + "group relative flex min-h-24 flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] outline-none transition-[transform,border-color,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:min-h-0"}>
            <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: getTone(item.count, max) }} aria-hidden="true" />
            <span className="text-sm font-semibold">{getCategoryName(locale, item.id)}</span>
            <span className="flex items-end justify-between gap-3">
              <span className="text-3xl font-black tracking-[-0.05em] tabular-nums">{item.count}</span>
              <span className="text-xs text-[var(--muted)]">outils</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function EcosystemShowcase({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const counts = categories
    .map((category) => ({ id: category.id, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);
  const total = getPublishedTools().length;

  return (
    <section className="mx-auto max-w-[var(--content-wide)] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8" aria-labelledby="ecosystem-title">
      <div className="border-t border-[var(--border)] pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t.home.ecosystemEyebrow}</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="ecosystem-title" className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">{t.home.ecosystemTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.ecosystemDescription}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[var(--muted)]"><span className="text-2xl font-black text-[var(--foreground)]">{total}</span> {t.home.ecosystemToolsLabel}</p>
          </div>
        </div>

        <div className="mt-10 space-y-14 sm:mt-14 sm:space-y-20">
          <figure>
            <VariantHeading locale={locale} variant="constellation" />
            <Constellation locale={locale} counts={counts} />
            <CategoryLinks locale={locale} counts={counts} />
          </figure>
          <figure>
            <VariantHeading locale={locale} variant="radial" />
            <Radial locale={locale} counts={counts} />
            <CategoryLinks locale={locale} counts={counts} />
          </figure>
          <figure>
            <VariantHeading locale={locale} variant="network" />
            <Network locale={locale} counts={counts} />
            <CategoryLinks locale={locale} counts={counts} />
          </figure>
          <figure>
            <VariantHeading locale={locale} variant="surfaces" />
            <Surfaces locale={locale} counts={counts} />
            <CategoryLinks locale={locale} counts={counts} />
          </figure>
        </div>
      </div>
    </section>
  );
}
