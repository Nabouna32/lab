import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    datesTitle: "📅 Calculer une durée entre deux dates",
    dates: "Saisissez une date de début et une date de fin pour connaître le nombre de jours, d'heures et de minutes qui les séparent.",
    timesTitle: "🕐 Calculer une durée entre deux horaires",
    times: "Utilisez le mode horaires pour calculer un intervalle dans une même journée. Si l'heure de fin est plus tôt que l'heure de début, le calcul considère qu'il s'agit du lendemain.",
  },
  en: {
    datesTitle: "📅 Calculate a duration between two dates",
    dates: "Enter a start date and an end date to find the number of days, hours, and minutes between them.",
    timesTitle: "🕐 Calculate a duration between two times",
    times: "Use time mode to calculate an interval within a day. If the end time is earlier than the start time, the calculation treats it as the following day.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.datesTitle}><p>{t.dates}</p></ToolSection>
      <ToolSection title={t.timesTitle}><p>{t.times}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
