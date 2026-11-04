import Link from "next/link";
import LocularyLogo from "@/components/brand/LocularyLogo";
import HeaderPreferences from "@/components/layout/HeaderPreferences";
import HeaderSearch from "@/components/layout/HeaderSearch";
import { TopAppBar } from "@/components/ui/TopAppBar";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import styles from "./Header.module.css";

export default function Header({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <div className={styles.shell} style={{ viewTransitionName: "loculary-header" }}>
      <TopAppBar
        title={
          <Link
            href={`/${locale}`}
            aria-label={"Loculary - " + t.nav.home}
            className="group flex shrink-0 items-center gap-2 rounded-[var(--shape-corner-large)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-2.5 md:hidden"
          >
            <LocularyLogo
              className="gap-2 sm:gap-2.5 transition-transform duration-200 group-hover:scale-[1.01]"
            />
          </Link>
        }
        actions={
          <>
            <HeaderSearch locale={locale} searchLabel={t.tools.searchLabel} />
            <HeaderPreferences locale={locale} />
          </>
        }
        contentStyle={{
          maxWidth: "var(--layout-content-wide)",
          marginInline: "auto",
          paddingInline: "var(--layout-page-gutter)",
        }}
      />
    </div>
  );
}
