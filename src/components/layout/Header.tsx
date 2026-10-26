import Link from "next/link";
import AppLink from "@/components/ui/AppLink";
import HeaderSearch from "@/components/layout/HeaderSearch";
import { PageContainer } from "@/components/layout/PageLayout";
import DesktopHeaderMenu from "@/components/layout/DesktopHeaderMenu";
import LocularyLogo from "@/components/brand/LocularyLogo";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]">
      <PageContainer width="wide" spacing="none">
        <div className="grid h-14 grid-cols-[1fr_auto] items-center gap-2 sm:h-16 sm:gap-3">
          <Link
            href={"/" + locale}
            className="group flex shrink-0 items-center gap-2 rounded-[var(--radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-2.5 md:justify-self-start"
            aria-label={"Loculary - " + t.nav.home}
          >
            <LocularyLogo
              className="gap-2 sm:gap-2.5 transition-transform duration-200 group-hover:scale-[1.01]"
              wordmarkClassName="text-base font-bold tracking-[-0.03em] sm:text-lg"
            />
          </Link>

          <div className="flex shrink-0 items-center justify-self-end gap-0.5 sm:gap-1">
            <AppLink href={getToolsPath(locale)} variant="navigation" className="hidden lg:inline-flex">
              {t.nav.explore}
            </AppLink>
            <HeaderSearch locale={locale} searchLabel={t.tools.searchLabel} />
            <DesktopHeaderMenu locale={locale} />
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
