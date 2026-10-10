import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import HomeDiscovery from "@/components/home/HomeDiscovery";
import ToolSearch from "@/components/tools/ToolSearch";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getToolPath, getToolsPath } from "@/lib/tools/routes";
import { getRainbowFrameStyle } from "@/lib/design-system/rainbow-tones";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return getPublicPageMetadata({
    title: t.home.metaTitle,
    description: t.home.description,
    path: `/${locale}`,
  }, locale);
}

function TaskShortcuts({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label={t.home.quickLinksLabel}>
      {t.home.quickLinks.map((link) => (
        <Link
          key={link.toolId}
          href={getToolPath(locale, link.toolId)}
          className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] outline-none transition-[transform,border-color,background-color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <main className="min-h-full">
      <section className="px-4 pb-5 pt-5 sm:px-6 sm:pb-8 sm:pt-8 lg:px-10 lg:pt-10" aria-labelledby="home-title">
        <div className="mx-auto w-full max-w-[var(--content-wide)]">
          <div className="home-rainbow-frame rounded-[calc(var(--radius-xl)+1px)] p-[2px]" style={getRainbowFrameStyle()}>
            <div className="home-command-surface relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-5 py-8 shadow-[var(--shadow-md)] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <div className="pointer-events-none absolute -right-16 -top-20 z-0 h-64 w-64 rounded-full bg-[var(--primary-container)] opacity-65 blur-3xl sm:h-80 sm:w-80" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-28 left-[35%] z-0 h-64 w-64 rounded-full bg-[var(--tertiary-container)] opacity-45 blur-3xl" aria-hidden="true" />

              <div className="relative z-10 max-w-4xl">
                <p className="motion-reveal inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--accent)]">
                  <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                  {t.home.badge}
                </p>

                <h1 id="home-title" className="motion-reveal mt-5 max-w-3xl text-[clamp(2.6rem,6.5vw,5.4rem)] font-black leading-[.96] tracking-[-0.065em] text-[var(--foreground)]">
                  {t.home.title}
                </h1>

                <p className="motion-reveal motion-reveal-delay mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                  {t.home.description}
                </p>

                <div id="home-search" className="motion-reveal motion-reveal-delay mt-7 max-w-3xl scroll-mt-28 sm:mt-9">
                  <ToolSearch locale={locale} instanceId="home-tool-search-v4" />
                </div>

                <div className="motion-reveal motion-reveal-delay-2 mt-5">
                  <p className="mb-2.5 text-xs font-semibold text-[var(--muted)]">{t.home.quickLinksLabel}</p>
                  <TaskShortcuts locale={locale} />
                </div>

                <Link
                  href={getToolsPath(locale)}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[var(--accent)] outline-none transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {t.home.explore}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeDiscovery locale={locale} />
    </main>
  );
}
