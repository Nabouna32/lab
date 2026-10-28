import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import HomeGuidedWorkflows from "@/components/home/HomeGuidedWorkflows";
import RecentTools from "@/components/home/RecentTools";
import ToolSearch from "@/components/tools/ToolSearch";
import { PageContainer } from "@/components/layout/PageLayout";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getToolsPath } from "@/lib/tools/routes";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getToolContent } from "@/lib/tools/types";

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
          className="pb-[var(--space-8)] pt-[var(--space-8)] sm:pb-[var(--space-10)] sm:pt-[var(--space-10)]"
        >
          <div className="mx-auto max-w-4xl">
            <h1 id="home-title" className="m3-type-headline-large text-balance text-[var(--foreground)]">
              {t.home.title}
            </h1>

            <p className="m3-type-body-large mt-4 max-w-2xl text-[var(--muted)]">
              {t.home.description}
            </p>

            <div id="home-search" className="mt-6 max-w-3xl scroll-mt-28">
              <ToolSearch locale={locale} instanceId="home-tool-search-v4" placeholder={t.home.searchPlaceholder} />
            </div>

            <Link
              href={getToolsPath(locale)}
              className="m3-type-label-large mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-[var(--primary)] outline-none transition-colors duration-[var(--motion-standard)] hover:bg-[var(--surface-container-high)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {t.home.explore}
            </Link>
          </div>
        </PageContainer>
      </section>

      <Column verticalArrangement={Arrangement.spacedBy("var(--layout-page-section-gap)")}>
        <RecentTools locale={locale} tools={recentTools} />
        <HomeGuidedWorkflows locale={locale} />
      </Column>
    </main>
  );
}
