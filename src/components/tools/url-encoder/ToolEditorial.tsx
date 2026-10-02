import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Encoder un paramètre d’URL",
        text: "Utilisez le mode « composant » pour encoder une valeur destinée à une URL, par exemple le texte d’un paramètre de requête. Les espaces deviennent %20 et les caractères réservés sont encodés pour éviter qu’ils soient interprétés comme une partie de la syntaxe de l’URL.",
      },
      {
        title: "Encoder une URL complète",
        text: "Le mode « URL complète » conserve la syntaxe d’une adresse, comme https://, les chemins, les points d’interrogation et les séparateurs de paramètres, tout en encodant les caractères qui ne peuvent pas être utilisés tels quels.",
      },
      {
        title: "Décoder une valeur",
        text: "Le décodage inverse la transformation et restitue les caractères d’origine lorsqu’ils sont représentés par un encodage URL valide. Le traitement reste entièrement local dans votre navigateur.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Encode a URL parameter",
        text: "Use component mode for a value that will be placed inside a URL, such as a query parameter. Spaces become %20 and reserved characters are encoded so they are not interpreted as part of the URL syntax.",
      },
      {
        title: "Encode a complete URL",
        text: "Complete URL mode preserves address syntax such as https://, paths, question marks, and query separators while encoding characters that cannot safely be used as written.",
      },
      {
        title: "Decode a value",
        text: "Decoding reverses the transformation and restores the original characters when they are represented by valid URL encoding. Everything is processed locally in your browser.",
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
