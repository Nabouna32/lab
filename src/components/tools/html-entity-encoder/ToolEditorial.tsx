import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Encoder ou décoder des entités HTML",
        text: "Encodez les caractères spéciaux HTML courants ou décodez les entités nommées prises en charge et les références numériques décimales ou hexadécimales.",
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
        title: "Encode or decode HTML entities",
        text: "Encode common HTML-special characters, or decode supported named entities and decimal or hexadecimal numeric references.",
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
