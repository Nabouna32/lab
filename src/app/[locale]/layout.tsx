import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { getTheme } from "@teispace/next-themes/server";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMessages } from "@/lib/i18n/messages";
import { getLanguage, isLocale, locales } from "@/lib/i18n/config";
import "@/app/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    title: "Utiluna",
    description: messages.home.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const initialTheme = await getTheme();
  const direction = getLanguage(locale).direction;

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={geistSans.variable + " " + geistMono.variable}>
        <ThemeProvider initialTheme={initialTheme ?? undefined}>
          <Header />
          {children}
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
