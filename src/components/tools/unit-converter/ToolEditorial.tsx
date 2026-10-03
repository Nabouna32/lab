import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Convertir une unité",
        text: "Choisissez une catégorie, saisissez une valeur, puis sélectionnez les unités de départ et d’arrivée. Le résultat se met à jour instantanément.",
      },
      {
        title: "Catégories prises en charge",
        text: "La version actuelle couvre les longueurs, masses, températures, volumes et surfaces. Les conversions sont calculées directement dans votre navigateur.",
      },
      {
        title: "Traitement local",
        text: "Aucune valeur saisie n’est envoyée à Loculary ou à un service externe.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Convert a unit",
        text: "Choose a category, enter a value, then select the source and target units. The result updates instantly.",
      },
      {
        title: "Supported categories",
        text: "The current version covers length, mass, temperature, volume, and area. Conversions are calculated directly in your browser.",
      },
      {
        title: "Local processing",
        text: "No value you enter is sent to Loculary or an external service.",
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
