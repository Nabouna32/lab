import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import HomeGuidedWorkflows from "@/components/home/HomeGuidedWorkflows";
import RecentTools from "@/components/home/RecentTools";
import ToolSearch from "@/components/tools/ToolSearch";
import { PageContainer } from "@/components/layout/PageLayout";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getToolsPath } from "@/lib/tools/routes";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getToolContent } from "@/lib/tools/types";
import { getRainbowFrameStyle } from "@/lib/design-system/rainbow-tones";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
  const recentTools = getPublishedTools().map((tool) => ({ id: tool.id, name: getToolContent(tool, locale).name }));

  return (
    <main className="min-h-full">
      <section aria-labelledby="home-title">
        <PageContainer
          width="wide"
          spacing="none"
          className="pb-[var(--space-5)] pt-[var(--space-5)] sm:pb-[var(--space-8)] sm:pt-[var(--space-8)] lg:pt-[var(--space-10)]"
        >
          <div className="home-rainbow-frame rounded-[2rem] p-px sm:rounded-[2.5rem]" style={getRainbowFrameStyle()}>
            <div className="home-command-surface relative isolate overflow-hidden rounded-[calc(2rem-1px)] bg-[var(--surface)] px-5 py-7 sm:rounded-[calc(2.5rem-1px)] sm:px-8 sm:py-8 lg:px-12 lg:py-10">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/35 to-transparent" aria-hidden="true" />

              <div className="relative z-10 max-w-4xl">
                <p className="motion-reveal inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-bold tracking-wide text-[var(--accent)]">
                  <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                  {t.home.badge}
                </p>

                <h1 id="home-title" className="motion-reveal mt-5 max-w-4xl text-balance text-[clamp(2.3rem,5.4vw,4.6rem)] font-black leading-[1] tracking-[-0.055em] text-[var(--foreground)]">
                  {t.home.title}
                </h1>

                <p className="motion-reveal motion-reveal-delay mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                  {t.home.description}
                </p>

                <div id="home-search" className="motion-reveal motion-reveal-delay mx-auto mt-6 max-w-3xl scroll-mt-28 sm:mt-7">
                  <ToolSearch locale={locale} instanceId="home-tool-search-v4" placeholder={t.home.searchPlaceholder} />
                </div>

                <Link
                  href={getToolsPath(locale)}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--accent)] outline-none transition-[background-color,transform] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] hover:text-[var(--on-primary-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <MaterialIcon name="arrow_forward" size={16} />
                  {t.home.explore}
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <RecentTools locale={locale} tools={recentTools} />
      <HomeGuidedWorkflows locale={locale} />
    </main>
  );
}
