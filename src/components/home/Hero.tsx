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
      <div className="mx-auto max-w-[var(--content-wide)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] lg:gap-16">
          <div className="max-w-xl motion-reveal">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />{t.home.badge}</p>
            <h1 id="home-title" className="mt-5 text-balance text-4xl font-black tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {t.home.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--muted)] sm:text-lg">
              {t.home.description}
            </p>
          </div>

          <div>
            <ToolSearch locale={locale} instanceId="home-tool-search" /></div></div>
            <div className="mt-4" aria-label={t.home.quickLinksLabel}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {t.home.quickLinksLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.home.quickLinks.map((link) => {
                  const tool = getToolById(link.toolId);
                  if (!tool) return null;
                  return (
                    <a
                      key={link.toolId}
                      href={getToolPath(locale, getPrimaryToolCategory(tool), tool.id)}
                      className="inline-flex min-h-9 items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-[border-color,background-color] duration-[var(--motion-standard)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
