import Link from "next/link";
import ToolSearch from "@/components/tools/ToolSearch";
import MobileHeaderSearch from "@/components/layout/MobileHeaderSearch";
import DesktopHeaderMenu from "@/components/layout/DesktopHeaderMenu";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";

const textLink =
  "flex h-9 shrink-0 items-center gap-2 border border-transparent px-2.5 text-sm font-semibold text-[var(--muted)] outline-none transition-[border-color,background-color,color] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]">
      <div className="mx-auto max-w-[var(--content-wide)] px-3 sm:px-6 lg:px-8">
        <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2 sm:h-16 sm:gap-3 lg:grid-cols-[1fr_minmax(24rem,36rem)_1fr]">
          <Link
            href={"/" + locale}
            className="group flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-2.5 md:justify-self-start"
            aria-label={"Loculary - " + t.nav.home}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] text-sm font-black text-white transition-transform duration-200 group-hover:scale-[1.03] sm:h-9 sm:w-9">
              L
            </span>
            <span className="hidden text-lg font-bold tracking-[-0.03em] sm:inline">Loculary</span>
          </Link>

          <div className="hidden w-full max-w-[36rem] justify-self-center lg:block">
            <ToolSearch locale={locale} instanceId="header-tool-search" compact />
          </div>

          <div className="flex shrink-0 items-center justify-self-end gap-0.5 sm:gap-1">
            <Link href={getToolsPath(locale)} className={textLink + " hidden lg:inline-flex"}>
              {t.nav.explore}
            </Link>
            <MobileHeaderSearch locale={locale} searchLabel={t.tools.searchLabel} closeLabel={t.nav.closeSearch} />
            <DesktopHeaderMenu locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
