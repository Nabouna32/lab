import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    title: "💾 Comment estimer une taille de fichier ?",
    intro: "Indiquez la durée du contenu et son débit binaire. Le calcul convertit la durée en secondes, multiplie par le débit et exprime le résultat dans l'unité de stockage choisie.",
    principle: "Principe",
    exampleTitle: "💡 Exemple",
    example: "Pour 10 minutes à 8 Mbit/s, la taille théorique est d'environ 600 Mo. Le résultat est une estimation : un fichier réel peut contenir des données supplémentaires ou utiliser une compression variable.",
  },
  en: {
    title: "💾 How do you estimate a file size?",
    intro: "Enter the content duration and its bitrate. The calculation converts the duration to seconds, multiplies it by the bitrate, and expresses the result in the selected storage unit.",
    principle: "Principle",
    exampleTitle: "💡 Example",
    example: "For 10 minutes at 8 Mbps, the theoretical size is about 600 MB. This is an estimate: a real file may contain additional data or use variable compression.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.title}>
        <p>{t.intro}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.principle}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">file size = duration × bitrate ÷ 8</p>
        </Formula>
      </ToolSection>
      <ToolSection title={t.exampleTitle}><p>{t.example}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
