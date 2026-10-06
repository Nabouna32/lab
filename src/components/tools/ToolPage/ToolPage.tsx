import type { ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getToolContent, isToolContentFallback, type Tool } from "@/lib/tools/types";
import { getMessages } from "@/lib/i18n/messages";
import { getCategoryName } from "@/lib/tools/categories";
import { getCategoryPath, getToolsPath } from "@/lib/tools/routes";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolPageHeader from "./ToolPageHeader";
import ToolProcessingStatus from "./ToolProcessingStatus";
import { ToolRuntimeProvider } from "./ToolRuntimeProvider";

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
    <main className="mx-auto max-w-[var(--content-default)] px-4 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-7">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: t.nav.tools, href: getToolsPath(locale) },
          {
            label: getCategoryName(locale, getPrimaryToolCategory(tool)),
            href: getCategoryPath(locale, getPrimaryToolCategory(tool)),
          },
          { label: localizedContent.name },
        ]}
      />

      <ToolPageHeader
        icon={tool.icon}
        title={localizedContent.name}
        description={localizedContent.description}
        contentFallback={isContentFallback}
        locale={locale}
      />

      <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
        <div data-tool-surface className="mt-5 sm:mt-7">
          <ToolProcessingStatus processing={tool.processing} locale={locale} />
          {children && (
            <section aria-label={t.nav.tools} className="mt-5 sm:mt-7 motion-reveal">
              {children}
            </section>
          )}
        </div>

        {content && (
          <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
            {content}
          </div>
        )}
      </ToolRuntimeProvider>
    </main>
  );
}
