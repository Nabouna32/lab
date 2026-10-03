import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: { sections: [
    { title: "Décoder un JWT", text: "Collez un JSON Web Token pour lire son en-tête, son contenu et sa signature encodée, directement dans votre navigateur." },
    { title: "Décodage ≠ vérification", text: "Cet outil décode les trois segments d’un JWT mais ne vérifie pas la signature et ne confirme pas que le token est authentique ou valide." },
    { title: "Traitement local", text: "Le token est décodé dans votre navigateur. Aucune donnée saisie n’est envoyée à Loculary ou à un service externe." },
  ] },
  en: { sections: [
    { title: "Decode a JWT", text: "Paste a JSON Web Token to read its header, payload, and encoded signature directly in your browser." },
    { title: "Decoding is not verification", text: "This tool decodes the three JWT segments but does not verify the signature or confirm that the token is authentic or valid." },
    { title: "Local processing", text: "The token is decoded in your browser. No entered data is sent to Loculary or an external service." },
  ] },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
