import type { ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getToolContent, type Tool } from "@/lib/tools/types";
import { getMessages } from "@/lib/i18n/messages";
import { getCategoryName } from "@/lib/tools/categories";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolPageHeader from "./ToolPageHeader";
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
  const t = getMessages(locale);

  return (
    <main className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: `/${locale}/outils` }, { label: getCategoryName(locale, getPrimaryToolCategory(tool)), href: `/${locale}/outils/${getPrimaryToolCategory(tool)}` }, { label: localizedContent.name }]} />
      <ToolPageHeader
        icon={tool.icon}
        title={localizedContent.name}
        description={localizedContent.description}
        processing={tool.processing}
        locale={locale}
      />
      <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
        {children && <div className="mt-3 sm:mt-4">{children}</div>}
        {content && <div className="mt-8 space-y-10 sm:mt-12 sm:space-y-12">{content}</div>}
      </ToolRuntimeProvider>
    </main>
  );
}
