import Link from "next/link";
import { LocularyLogo } from "@/components/brand/LocularyLogo";
import { DesktopHeaderMenu } from "@/components/layout/DesktopHeaderMenu";
import HeaderSearch from "@/components/layout/HeaderSearch";
import { TopAppBar } from "@/components/ui/TopAppBar";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <TopAppBar
      title={
        <Link
          href={`/${locale}`}
          aria-label={t.nav.home}
          className="group flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] md:hidden"
        >
          <LocularyLogo className="h-8 w-auto sm:h-9" />
        </Link>
      }
      actions={
        <>
          <HeaderSearch locale={locale} searchLabel={t.tools.searchLabel} />
          <DesktopHeaderMenu locale={locale} />
        </>
      }
      className="sticky top-0 z-50 border-b border-[var(--border)]/80"
      style={{ viewTransitionName: "loculary-header" }}
      contentStyle={{
        maxWidth: "var(--layout-content-wide)",
        marginInline: "auto",
        paddingInline: "var(--layout-page-gutter)",
      }}
    />
  );
}
