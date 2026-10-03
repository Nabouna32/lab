import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Générer un mot de passe", text: "Choisissez la longueur et les types de caractères souhaités, puis générez un mot de passe aléatoire avec le générateur cryptographique de votre navigateur." },
      { title: "Choisir les caractères", text: "Vous pouvez mélanger minuscules, majuscules, chiffres et symboles. L’option d’exclusion des caractères ambigus évite notamment certaines confusions visuelles comme O/0 et I/l/1." },
      { title: "Traitement local", text: "La génération se fait entièrement dans votre navigateur avec l’API Web Crypto. Le mot de passe généré n’est ni envoyé à Loculary ni stocké par Loculary." },
    ],
  },
  en: {
    sections: [
      { title: "Generate a password", text: "Choose the length and character types you want, then generate a random password using your browser's cryptographic random generator." },
      { title: "Choose characters", text: "Mix lowercase, uppercase, numbers, and symbols. The ambiguous-character option avoids visually confusing characters such as O/0 and I/l/1." },
      { title: "Local processing", text: "Generation happens entirely in your browser using the Web Crypto API. The generated password is not sent to or stored by Loculary." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
