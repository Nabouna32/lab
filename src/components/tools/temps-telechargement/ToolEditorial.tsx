import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "📥 Comment calculer un temps de téléchargement ?" : "📥 How do you calculate a download time?"}>
            <p>{fr ? "Indiquez la taille du fichier et votre vitesse de téléchargement. Le calcul estime le temps nécessaire en supposant que le débit reste constant pendant tout le téléchargement." : "Enter the file size and your download speed. The calculation estimates the required time assuming the transfer rate remains constant throughout the download."}</p>
          </ToolSection>
          <ToolSection title={fr ? "💡 Exemple" : "💡 Example"}>
            <p>{fr ? "Avec un fichier de 1 Go et un débit de 100 Mbps, le temps théorique est d'environ 1 minute et 20 secondes. En pratique, le résultat peut varier selon la qualité de la connexion et la charge du serveur." : "With a 1 GB file and a 100 Mbps connection, the theoretical time is about 1 minute and 20 seconds. In practice, the result may vary depending on connection quality and server load."}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );;
}
