import { notFound } from "next/navigation";
import SharedCollectionView from "@/components/collections/SharedCollectionView";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function SharedCollectionPage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale: rawLocale, token } = await params;
  if (!isLocale(rawLocale) || !/^[0-9a-f-]{36}$/.test(token)) notFound();
  return <SharedCollectionView locale={rawLocale as Locale} token={token} />;
}
