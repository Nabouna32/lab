import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Timestamp Unix et date", text: "Un timestamp Unix représente un instant sous forme du nombre de secondes écoulées depuis le 1er janvier 1970 à 00:00:00 UTC. Le mode millisecondes utilise la même origine avec une précision mille fois plus fine." },
      { title: "Fuseau horaire", text: "Lorsqu’un timestamp est converti en date, Loculary affiche la date dans votre fuseau horaire local ainsi qu’en UTC. Lorsqu’une date locale est convertie, le timestamp correspond à l’instant réel associé à cette date et heure dans votre fuseau horaire." },
      { title: "Traitement local", text: "Les conversions sont effectuées entièrement dans votre navigateur. Aucune donnée n’est envoyée à Loculary ou à un service externe." },
    ],
  },
  en: {
    sections: [
      { title: "Unix timestamps and dates", text: "A Unix timestamp represents an instant as the number of seconds elapsed since January 1, 1970 at 00:00:00 UTC. Milliseconds use the same origin with one-thousandth of a second precision." },
      { title: "Time zones", text: "When a timestamp is converted to a date, Loculary shows the date in your local time zone as well as UTC. When a local date is converted, the timestamp represents the instant associated with that date and time in your time zone." },
      { title: "Local processing", text: "Conversions are performed entirely in your browser. No data is sent to Loculary or an external service." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
