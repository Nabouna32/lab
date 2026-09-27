import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    sections: [
      { title: "📅 Calculer une durée entre deux dates", text: "Saisissez une date de début et une date de fin pour connaître le nombre de jours, d'heures et de minutes qui les séparent." },
      { title: "🕐 Calculer une durée entre deux horaires", text: "Utilisez le mode horaires pour calculer un intervalle dans une même journée. Si l'heure de fin est plus tôt que l'heure de début, le calcul considère qu'il s'agit du lendemain." },
    ],
  },
  en: {
    sections: [
      { title: "📅 Calculate a duration between two dates", text: "Enter a start date and an end date to find the number of days, hours, and minutes between them." },
      { title: "🕐 Calculate a duration between two times", text: "Use time mode to calculate an interval within a day. If the end time is earlier than the start time, the calculation treats it as the following day." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return (
    <>
      {content[locale].sections.map((section) => (
        <ToolSection key={section.title} title={section.title}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
      <BackToTools locale={locale} />
    </>
  );
}
