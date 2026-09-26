import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "📅 Comment calculer son âge ?" : "📅 How do you calculate your age?"}>
            <p>{fr ? "Saisissez votre date de naissance puis la date à laquelle vous souhaitez calculer votre âge. Le résultat indique le nombre d'années, de mois et de jours écoulés entre ces deux dates." : "Enter your birth date and the date for which you want to calculate your age. The result shows the number of years, months, and days between those two dates."}</p>
          </ToolSection>
          <ToolSection title={fr ? "💡 À quoi sert ce calcul ?" : "💡 What is this calculation useful for?"}>
            <p>{fr ? "Le calculateur peut servir à connaître un âge exact pour une démarche administrative, vérifier un âge à une date donnée ou simplement connaître la durée écoulée depuis une naissance." : "The calculator can help determine an exact age for an administrative process, check an age on a given date, or simply find the time elapsed since a birth."}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );;
}
