import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "💾 Comment convertir une taille de fichier ?" : "💾 How do you convert a file size?"}>
            <p>{fr ? "Saisissez une valeur, choisissez son unité de départ puis l’unité dans laquelle vous souhaitez obtenir le résultat. Le convertisseur utilise des multiples binaires : 1 Ko correspond à 1 024 octets, 1 Mo à 1 024 Ko et ainsi de suite." : "Enter a value, choose its starting unit, then choose the unit for the result. The converter uses binary multiples: 1 KB equals 1,024 bytes, 1 MB equals 1,024 KB, and so on."}</p>
          </ToolSection>
          <ToolSection title={fr ? "💡 Quand utiliser ce convertisseur ?" : "💡 When should you use this converter?"}>
            <p>{fr ? "Il est pratique pour comparer la taille d’un fichier, vérifier l’espace disponible sur un stockage ou comprendre les limites et capacités exprimées dans différentes unités." : "It is useful for comparing file sizes, checking available storage space, or understanding limits and capacities expressed in different units."}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );;
}
