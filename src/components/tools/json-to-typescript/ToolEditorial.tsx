import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Générer des types TypeScript à partir de JSON", text: "Collez un exemple JSON pour générer des interfaces et types TypeScript correspondant à sa structure. Les objets imbriqués, les tableaux, les valeurs nulles et les propriétés présentes seulement dans certains éléments sont pris en compte." },
      { title: "Nommer le type racine", text: "Choisissez le nom de l’interface ou du type racine. Les noms de types imbriqués sont dérivés des propriétés de votre JSON." },
      { title: "Traitement local", text: "L’inférence et la génération du code sont effectuées dans votre navigateur. Les données restent dans cette page et ne sont pas transmises à un service distant." },
    ],
  },
  en: {
    sections: [
      { title: "Generate TypeScript types from JSON", text: "Paste a JSON sample to generate TypeScript interfaces and types matching its structure. Nested objects, arrays, null values, and properties missing from some items are handled." },
      { title: "Name the root type", text: "Choose the name of the root interface or type. Nested type names are derived from your JSON properties." },
      { title: "Local processing", text: "Inference and code generation happen in your browser. The data stays in this page and is not sent to a remote service." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return <>{t.sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
