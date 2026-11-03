import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Roboto } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { RecentToolsProvider } from "@/components/home/RecentToolsProvider";
import Header from "@/components/layout/Header";
import AdaptiveAppNavigation from "@/components/layout/AdaptiveAppNavigation";
import Footer from "@/components/layout/Footer";
import LocalePreferenceBanner from "@/components/layout/LocalePreferenceBanner";
import { getMessages } from "@/lib/i18n/messages";
import { getLanguage, isLocale, locales, type Locale } from "@/lib/i18n/config";
import "@/app/globals.css";
import { getLocularyThemeStyle } from "@/lib/design-system/rainbow-tones";
import { getPublishedTools } from "@/lib/tools/catalog";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { CollectionsProvider } from "@/components/collections/CollectionsProvider";
import { createClient } from "@/lib/supabase/server";

const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getMessages(locale);
  return {
    title: "Loculary",
    description: messages.home.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const requestHeaders = await headers();
  const userId = requestHeaders.get("x-loculary-user-id");
  let preferredLocale: Locale | null = null;

  if (userId) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("locale")
      .eq("id", userId)
      .maybeSingle();
    if (isLocale(profile?.locale)) preferredLocale = profile.locale;
  }

  const direction = getLanguage(locale).direction;
  const toolIds = getPublishedTools().map((tool) => tool.id);

  return (
    <html lang={locale} dir={direction} data-scroll-behavior="smooth" suppressHydrationWarning style={getLocularyThemeStyle()}>
      <body className={roboto.variable}>
        <ThemeProvider>
          <RecentToolsProvider toolIds={toolIds}>
            <FavoritesProvider toolIds={toolIds}>
              <CollectionsProvider toolIds={toolIds}>
                <div className="flex min-h-dvh flex-col">
                  <LocalePreferenceBanner locale={locale} preferredLocale={preferredLocale} />
                  <div className="flex min-h-0 flex-1">
                    <AdaptiveAppNavigation locale={locale} />
                    <div className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
                    <Header locale={locale} />
                    <div className="min-h-0 flex-1" style={{ viewTransitionName: "loculary-workspace" }}>
                      {children}
                    </div>
                      <Footer locale={locale} />
                    </div>
                  </div>
                </div>
              </CollectionsProvider>
            </FavoritesProvider>
          </RecentToolsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
