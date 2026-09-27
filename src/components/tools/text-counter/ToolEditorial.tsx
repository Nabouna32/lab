import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    countTitle: "🔤 Que compte cet outil ?",
    count: "Saisissez ou collez un texte pour obtenir instantanément le nombre de mots, de caractères, de caractères sans espaces, d'espaces et de lignes.",
    purposeTitle: "💡 À quoi peut-il servir ?",
    purpose: "Il peut aider à respecter une limite de caractères, préparer une publication, vérifier la longueur d'un texte ou contrôler rapidement un contenu avant de l'envoyer.",
  },
  en: {
    countTitle: "🔤 What does this tool count?",
    count: "Enter or paste text to instantly count words, characters, characters without spaces, spaces, and lines.",
    purposeTitle: "💡 What is it useful for?",
    purpose: "It can help meet a character limit, prepare a post, check text length, or quickly review content before sending it.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.countTitle}><p>{t.count}</p></ToolSection>
      <ToolSection title={t.purposeTitle}><p>{t.purpose}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
