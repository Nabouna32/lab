import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "💾 Comment convertir une taille de fichier ?", text: "Saisissez une valeur, choisissez son unité de départ puis l’unité dans laquelle vous souhaitez obtenir le résultat. Le convertisseur distingue les deux conventions : les unités décimales utilisent 1 000 octets par kilo-octet (1 ko = 1 000 o), tandis que les unités binaires utilisent 1 024 octets par kibioctet (1 Kio = 1 024 o)." },
      { title: "💡 Quand utiliser ce convertisseur ?", text: "Il est pratique pour comparer la taille d’un fichier, vérifier l’espace disponible sur un stockage ou comprendre les limites et capacités exprimées dans différentes unités." },
    ],
  },
  en: {
    sections: [
      { title: "💾 How do you convert a file size?", text: "Enter a value, choose its starting unit, then choose the unit for the result. The converter distinguishes the two conventions: decimal units use 1,000 bytes per kilobyte (1 kB = 1,000 B), while binary units use 1,024 bytes per kibibyte (1 KiB = 1,024 B)." },
      { title: "💡 When should you use this converter?", text: "It is useful for comparing file sizes, checking available storage space, or understanding limits and capacities expressed in different units." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      {t.sections.map((section) => (
        <ToolSection key={section.title} title={section.title}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
    </>
  );
}
