import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Transformer la casse d’un texte",
        text: "Saisissez ou collez un texte, puis choisissez la casse souhaitée. Les formats camelCase, PascalCase, snake_case et kebab-case reconstruisent les mots à partir des espaces, séparateurs et frontières entre minuscules et majuscules.",
      },
      {
        title: "Traitement local",
        text: "Le texte est transformé directement dans votre navigateur. Rien n’est envoyé à Loculary.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Transform text case",
        text: "Enter or paste text, then choose the case you need. camelCase, PascalCase, snake_case, and kebab-case rebuild words from spaces, separators, and lowercase-to-uppercase boundaries.",
      },
      {
        title: "Local processing",
        text: "Your text is transformed directly in your browser. Nothing is sent to Loculary.",
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
