import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "🔤 Que compte cet outil ?", text: "Saisissez ou collez un texte pour obtenir instantanément le nombre de mots, de caractères, de caractères sans espaces, d'espaces et de lignes." },
      { title: "💡 À quoi peut-il servir ?", text: "Il peut aider à respecter une limite de caractères, préparer une publication, vérifier la longueur d'un texte ou contrôler rapidement un contenu avant de l'envoyer." },
    ],
  },
  en: {
    sections: [
      { title: "🔤 What does this tool count?", text: "Enter or paste text to instantly count words, characters, characters without spaces, spaces, and lines." },
      { title: "💡 What is it useful for?", text: "It can help meet a character limit, prepare a post, check text length, or quickly review content before sending it." },
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
