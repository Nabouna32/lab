import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Encoder du texte en Base64",
        text: "Base64 représente des octets sous forme de caractères ASCII. Cet outil encode le texte en UTF-8 avant de produire une chaîne Base64, ce qui permet de conserver correctement les caractères accentués et les emoji.",
      },
      {
        title: "Décoder une chaîne Base64",
        text: "Le décodage transforme la chaîne Base64 en octets puis les interprète comme du texte UTF-8. Les données binaires qui ne forment pas un texte UTF-8 valide sont refusées plutôt que d’être affichées de manière ambiguë.",
      },
      {
        title: "Un traitement entièrement local",
        text: "L’encodage et le décodage sont effectués directement dans votre navigateur. Le contenu saisi n’est pas envoyé à un serveur.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Encode text as Base64",
        text: "Base64 represents bytes as ASCII characters. This tool encodes text as UTF-8 before producing Base64, so accented characters and emoji are preserved correctly.",
      },
      {
        title: "Decode a Base64 string",
        text: "Decoding turns the Base64 string back into bytes and interprets them as UTF-8 text. Binary data that is not valid UTF-8 is rejected instead of being displayed ambiguously.",
      },
      {
        title: "Fully local processing",
        text: "Encoding and decoding happen directly in your browser. The text you enter is not sent to a server.",
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
