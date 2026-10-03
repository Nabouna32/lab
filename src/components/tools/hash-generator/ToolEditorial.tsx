import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: { sections: [
    { title: "Hacher du texte", text: "Choisissez un algorithme SHA et générez l’empreinte hexadécimale d’un texte directement dans votre navigateur." },
    { title: "Choisir l’algorithme", text: "SHA-256 est un choix courant pour les empreintes modernes. SHA-384 et SHA-512 produisent des empreintes plus longues. SHA-1 est conservé pour les cas de compatibilité et ne doit pas être choisi pour de nouveaux usages de sécurité." },
    { title: "Traitement local", text: "Le texte est traité par l’API Web Crypto de votre navigateur. Aucune donnée saisie n’est envoyée à Loculary ou à un service externe." },
  ] },
  en: { sections: [
    { title: "Hash text", text: "Choose a SHA algorithm and generate the hexadecimal digest of text directly in your browser." },
    { title: "Choose an algorithm", text: "SHA-256 is a common choice for modern digests. SHA-384 and SHA-512 produce longer digests. SHA-1 is kept for compatibility and should not be chosen for new security uses." },
    { title: "Local processing", text: "Your text is processed by your browser’s Web Crypto API. No entered data is sent to Loculary or an external service." },
  ] },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
