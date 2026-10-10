import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import HomeDiscovery from "@/components/home/HomeDiscovery";
import ToolSearch from "@/components/tools/ToolSearch";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getToolsPath } from "@/lib/tools/routes";
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <main className="min-h-full">
      <section className="px-4 pb-5 pt-5 sm:px-6 sm:pb-8 sm:pt-8 lg:px-10 lg:pt-10" aria-labelledby="home-title">
        <div className="mx-auto w-full max-w-[var(--content-wide)]">
          <div className="home-rainbow-frame rounded-[2rem] p-px sm:rounded-[2.5rem]" style={getRainbowFrameStyle()}>
            <div className="home-command-surface relative isolate overflow-hidden rounded-[calc(2rem-1px)] bg-[var(--surface)] px-5 py-8 sm:rounded-[calc(2.5rem-1px)] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/35 to-transparent" aria-hidden="true" />

              <div className="relative z-10 max-w-4xl">
                <p className="motion-reveal inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-bold tracking-wide text-[var(--accent)]">
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

                <Link
                  href={getToolsPath(locale)}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--accent)] outline-none transition-[background-color,transform] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {t.home.explore}
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
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
