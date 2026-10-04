import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Compresser une image", text: "Sélectionnez une image depuis votre appareil, choisissez le format, la qualité et la dimension maximale, puis téléchargez le résultat." },
      { title: "Traitement local", text: "L’image est décodée et recompressée directement dans votre navigateur. Loculary n’envoie pas votre fichier à un serveur." },
      { title: "Formats et limites", text: "WebP, JPEG et PNG sont proposés. Les fichiers de plus de 25 Mo et les images dépassant 40 millions de pixels sont refusés pour limiter l’usage mémoire du navigateur." },
    ],
  },
  en: {
    sections: [
      { title: "Compress an image", text: "Select an image from your device, choose the format, quality, and maximum dimension, then download the result." },
      { title: "Local processing", text: "The image is decoded and recompressed directly in your browser. Loculary does not upload your file to a server." },
      { title: "Formats and limits", text: "WebP, JPEG, and PNG are available. Files over 25 MB and images above 40 million pixels are rejected to limit browser memory usage." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
