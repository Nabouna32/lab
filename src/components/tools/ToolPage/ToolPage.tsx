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
    <main className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
      <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: getToolsPath(locale) }, { label: getCategoryName(locale, getPrimaryToolCategory(tool)), href: getCategoryPath(locale, getPrimaryToolCategory(tool)) }, { label: localizedContent.name }]} />
      <ToolPageHeader
        icon={tool.icon}
        title={localizedContent.name}
        description={localizedContent.description}
        contentFallback={isContentFallback}
        locale={locale}
      />
      <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
        <div data-tool-surface className="mt-3 sm:mt-4">
          <ToolProcessingStatus processing={tool.processing} locale={locale} />
          {children && <div className="mt-2 sm:mt-3">{children}</div>}
        </div>
        {content && <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">{content}</div>}
      </ToolRuntimeProvider>
    </main>
  );
}
