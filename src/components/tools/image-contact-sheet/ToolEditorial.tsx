import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const sections = locale === "fr" ? [
    { title: "Une vue d’ensemble de vos images", text: "Rassemblez jusqu’à 20 photos dans une seule planche de vignettes. Choisissez 2, 3 ou 4 colonnes, puis affichez les noms de fichiers pour retrouver facilement chaque image." },
    { title: "Téléchargeable et prête à partager", text: "La planche est exportée en PNG, pratique pour l’aperçu, l’impression ou l’ajout dans un document. Les proportions des images sont conservées." },
    { title: "Traitement local et limites explicites", text: "Les images sont décodées et assemblées dans votre navigateur. Rien n’est téléversé ni conservé sur un serveur. Limite : 20 images et 50 Mo au total ; les très grandes images sont réduites pour limiter la mémoire utilisée." },
  ] : [
    { title: "See your images at a glance", text: "Arrange up to 20 photos on one contact sheet. Choose 2, 3, or 4 columns and show filenames to identify each image quickly." },
    { title: "Download and share", text: "Export the sheet as a PNG, ready for previews, printing, or adding to a document. Image proportions are preserved." },
    { title: "Local processing with clear limits", text: "Images are decoded and arranged in your browser. Nothing is uploaded or stored on a server. Limit: 20 images and 50 MB total; very large images are resized to keep memory use bounded." },
  ];
  return <div className="space-y-5">{sections.map((section) => <ToolSection key={section.title} title={section.title}><p>{section.text}</p></ToolSection>)}</div>;
}
