import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Comparer deux versions d’un texte",
        text: "Collez la version originale à gauche et la version modifiée à droite. Loculary compare les lignes et met en évidence les ajouts et suppressions sans envoyer le contenu à un serveur.",
      },
      {
        title: "Une comparaison ligne par ligne",
        text: "Le résultat conserve les lignes identiques et affiche les suppressions et ajouts avec leur numéro de ligne. Cette vue convient notamment aux textes, notes, configurations et extraits de code.",
      },
      {
        title: "Traitement local",
        text: "La comparaison est effectuée directement dans votre navigateur. Les textes saisis ne sont pas transmis à Loculary.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Compare two versions of text",
        text: "Paste the original version on the left and the updated version on the right. Loculary compares the lines and highlights additions and removals without sending the content to a server.",
      },
      {
        title: "Line-by-line comparison",
        text: "The result keeps unchanged lines and shows additions and removals with their line numbers. It is useful for text, notes, configuration files, and code snippets.",
      },
      {
        title: "Local processing",
        text: "The comparison runs directly in your browser. The text you enter is not sent to Loculary.",
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
