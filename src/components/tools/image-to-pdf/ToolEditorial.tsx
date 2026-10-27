import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Column } from "@/components/layout/compose/Column";
import { Arrangement } from "@/components/layout/compose/Arrangement";
export default function ToolEditorial({ locale }: { locale: Locale }) {
 const sections = locale === "fr" ? [
  { title: "Assembler des images en un document", text: "Sélectionnez jusqu’à 10 images JPEG, PNG ou WebP. Loculary crée un PDF multipage, une image par page, avec orientation automatique et proportions conservées." },
  { title: "Vos fichiers restent sur votre appareil", text: "Le décodage, la préparation des images et la génération du PDF se déroulent dans votre navigateur. Aucun téléversement, compte ou stockage distant." },
  { title: "Limites et transparence", text: "Jusqu’à 10 fichiers, 50 Mo au total et 25 Mo par fichier. Les images sont rééchantillonnées à 2 400 pixels maximum et encodées en JPEG ; la transparence devient blanche et une légère perte de qualité est possible." },
 ] : [
  { title: "Combine images into one document", text: "Select up to 10 JPEG, PNG, or WebP images. Loculary creates a multi-page PDF with one image per page, automatic orientation, and preserved proportions." },
  { title: "Your files stay on your device", text: "Image decoding, preparation, and PDF generation happen in your browser. No upload, account, or remote storage is involved." },
  { title: "Limits and transparency", text: "Up to 10 files, 50 MB total, and 25 MB per file. Images are resized to at most 2,400 pixels and encoded as JPEG; transparency becomes white and slight quality loss is possible." },
 ];
 return <Column verticalArrangement={Arrangement.spacedByCss("var(--space-5)")}>{sections.map((section) => <ToolSection key={section.title} title={section.title}><p>{section.text}</p></ToolSection>)}</Column>;
}
