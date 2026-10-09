import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import EcosystemShowcase from "@/components/home/EcosystemShowcase";
import ToolSearch from "@/components/tools/ToolSearch";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getToolPath, getToolsPath } from "@/lib/tools/routes";

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

function IntentShortcuts({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label={t.home.quickLinksLabel}>
      {t.home.quickLinks.map((link) => (
        <Link
          key={link.toolId}
          href={getToolPath(locale, link.toolId)}
          className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/75 px-3.5 py-2 text-xs font-bold text-[var(--muted)] shadow-[var(--shadow-sm)] outline-none transition-[transform,border-color,background-color,color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] opacity-60 transition-transform duration-[var(--motion-fast)] group-hover:scale-125" aria-hidden="true" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const total = getPublishedTools().length;

  return (
    <main className="min-h-full">
      <section className="relative overflow-hidden px-4 pb-8 pt-7 sm:px-6 sm:pb-12 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-12" aria-labelledby="home-title">
        <div className="mx-auto grid w-full max-w-[var(--content-wide)] gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)] lg:gap-6">
          <div className="loculary-command-surface relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-5 py-7 shadow-[var(--shadow-lg)] sm:px-8 sm:py-10 lg:min-h-[31rem] lg:px-11 lg:py-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-[-7rem] left-[-5rem] h-56 w-56 rounded-full bg-[var(--info-soft)] blur-3xl" aria-hidden="true" />

            <div className="relative flex h-full flex-col justify-center">
              <div className="motion-reveal flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">
                <span className="inline-flex h-2 w-2 rounded-full bg-current shadow-[0_0_0_5px_var(--accent-soft)]" aria-hidden="true" />
                {t.home.badge}
              </div>

              <h1 id="home-title" className="motion-reveal mt-5 max-w-4xl text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[.9] tracking-[-0.07em] text-[var(--foreground)]">
                {t.home.title}
              </h1>

              <p className="motion-reveal motion-reveal-delay mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                {t.home.description}
              </p>

              <div id="home-search" className="motion-reveal motion-reveal-delay mt-8 scroll-mt-28 max-w-3xl sm:mt-10">
                <ToolSearch locale={locale} instanceId="home-tool-search-v3" />
              </div>

              <div className="motion-reveal motion-reveal-delay-2 mt-4">
                <IntentShortcuts locale={locale} />
              </div>
            </div>
          </div>

          <aside className="motion-reveal motion-reveal-delay-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-1" aria-label={t.home.quickLinksLabel}>
            <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--foreground)] p-6 text-[var(--surface)] shadow-[var(--shadow-lg)] dark:bg-[#171b21] sm:p-7 lg:min-h-[15rem]">
              <span className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent)]/30 blur-2xl" aria-hidden="true" />
              <p className="relative text-xs font-black uppercase tracking-[0.16em] opacity-55">{t.nav.explore}</p>
              <p className="relative mt-3 text-3xl font-black tracking-[-0.05em]">{total}</p>
              <p className="relative mt-1 text-sm leading-6 opacity-65">{t.home.ecosystemToolsLabel}</p>
              <Link
                href={getToolsPath(locale)}
                transitionTypes={["home-explorer"]}
                className="relative mt-7 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-[var(--accent-foreground)] shadow-[var(--shadow-accent)] outline-none transition-[transform,filter] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {t.home.explore}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-7 lg:min-h-[15rem]">
              <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]" aria-hidden="true">✦</div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">{t.home.badge}</p>
              <p className="mt-10 max-w-xs text-xl font-black tracking-[-0.04em]">{t.home.description}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]/48 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-[var(--content-wide)]">
          <EcosystemShowcase locale={locale} />
        </div>
      </section>
    </main>
  );
}
