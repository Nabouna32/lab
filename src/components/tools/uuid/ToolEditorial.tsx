import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: { sections: [
    { title: "Générer des UUID v4", text: "Cet outil génère des identifiants UUID version 4 aléatoires à l’aide du générateur cryptographiquement sûr fourni par votre navigateur." },
    { title: "Jusqu’à 50 UUID à la fois", text: "Choisissez le nombre d’identifiants à générer, puis copiez la liste en une seule action. Chaque génération produit de nouvelles valeurs aléatoires." },
    { title: "Traitement entièrement local", text: "Les UUID sont générés directement dans votre navigateur. Aucun identifiant ni aucune donnée ne sont envoyés à un serveur." },
  ] },
  en: { sections: [
    { title: "Generate UUID v4 values", text: "This tool generates random version 4 UUIDs using the cryptographically secure generator provided by your browser." },
    { title: "Generate up to 50 UUIDs at once", text: "Choose how many identifiers to generate, then copy the whole list in one action. Each generation creates new random values." },
    { title: "Fully local processing", text: "UUIDs are generated directly in your browser. No identifiers or other data are sent to a server." },
  ] },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
