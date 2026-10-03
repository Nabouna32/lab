import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Créer une palette", text: "Choisissez une couleur de départ pour générer immédiatement plusieurs harmonies : analogique, complémentaire, triadique, complémentaire scindée et monochromatique." },
      { title: "Copier les couleurs", text: "Chaque couleur possède sa propre action de copie afin de récupérer facilement les valeurs HEX pour un design, une interface ou une feuille de style." },
      { title: "Traitement local", text: "La génération est effectuée entièrement dans votre navigateur. Aucune couleur saisie n’est envoyée à Loculary ni stockée par Loculary." },
    ],
  },
  en: {
    sections: [
      { title: "Create a palette", text: "Choose a starting color to instantly generate analogous, complementary, triadic, split-complementary, and monochromatic palettes." },
      { title: "Copy colors", text: "Each color has its own copy action so you can quickly reuse HEX values in a design, interface, or stylesheet." },
      { title: "Local processing", text: "Generation happens entirely in your browser. Colors you enter are not sent to or stored by Loculary." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
