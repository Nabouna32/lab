import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Convertir un nombre", text: "Saisissez un entier et choisissez sa base de départ et sa base d’arrivée. Le calcul fonctionne de la base 2 à la base 36." },
      { title: "Bases courantes", text: "La base 2 est utilisée pour le binaire, la base 8 pour l’octal, la base 10 pour le décimal et la base 16 pour l’hexadécimal. Les bases jusqu’à 36 utilisent les chiffres 0–9 puis les lettres A–Z." },
      { title: "Traitement local", text: "La conversion est effectuée entièrement dans votre navigateur. La valeur saisie n’est ni envoyée ni stockée par Loculary." },
    ],
  },
  en: {
    sections: [
      { title: "Convert a number", text: "Enter an integer and choose its source and target bases. The converter supports bases 2 through 36." },
      { title: "Common bases", text: "Base 2 is binary, base 8 is octal, base 10 is decimal, and base 16 is hexadecimal. Bases up to 36 use digits 0–9 followed by letters A–Z." },
      { title: "Local processing", text: "Conversion happens entirely in your browser. The value you enter is not sent to or stored by Loculary." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
