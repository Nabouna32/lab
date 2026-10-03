import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Convertir une couleur", text: "Saisissez une couleur en HEX, RGB ou HSL. Loculary la convertit immédiatement dans les trois formats." },
      { title: "Formats acceptés", text: "HEX accepte les formes #RGB et #RRGGBB. RGB accepte rgb(...) et HSL accepte hsl(...), avec des valeurs de teinte en degrés et de saturation/luminosité en pourcentage." },
      { title: "Traitement local", text: "La conversion est effectuée entièrement dans votre navigateur. Aucune couleur saisie n’est envoyée à Loculary ni stockée par Loculary." },
    ],
  },
  en: {
    sections: [
      { title: "Convert a color", text: "Enter a color in HEX, RGB, or HSL. Loculary converts it immediately to all three formats." },
      { title: "Supported formats", text: "HEX accepts #RGB and #RRGGBB. RGB accepts rgb(...), and HSL accepts hsl(...) with hue in degrees and saturation/lightness in percentages." },
      { title: "Local processing", text: "Conversion happens entirely in your browser. Colors you enter are not sent to or stored by Loculary." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
