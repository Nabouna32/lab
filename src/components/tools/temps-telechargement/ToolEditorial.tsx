import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    title: "📥 Comment calculer un temps de téléchargement ?",
    intro: "Indiquez la taille du fichier et votre vitesse de téléchargement. Le calcul estime le temps nécessaire en supposant que le débit reste constant pendant tout le téléchargement.",
    exampleTitle: "💡 Exemple",
    example: "Avec un fichier de 1 Go et un débit de 100 Mbps, le temps théorique est d'environ 1 minute et 20 secondes. En pratique, le résultat peut varier selon la qualité de la connexion et la charge du serveur.",
  },
  en: {
    title: "📥 How do you calculate a download time?",
    intro: "Enter the file size and your download speed. The calculation estimates the required time assuming the transfer rate remains constant throughout the download.",
    exampleTitle: "💡 Example",
    example: "With a 1 GB file and a 100 Mbps connection, the theoretical time is about 1 minute and 20 seconds. In practice, the result may vary depending on connection quality and server load.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.title}><p>{t.intro}</p></ToolSection>
      <ToolSection title={t.exampleTitle}><p>{t.example}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
