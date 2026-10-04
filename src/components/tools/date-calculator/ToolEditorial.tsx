import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Ajouter ou retirer une durée à une date", text: "Choisissez une date, puis ajoutez ou retirez un nombre de jours, semaines, mois ou années pour obtenir immédiatement la nouvelle date." },
      { title: "Comment sont gérés les mois ?", text: "Lorsque le jour demandé n'existe pas dans le mois d'arrivée, le calcul utilise le dernier jour de ce mois. Par exemple, ajouter un mois au 31 janvier donne le 28 février, ou le 29 février lors d'une année bissextile." },
    ],
  },
  en: {
    sections: [
      { title: "Add or subtract time from a date", text: "Choose a date, then add or subtract a number of days, weeks, months, or years to get the resulting date immediately." },
      { title: "How are months handled?", text: "When the original day does not exist in the target month, the calculation uses that month's last day. For example, adding one month to January 31 gives February 28, or February 29 in a leap year." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      {t.sections.map((section, index) => (
        <ToolSection key={section.title} title={section.title} collapsible={index > 0}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
    </>
  );
}
