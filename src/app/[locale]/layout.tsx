import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Roboto } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Header from "@/components/layout/Header";
import AdaptiveAppNavigation from "@/components/layout/AdaptiveAppNavigation";
import Footer from "@/components/layout/Footer";
import { getMessages } from "@/lib/i18n/messages";
import { getLanguage, isLocale, locales } from "@/lib/i18n/config";
import "@/app/globals.css";
import { getLocularyThemeStyle } from "@/lib/design-system/rainbow-tones";
import { getPublishedTools } from "@/lib/tools/catalog";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { CollectionsProvider } from "@/components/collections/CollectionsProvider";

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

  const direction = getLanguage(locale).direction;

  return (
    <html lang={locale} dir={direction} data-scroll-behavior="smooth" suppressHydrationWarning style={getLocularyThemeStyle()}>
      <body className={roboto.variable}>
        <ThemeProvider>
          <FavoritesProvider toolIds={getPublishedTools().map((tool) => tool.id)}>
            <CollectionsProvider toolIds={getPublishedTools().map((tool) => tool.id)}>
              <div className="flex min-h-dvh">
                <AdaptiveAppNavigation locale={locale} />
                <div className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
                  <Header locale={locale} />
                  <div className="min-h-0 flex-1" style={{ viewTransitionName: "loculary-workspace" }}>
                    {children}
                  </div>
                  <Footer locale={locale} />
                </div>
              </div>
            </CollectionsProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
