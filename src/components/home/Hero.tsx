import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolById } from "@/lib/tools/catalog";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import ToolSearch from "@/components/tools/ToolSearch";
import { getToolPath } from "@/lib/tools/routes";

export default function Hero({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]" aria-labelledby="home-title">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[var(--accent-soft)] opacity-80 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[var(--info-soft)] opacity-60 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-[var(--content-wide)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(30rem,1.18fr)] lg:gap-16">
          <div className="max-w-xl motion-reveal">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />{t.home.badge}
            </p>
            <h1 id="home-title" className="mt-5 text-balance text-4xl font-black tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl lg:text-7xl">{t.home.title}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--muted)] sm:text-lg">{t.home.description}</p>
          </div>
          <div className="motion-reveal motion-reveal-delay">
            <div className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)]">
              <div className="rounded-[calc(var(--radius-2xl)-0.25rem)] border border-[var(--border)] bg-[var(--background)] p-3 sm:p-4">
                <ToolSearch locale={locale} instanceId="home-tool-search" />
              </div>
            </div>
            <div className="mt-5" aria-label={t.home.quickLinksLabel}>
              <div className="flex flex-wrap gap-2">
                {t.home.quickLinks.map((link) => {
                  const tool = getToolById(link.toolId);
                  if (!tool) return null;
                  return <a key={link.toolId} href={getToolPath(locale, getPrimaryToolCategory(tool), tool.id)} className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium shadow-[var(--shadow-sm)] transition-[transform,border-color,background-color,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
                    {link.label}<span className="text-[var(--muted)] transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </a>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
