import type { ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getToolContent, isToolContentFallback, type Tool } from "@/lib/tools/types";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";
import ToolProcessingStatus from "./ToolProcessingStatus";
import { ToolRuntimeProvider } from "./ToolRuntimeProvider";
import RecentToolTracker from "./RecentToolTracker";
import NextActions from "@/components/tools/RelatedTools";
import ShareToolButton from "./ShareToolButton";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { Column } from "@/components/layout/compose/Column";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { MaterialIcon, type MaterialIconName } from "@/components/ui/MaterialIcon";

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
        <div className="space-y-6">
          {/* Header compact avec identité, actions et statut */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--shape-corner-large)] bg-[var(--primary-container)] text-[var(--on-primary-container)] sm:h-12 sm:w-12"
                  aria-hidden="true"
                >
                  <MaterialIcon name={tool.icon} size={24} />
                </div>
                <div className="min-w-0">
                  <h1 id="tool-page-title" className="m3-type-headline-medium mt-0.5">
                    {localizedContent.name}
                  </h1>
                  <p className="m3-type-body-medium mt-1.5 max-w-3xl text-[var(--muted)]">
                    {localizedContent.description}
                  </p>
                  {isContentFallback && (
                    <p className="m3-type-body-small mt-2 text-[var(--muted)]" role="status">
                      {t.processing.fallbackNotice}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex w-full shrink-0 items-center justify-end gap-2 pt-0.5 sm:w-auto">
                <ShareToolButton title={localizedContent.name} description={localizedContent.description} locale={locale} />
                <FavoriteButton toolId={tool.id} locale={locale} compact />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <ToolProcessingStatus processing={tool.processing} locale={locale} />
            </div>
          </header>

          {/* Runtime - sans Card englobante générique */}
          <ToolRuntimeProvider access={tool.access} capabilities={tool.capabilities}>
            <section aria-labelledby="tool-page-title" className="motion-reveal">
              {runtime}
            </section>
          </ToolRuntimeProvider>

          {/* Prochaines actions - séparées sémantiquement */}
          <NextActions toolId={tool.id} locale={locale} />

          {/* Contenu éditorial - séparé sémantiquement */}
          {content && (
            <section aria-label={t.nav.tools} className="mt-6">
              <Column className="tool-page-editorial-stack" verticalArrangement={Arrangement.spacedBy("var(--tool-page-content-gap)")} style={{ width: "100%", alignItems: "stretch" }}>{content}</Column>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
