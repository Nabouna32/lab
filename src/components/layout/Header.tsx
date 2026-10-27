import Link from "next/link";
import HeaderSearch from "@/components/layout/HeaderSearch";
import { PageContainer } from "@/components/layout/PageLayout";
import DesktopHeaderMenu from "@/components/layout/DesktopHeaderMenu";
import LocularyLogo from "@/components/brand/LocularyLogo";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { Alignment } from "@/components/layout/compose/Alignment";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Modifier, RowScope } from "@/components/layout/compose/Modifier";
import { Row } from "@/components/layout/compose/Row";
import { Spacer } from "@/components/layout/compose/Spacer";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]">
      <PageContainer width="wide" spacing="none">
        <Row
          horizontalArrangement={Arrangement.spacedBy("var(--header-layout-gap)")}
          verticalAlignment={Alignment.CenterVertically}
          className="h-14 [--header-layout-gap:var(--space-2)] sm:h-16 sm:[--header-layout-gap:var(--space-3)]"
        >
          <Link
            href={"/" + locale}
            className="group hidden shrink-0 items-center gap-2 rounded-[var(--shape-corner-large)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-2.5 md:hidden"
            aria-label={"Loculary - " + t.nav.home}
          >
            <LocularyLogo
              className="gap-2 sm:gap-2.5 transition-transform duration-200 group-hover:scale-[1.01]"
              wordmarkClassName="text-base font-bold tracking-[-0.03em] sm:text-lg"
            />
          </Link>

          <Spacer modifier={Modifier.then(RowScope.weight(1))} />

          <Row
            horizontalArrangement={Arrangement.spacedBy("var(--header-control-gap)")}
            verticalAlignment={Alignment.CenterVertically}
            className="shrink-0 [--header-control-gap:0.125rem] sm:[--header-control-gap:var(--space-1)]"
          >
            <HeaderSearch locale={locale} searchLabel={t.tools.searchLabel} />
            <DesktopHeaderMenu locale={locale} />
          </Row>
        </Row>
      </PageContainer>
    </header>
  );
}
