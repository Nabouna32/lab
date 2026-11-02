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
import { Column } from "@/components/layout/compose/Column";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { ElevatedCard, OutlinedCard } from "@/components/ui/Card";

export default function ToolPage({
  tool,
  locale = defaultLocale,
  runtime,
  children,
  content,
}: {
  tool: Tool;
  locale?: Locale;
  runtime: ReactNode;
  children?: ReactNode;
  content?: ReactNode;
}) {
  const localizedContent = getToolContent(tool, locale);
  const isContentFallback = isToolContentFallback(tool, locale);
  const t = getMessages(locale);

  return (
    <main className="min-h-full">
      <div className="mx-auto w-full max-w-[var(--layout-content-default)] px-[var(--layout-page-gutter)] py-[var(--space-5)] sm:py-[var(--space-7)] lg:py-[var(--space-9)]">
        <RecentToolTracker toolId={tool.id} />
        <div className="mb-5 px-1">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: t.nav.tools, href: getToolsPath(locale) },
              { label: localizedContent.name },
            ]}
          />
        </div>

        <ElevatedCard className="bg-[radial-gradient(ellipse_at_88%_12%,var(--primary-container),var(--surface-container-low)_58%)] p-5 sm:p-7 lg:p-8">
          <ToolPageHeader
            icon={tool.icon}
            title={localizedContent.name}
            description={localizedContent.description}
            contentFallback={isContentFallback}
            locale={locale}
            toolId={tool.id}
          />
        </ElevatedCard>

        <div className="mt-4 mb-5">
          <ToolProcessingStatus processing={tool.processing} locale={locale} />
        </div>

        <section aria-labelledby="tool-page-title" className="mt-0 motion-reveal">
          <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
            {runtime}
          </ToolRuntimeProvider>
        </section>

        {children && <div className="mt-8">{children}</div>}

        {content && (
          <OutlinedCard className="mt-10 p-5 sm:mt-12 sm:p-7">
            <Column className="tool-page-editorial-stack" verticalArrangement={Arrangement.spacedBy("var(--tool-page-content-gap)")}>{content}</Column>
          </OutlinedCard>
        )}
      </div>
    </main>
  );
}
