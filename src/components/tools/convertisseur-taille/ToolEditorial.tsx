import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "💾 Comment convertir une taille de fichier ?" : "💾 How do you convert a file size?"}>
            <p>{fr ? "Saisissez une valeur, choisissez son unité de départ puis l’unité dans laquelle vous souhaitez obtenir le résultat. Le convertisseur distingue les deux conventions : les unités décimales utilisent 1 000 octets par kilo-octet (1 ko = 1 000 o), tandis que les unités binaires utilisent 1 024 octets par kibioctet (1 Kio = 1 024 o)." : "Enter a value, choose its starting unit, then choose the unit for the result. The converter distinguishes the two conventions: decimal units use 1,000 bytes per kilobyte (1 kB = 1,000 B), while binary units use 1,024 bytes per kibibyte (1 KiB = 1,024 B)."}</p>
          </ToolSection>
          <ToolSection title={fr ? "💡 Quand utiliser ce convertisseur ?" : "💡 When should you use this converter?"}>
            <p>{fr ? "Il est pratique pour comparer la taille d’un fichier, vérifier l’espace disponible sur un stockage ou comprendre les limites et capacités exprimées dans différentes unités." : "It is useful for comparing file sizes, checking available storage space, or understanding limits and capacities expressed in different units."}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );
}
