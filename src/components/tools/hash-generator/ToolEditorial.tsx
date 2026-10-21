import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: { sections: [
    { title: "Calculer l’empreinte d’un texte ou d’un fichier", text: "Choisissez le mode texte ou fichier, puis calculez une empreinte SHA-1, SHA-256, SHA-384 ou SHA-512 directement dans votre navigateur. Les fichiers jusqu’à 100 Mio sont acceptés." },
    { title: "Vérifier l’intégrité d’un téléchargement", text: "Collez éventuellement l’empreinte publiée par la source officielle. Une correspondance confirme que le fichier sélectionné produit la même empreinte ; une différence signifie que les octets ne correspondent pas. Cette comparaison ne prouve pas que la source qui a publié l’empreinte est digne de confiance." },
    { title: "Choisir l’algorithme", text: "SHA-256 est un choix courant pour les empreintes modernes. SHA-384 et SHA-512 produisent des empreintes plus longues. SHA-1 est conservé pour les cas de compatibilité et ne doit pas être choisi pour de nouveaux usages de sécurité." },
    { title: "Traitement local", text: "Le texte et les octets du fichier sont traités par l’API Web Crypto de votre navigateur. Aucun contenu n’est téléversé ni envoyé à Loculary ou à un service externe." },
  ] },
  en: { sections: [
    { title: "Hash text or a file", text: "Choose text or file mode, then calculate a SHA-1, SHA-256, SHA-384, or SHA-512 digest directly in your browser. Files up to 100 MiB are supported." },
    { title: "Verify a download", text: "Optionally paste the digest published by the official source. A match confirms that the selected file produces the same digest; a mismatch means the bytes differ. This comparison does not prove that the source publishing the digest is trustworthy." },
    { title: "Choose an algorithm", text: "SHA-256 is a common choice for modern digests. SHA-384 and SHA-512 produce longer digests. SHA-1 is kept for compatibility and should not be chosen for new security uses." },
    { title: "Local processing", text: "Your text and file bytes are processed by your browser’s Web Crypto API. No content is uploaded or sent to Loculary or an external service." },
  ] },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
