import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import VisualLab from "./VisualLab";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Material 3 Visual Lab — Loculary",
  description: "An isolated experimental space to compare visual directions for Loculary.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function DesignLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <nav className={styles.auditEntry} aria-label={locale === "fr" ? "Outils du Design Lab" : "Design Lab tools"}>
        <p>{locale === "fr"
          ? "Tu veux vérifier la conformité, pas seulement comparer des rendus ? Ouvre le registre d’audit composant par composant."
          : "Need to review conformance, not just compare appearances? Open the component-by-component audit register."}</p>
        <Link className={styles.auditLink} href={`/${locale}/design-lab/audit`}>
          {locale === "fr" ? "Ouvrir l’audit M3 →" : "Open M3 audit →"}
        </Link>
      </nav>
      <VisualLab initialLocale={locale} />
    </>
  );
}
