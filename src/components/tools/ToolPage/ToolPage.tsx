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
    <main className="min-h-full px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[var(--content-default)]">
          <header className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-lg)] sm:px-8 sm:py-8 lg:px-10">
          <div className="mb-5 px-1">
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
          </div>

          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative">
            <ToolPageHeader
              icon={tool.icon}
              title={localizedContent.name}
              description={localizedContent.description}
              contentFallback={isContentFallback}
              locale={locale}
            />
          </div>
        </header>

        <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
          <div data-tool-surface className="mt-4 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
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
                <div className="space-y-8 sm:space-y-10">{content}</div>
              </div>
            )}
          </div>
        </ToolRuntimeProvider>
      </div>
    </main>
  );
}
