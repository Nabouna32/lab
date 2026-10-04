import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Créer un tableau Markdown", text: "Ajoutez des lignes et des colonnes, saisissez vos en-têtes et vos valeurs, puis copiez le Markdown généré. L’outil fonctionne entièrement dans votre navigateur." },
      { title: "Aligner les colonnes", text: "Chaque colonne peut être alignée à gauche, au centre ou à droite. Le choix est traduit dans la ligne de séparation Markdown." },
      { title: "Traitement local", text: "Le tableau est généré dans votre navigateur. Vos données ne sont pas envoyées à un service distant." },
    ],
  },
  en: {
    sections: [
      { title: "Create a Markdown table", text: "Add rows and columns, enter your headers and values, then copy the generated Markdown. The tool runs entirely in your browser." },
      { title: "Align columns", text: "Each column can be aligned left, center, or right. The selection is represented in the Markdown separator row." },
      { title: "Local processing", text: "The table is generated in your browser. Your data is not sent to a remote service." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
