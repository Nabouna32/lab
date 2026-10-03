import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Lire les composants d’une URL",
        text: "Collez une URL absolue pour voir séparément son protocole, son origine, son hôte, son chemin, sa requête et son fragment. Le navigateur utilise son API URL native pour effectuer l’analyse.",
      },
      {
        title: "Inspecter les paramètres de requête",
        text: "Les paramètres après le point d’interrogation sont présentés un par un. Les valeurs encodées sont décodées par l’API URL et les paramètres répétés restent distincts.",
      },
      {
        title: "Traitement local",
        text: "L’URL saisie est analysée entièrement dans votre navigateur. Elle n’est envoyée à aucun service externe et n’est pas stockée par Loculary.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Read URL components",
        text: "Paste an absolute URL to inspect its protocol, origin, host, path, query string, and fragment separately. The browser's native URL API performs the parsing.",
      },
      {
        title: "Inspect query parameters",
        text: "Parameters after the question mark are listed individually. Encoded values are decoded by the URL API, and repeated parameters remain separate.",
      },
      {
        title: "Local processing",
        text: "The URL is parsed entirely in your browser. It is not sent to an external service or stored by Loculary.",
      },
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
