import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "📅 Calculer une durée entre deux dates" : "📅 Calculate a duration between two dates"}>
            <p>{fr ? "Saisissez une date de début et une date de fin pour connaître le nombre de jours, d'heures et de minutes qui les séparent." : "Enter a start date and an end date to find the number of days, hours, and minutes between them."}</p>
          </ToolSection>
          <ToolSection title={fr ? "🕐 Calculer une durée entre deux horaires" : "🕐 Calculate a duration between two times"}>
            <p>{fr ? "Utilisez le mode horaires pour calculer un intervalle dans une même journée. Si l'heure de fin est plus tôt que l'heure de début, le calcul considère qu'il s'agit du lendemain." : "Use time mode to calculate an interval within a day. If the end time is earlier than the start time, the calculation treats it as the following day."}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );
}
