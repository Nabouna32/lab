import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Estimer un temps de téléchargement", text: "Indiquez la taille du fichier et votre vitesse de téléchargement. Le calcul estime le temps nécessaire en supposant que le débit reste constant pendant tout le téléchargement." },
      { title: "Exemple", text: "Avec un fichier de 1 Go et un débit de 100 Mbps, le temps théorique est d'environ 1 minute et 20 secondes. En pratique, le résultat peut varier selon la qualité de la connexion et la charge du serveur." },
    ],
  },
  en: {
    sections: [
      { title: "Estimate a download time", text: "Enter the file size and your download speed. The calculation estimates the required time assuming the transfer rate remains constant throughout the download." },
      { title: "Example", text: "With a 1 GB file and a 100 Mbps connection, the theoretical time is about 1 minute and 20 seconds. In practice, the result may vary depending on connection quality and server load." },
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
