import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Convertir un CSV en JSON", text: "Transformez un tableau CSV en tableau d’objets JSON. Les champs entre guillemets, les guillemets échappés et les retours à la ligne sont pris en charge." },
      { title: "Convertir un JSON en CSV", text: "Fournissez un tableau JSON d’objets pour obtenir un CSV. Les colonnes sont déduites de l’ensemble des clés et les valeurs complexes sont représentées en JSON dans leur cellule." },
      { title: "Traitement local", text: "La conversion est effectuée dans votre navigateur. Les données restent dans cette page et ne sont pas transmises à un service distant." },
    ],
  },
  en: {
    sections: [
      { title: "Convert CSV to JSON", text: "Turn a CSV table into an array of JSON objects. Quoted fields, escaped quotes, and line breaks are supported." },
      { title: "Convert JSON to CSV", text: "Provide an array of JSON objects to produce CSV. Columns are inferred from all object keys, and complex values are serialized as JSON inside their cells." },
      { title: "Local processing", text: "Conversion happens in your browser. The data stays in this page and is not sent to a remote service." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return <>{t.sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
