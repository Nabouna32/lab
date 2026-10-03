import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Tester une expression régulière", text: "Saisissez une expression régulière, ses indicateurs et un texte de test pour voir les correspondances et les groupes capturés directement dans votre navigateur." },
      { title: "Indicateurs JavaScript", text: "Les indicateurs JavaScript courants sont pris en charge : g pour toutes les correspondances, i pour ignorer la casse, m pour les lignes, s pour le point sur les retours à la ligne, u pour Unicode et y pour la recherche adhérente." },
      { title: "Traitement local", text: "L’expression régulière et le texte sont évalués localement dans votre navigateur. Aucune donnée saisie n’est envoyée à Loculary ou à un service externe." },
    ],
  },
  en: {
    sections: [
      { title: "Test a regular expression", text: "Enter a regular expression, its flags, and test text to see matches and captured groups directly in your browser." },
      { title: "JavaScript flags", text: "Common JavaScript flags are supported: g for all matches, i for case-insensitive matching, m for lines, s for dotAll, u for Unicode, and y for sticky matching." },
      { title: "Local processing", text: "The regular expression and test text are evaluated locally in your browser. No entered data is sent to Loculary or an external service." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
