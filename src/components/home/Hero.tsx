import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolById } from "@/lib/tools/catalog";
import ToolSearch from "@/components/tools/ToolSearch";
import { getToolPath } from "@/lib/tools/routes";

export default function Hero({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <section className="border-b border-[var(--border)]" aria-labelledby="home-title">
      <div className="mx-auto max-w-[var(--content-wide)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-[var(--accent)]">{t.home.badge}</p>
            <h1 id="home-title" className="mt-3 text-balance text-4xl font-black tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {t.home.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--muted)] sm:text-lg">
              {t.home.description}
            </p>
          </div>

          <div>
            <ToolSearch locale={locale} instanceId="home-tool-search" />
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
                      href={getToolPath(locale, tool.id)}
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
