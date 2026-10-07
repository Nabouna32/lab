import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import EcosystemShowcase from "@/components/home/EcosystemShowcase";
import ToolSearch from "@/components/tools/ToolSearch";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getToolsPath } from "@/lib/tools/routes";

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
    <div className="flex flex-wrap justify-center gap-2" aria-label={t.home.quickLinksLabel}>
      {t.home.quickLinks.map((link) => (
        <a
          key={link.toolId}
          href="#home-search"
          className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3.5 py-2 text-xs font-bold text-[var(--muted)] shadow-[var(--shadow-sm)] outline-none transition-[transform,border-color,background-color,color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] opacity-60 transition-transform duration-[var(--motion-fast)] group-hover:scale-125" aria-hidden="true" />
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <main className="min-h-full">
      <section className="px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 lg:pb-14 lg:pt-10" aria-labelledby="home-title">
        <div className="mx-auto max-w-[62rem]">
          <div className="loculary-command-surface relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-8 shadow-[var(--shadow-lg)] sm:rounded-[1.75rem] sm:px-9 sm:py-12 lg:px-12 lg:py-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-[var(--info-soft)] blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
              <div className="motion-reveal flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--accent)] sm:text-xs">
                <span className="inline-flex h-2 w-2 rounded-full bg-current shadow-[0_0_0_5px_var(--accent-soft)]" aria-hidden="true" />
                {t.home.badge}
              </div>

              <h1 id="home-title" className="motion-reveal mt-4 max-w-3xl text-[clamp(2.35rem,8vw,5.4rem)] font-black leading-[.92] tracking-[-0.065em] text-[var(--foreground)]">
                {t.home.title}
              </h1>

              <p className="motion-reveal motion-reveal-delay mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                {t.home.description}
              </p>

              <div id="home-search" className="motion-reveal motion-reveal-delay mt-7 w-full scroll-mt-28 sm:mt-9">
                <ToolSearch locale={locale} instanceId="home-tool-search-v3" />
              </div>

              <div className="motion-reveal motion-reveal-delay-2 mt-4 w-full">
                <IntentShortcuts locale={locale} />
              </div>

              <Link
                href={getToolsPath(locale)}
                transitionTypes={["home-explorer"]}
                className="motion-reveal motion-reveal-delay-2 mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-black text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none transition-[transform,border-color,background-color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {t.home.explore}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EcosystemShowcase locale={locale} />
    </main>
  );
}
