import { notFound } from "next/navigation";
import Categories from "@/components/home/Categories";
import DiscoverTools from "@/components/home/DiscoverTools";
import Hero from "@/components/home/Hero";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return getPublicPageMetadata({
    title: t.home.metaTitle,
    description: t.home.description,
    path: `/${locale}`,
  }, locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main>
      <Hero locale={locale} />
      <DiscoverTools locale={locale} />
      <Categories locale={locale} />
    </main>
  );
}
