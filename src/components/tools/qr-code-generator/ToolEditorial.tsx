import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Créer un QR Code", text: "Saisissez une URL ou un texte, ou choisissez le mode Wi-Fi pour permettre à vos invités de rejoindre votre réseau sans recopier le mot de passe. La génération se fait directement dans votre navigateur." },
      { title: "Télécharger le résultat", text: "Choisissez la taille souhaitée puis téléchargez le QR Code au format SVG. Le fichier contient uniquement le code généré et peut être utilisé dans un navigateur ou un document." },
      { title: "Traitement local", text: "Le contenu saisi reste dans votre navigateur. Loculary n’envoie pas le texte ou l’URL à un service de génération distant." },
    ],
  },
  en: {
    sections: [
      { title: "Create a QR Code", text: "Enter a URL or text, or switch to Wi-Fi mode to create a code that lets guests join your network without typing the password. Generation happens directly in your browser." },
      { title: "Download the result", text: "Choose the desired size and download the QR Code as an SVG image. The file contains only the generated code and can be used in a browser or document." },
      { title: "Local processing", text: "The content you enter stays in your browser. Loculary does not send the text or URL to a remote generation service." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>)}</>;
}
