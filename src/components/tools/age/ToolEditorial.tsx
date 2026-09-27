import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    calculateTitle: "📅 Comment calculer son âge ?",
    calculate: "Saisissez votre date de naissance puis la date à laquelle vous souhaitez calculer votre âge. Le résultat indique le nombre d'années, de mois et de jours écoulés entre ces deux dates.",
    purposeTitle: "💡 À quoi sert ce calcul ?",
    purpose: "Le calculateur peut servir à connaître un âge exact pour une démarche administrative, vérifier un âge à une date donnée ou simplement connaître la durée écoulée depuis une naissance.",
  },
  en: {
    calculateTitle: "📅 How do you calculate your age?",
    calculate: "Enter your birth date and the date for which you want to calculate your age. The result shows the number of years, months, and days between those two dates.",
    purposeTitle: "💡 What is this calculation useful for?",
    purpose: "The calculator can help determine an exact age for an administrative process, check an age on a given date, or simply find the time elapsed since a birth.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.calculateTitle}><p>{t.calculate}</p></ToolSection>
      <ToolSection title={t.purposeTitle}><p>{t.purpose}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
