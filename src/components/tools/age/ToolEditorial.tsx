import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    sections: [
      { title: "📅 Comment calculer son âge ?", text: "Saisissez votre date de naissance puis la date à laquelle vous souhaitez calculer votre âge. Le résultat indique le nombre d'années, de mois et de jours écoulés entre ces deux dates." },
      { title: "💡 À quoi sert ce calcul ?", text: "Le calculateur peut servir à connaître un âge exact pour une démarche administrative, vérifier un âge à une date donnée ou simplement connaître la durée écoulée depuis une naissance." },
    ],
  },
  en: {
    sections: [
      { title: "📅 How do you calculate your age?", text: "Enter your birth date and the date for which you want to calculate your age. The result shows the number of years, months, and days between those two dates." },
      { title: "💡 What is this calculation useful for?", text: "The calculator can help determine an exact age for an administrative process, check an age on a given date, or simply find the time elapsed since a birth." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      {t.sections.map((section) => (
        <ToolSection key={section.title} title={section.title}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
      <BackToTools locale={locale} />
    </>
  );
}
