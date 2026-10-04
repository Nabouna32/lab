import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: [
    { title: "Comment fonctionnent les fuseaux horaires ?", text: "Les fuseaux sont identifiés avec les noms IANA, par exemple Europe/Paris ou America/New_York. Le navigateur utilise ses propres données de fuseaux pour déterminer le décalage applicable à la date choisie." },
    { title: "Changements d’heure", text: "Une heure locale peut ne pas exister lors d’un passage à l’heure d’été, ou apparaître deux fois lors d’un retour à l’heure standard. Le convertisseur signale ces cas et, lorsqu’une heure est répétée, utilise la première occurrence." },
    { title: "Traitement local", text: "La conversion est effectuée entièrement dans votre navigateur avec l’API internationale JavaScript. Aucune donnée n’est envoyée à Loculary ou à un service externe." },
  ],
  en: [
    { title: "How time zones work", text: "Time zones use IANA identifiers such as Europe/Paris or America/New_York. Your browser uses its own time-zone data to determine the offset that applies to the selected date." },
    { title: "Daylight-saving changes", text: "A local time can be skipped when clocks move forward or occur twice when clocks move back. The converter identifies these cases and uses the first occurrence when a local time repeats." },
    { title: "Local processing", text: "Conversion happens entirely in your browser using the JavaScript internationalization API. No data is sent to Loculary or an external service." },
  ],
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}