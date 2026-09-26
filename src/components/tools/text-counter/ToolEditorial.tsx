import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "🔤 Que compte cet outil ?" : "🔤 What does this tool count?"}>
            <p>
              {fr
                ? "Saisissez ou collez un texte pour obtenir instantanément le nombre de mots, de caractères, de caractères sans espaces, d'espaces et de lignes."
                : "Enter or paste text to instantly count words, characters, characters without spaces, spaces, and lines."}
            </p>
          </ToolSection>
          <ToolSection title={fr ? "💡 À quoi peut-il servir ?" : "💡 What is it useful for?"}>
            <p>
              {fr
                ? "Il peut aider à respecter une limite de caractères, préparer une publication, vérifier la longueur d'un texte ou contrôler rapidement un contenu avant de l'envoyer."
                : "It can help meet a character limit, prepare a post, check text length, or quickly review content before sending it."}
            </p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );;
}
