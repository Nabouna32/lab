import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Compresser plusieurs images en une fois", text: "Sélectionnez jusqu’à 10 images, choisissez le format, la qualité et la dimension maximale. Comparez les résultats, puis téléchargez les images optimisées dans une seule archive ZIP." },
      { title: "Traitement local", text: "L’image est décodée et recompressée directement dans votre navigateur. Loculary n’envoie pas votre fichier à un serveur." },
      { title: "Formats et limites", text: "WebP, JPEG et PNG sont proposés. Jusqu’à 10 fichiers et 50 Mo au total, avec une limite de 25 Mo par fichier et de 40 millions de pixels par image." },
    ],
  },
  en: {
    sections: [
      { title: "Compress multiple images at once", text: "Select up to 10 images, choose the format, quality, and maximum dimension. Compare the results, then download the optimized images in one ZIP archive." },
      { title: "Local processing", text: "The image is decoded and recompressed directly in your browser. Loculary does not upload your file to a server." },
      { title: "Formats and limits", text: "WebP, JPEG, and PNG are available. Up to 10 files and 50 MB total, with a 25 MB per-file limit and 40 million pixels per image." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
