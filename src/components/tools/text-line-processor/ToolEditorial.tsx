import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Nettoyer une liste de lignes",
        text: "Collez votre texte puis combinez le retrait des espaces superflus, la suppression des lignes vides et la déduplication. Vous pouvez aussi trier les lignes par ordre alphabétique ou conserver leur ordre initial.",
      },
      {
        title: "Traitement local et limites",
        text: "Le texte est traité directement dans votre navigateur et n’est pas envoyé à Loculary. Pour préserver la réactivité du navigateur, la limite est fixée à 500 000 caractères.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Clean a list of lines",
        text: "Paste your text and combine trimming, blank-line removal, and de-duplication. You can also sort lines alphabetically or keep their original order.",
      },
      {
        title: "Local processing and limits",
        text: "Your text is processed directly in your browser and is not sent to Loculary. To keep the browser responsive, input is limited to 500,000 characters.",
      },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return (
    <>
      {content[locale].sections.map((section, index) => (
        <ToolSection key={section.title} title={section.title} collapsible={index > 0}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
    </>
  );
}
