import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Roboto, Roboto_Mono } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMessages } from "@/lib/i18n/messages";
import { getLanguage, isLocale, locales } from "@/lib/i18n/config";
import "@/app/globals.css";

const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["400", "500", "700", "900"] });
const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"], weight: ["400", "500", "700"] });

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
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={roboto.variable + " " + robotoMono.variable}>
        <ThemeProvider>
          <Header locale={locale} />
          <div className="min-h-0" style={{ viewTransitionName: "loculary-workspace" }}>
            {children}
          </div>
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
