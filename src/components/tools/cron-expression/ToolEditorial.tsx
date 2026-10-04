import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Comprendre une expression Cron",
        text: "Saisissez une expression Cron classique à cinq champs pour vérifier sa syntaxe, voir chaque champ et prévisualiser ses prochaines exécutions.",
      },
      {
        title: "Un format Cron classique",
        text: "Loculary utilise le format numérique classique à cinq champs : minute, heure, jour du mois, mois et jour de la semaine. Les caractères *, listes, plages et pas sont pris en charge. Les variantes Quartz à six ou sept champs ne sont pas prises en charge.",
      },
      {
        title: "Calcul local des prochaines exécutions",
        text: "L’analyse et les calculs sont effectués directement dans votre navigateur. Les prochaines exécutions sont affichées dans le fuseau horaire local de votre appareil.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Understand a Cron expression",
        text: "Enter a classic five-field Cron expression to validate its syntax, inspect each field, and preview upcoming runs.",
      },
      {
        title: "Classic Cron format",
        text: "Loculary uses the classic numeric five-field format: minute, hour, day of month, month, and day of week. It supports *, lists, ranges, and steps. Quartz six- or seven-field variants are not supported.",
      },
      {
        title: "Local upcoming-run calculation",
        text: "Parsing and upcoming-run calculations happen directly in your browser. Upcoming runs are displayed in your device's local time zone.",
      },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return (
    <>
      {content[locale].sections.map((section, index) => (
        <ToolSection key={section.title} title={section.title} collapsible={index > 0}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
    </>
  );
}
