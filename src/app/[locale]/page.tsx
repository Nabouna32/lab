import { notFound } from "next/navigation";
import Categories from "@/components/home/Categories";
import DiscoverTools from "@/components/home/DiscoverTools";
import Hero from "@/components/home/Hero";
import { isLocale } from "@/lib/i18n/config";

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
