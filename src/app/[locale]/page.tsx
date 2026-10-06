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
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label={t.home.quickLinksLabel}>
      {t.home.quickLinks.map((link) => (
        <a
          key={link.toolId}
          href="#home-search"
          className="inline-flex min-h-9 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--muted)] shadow-[var(--shadow-sm)] outline-none transition-[border-color,background-color,color,transform] duration-[var(--motion-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
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
  const total = getPublishedTools().length;

  return (
      <main className="min-h-[calc(100svh-4rem)] bg-[var(--background)]">
        <section className="relative flex min-h-[min(760px,calc(100svh-4rem))] items-center overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="home-title">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-soft)] opacity-60 blur-[110px]" />
            <div className="absolute right-[8%] top-[16%] h-40 w-40 rounded-full bg-[var(--info-soft)] opacity-70 blur-3xl" />
          </div>

          <div className="relative mx-auto flex w-full max-w-[var(--content-wide)] flex-col items-center text-center">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{t.home.badge}</p>
              <h1 id="home-title" className="mt-5 text-balance text-5xl font-black tracking-[-0.065em] text-[var(--foreground)] sm:text-6xl lg:text-8xl">{t.home.title}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t.home.description}</p>
            </div>

            <div id="home-search" className="mt-9 w-full max-w-4xl scroll-mt-24 sm:mt-12">
              <div className="relative rounded-[calc(var(--radius-2xl)+0.25rem)] border border-[var(--border-strong)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)] sm:p-3">
                <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background)] p-3 sm:p-5">
                  <ToolSearch locale={locale} instanceId="home-tool-search-v2" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center gap-4">
              <IntentShortcuts locale={locale} />
              <Link
                href={getToolsPath(locale)}
                transitionTypes={["home-explorer"]}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-bold text-[var(--background)] shadow-[var(--shadow-md)] outline-none transition-[transform,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {t.home.explore}
                <span className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[var(--muted)]">
              <span><strong className="text-[var(--foreground)]">{total}</strong> {t.home.ecosystemToolsLabel}</span>
              <span><strong className="text-[var(--foreground)]">4</strong> {t.home.ecosystemVariantsCountLabel}</span>
            </div>
          </div>
        </section>

        <EcosystemShowcase locale={locale} />
      </main>
  );
}
