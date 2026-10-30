import type { ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getToolContent, isToolContentFallback, type Tool } from "@/lib/tools/types";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolPageHeader from "./ToolPageHeader";
import ToolProcessingStatus from "./ToolProcessingStatus";
import { ToolRuntimeProvider } from "./ToolRuntimeProvider";
import RecentToolTracker from "./RecentToolTracker";
import { PageContainer } from "@/components/layout/PageLayout";
import { Column } from "@/components/layout/compose/Column";
import { Arrangement } from "@/components/layout/compose/Arrangement";

export default function ToolPage({
  tool,
  locale = defaultLocale,
  children,
  content,
}: {
  tool: Tool;
  locale?: Locale;
  children?: ReactNode;
  content?: ReactNode;
}) {
  const localizedContent = getToolContent(tool, locale);
  const isContentFallback = isToolContentFallback(tool, locale);
  const t = getMessages(locale);

  return (
    <main className="min-h-full">
      <PageContainer width="default" spacing="none" className="py-[var(--space-5)] sm:py-[var(--space-7)] lg:py-[var(--space-9)]">
      <RecentToolTracker toolId={tool.id} />
      <header className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-lg)] sm:px-8 sm:py-8 lg:px-10">
        <div className="mb-5 px-1">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: t.nav.tools, href: getToolsPath(locale) },
              { label: localizedContent.name },
            ]}
          />
        </div>

        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
        <div className="relative">
          <ToolPageHeader
            icon={tool.icon}
            title={localizedContent.name}
            description={localizedContent.description}
            contentFallback={isContentFallback}
            locale={locale}
            toolId={tool.id}
          />
        </div>
      </header>

      <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
        <div data-tool-surface className="mt-4 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
          <div className="p-5 sm:p-8 lg:p-10">
            <ToolProcessingStatus processing={tool.processing} locale={locale} />
            {children && (
              <section aria-label={t.nav.tools} className="mt-5 sm:mt-7 motion-reveal">
                {children}
              </section>
            )}
          </div>

          {content && (
            <div className="border-t border-[var(--border)] bg-[var(--surface-soft)]/35 p-5 sm:p-8 lg:p-10">
              <Column className="tool-page-editorial-stack" verticalArrangement={Arrangement.spacedBy("var(--tool-page-content-gap)")}>{content}</Column>
            </div>
          )}
        </div>
      </ToolRuntimeProvider>
      </PageContainer>
    </main>
  );
}
