import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  return (
    <>
      <ToolSection title={fr ? "Une comparaison structurelle" : "A structural comparison"}>
        <p>
          {fr
            ? "Le comparateur analyse les valeurs plutôt que les caractères. Les espaces et l’ordre des clés d’un objet ne créent pas de différence ; les valeurs ajoutées, supprimées ou modifiées sont affichées avec leur chemin."
            : "The checker compares values rather than characters. Whitespace and object key order do not count as changes; added, removed, and changed values are shown with their paths."}
        </p>
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-container-low)] p-4">
          <p className="font-mono text-sm leading-6 text-[var(--foreground)]">
            {"{\"status\":\"draft\"}"} → {"{\"status\":\"published\"}"}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {fr ? 'Le résultat identifie le changement à $["status"].' : 'The result identifies the change at $["status"].'}
          </p>
        </div>
      </ToolSection>
      <ToolSection title={fr ? "Objets et tableaux" : "Objects and arrays"} collapsible>
        <p>
          {fr
            ? "Les objets sont comparés par nom de clé. Les tableaux restent ordonnés et sont comparés élément par élément ; déplacer un élément peut donc produire plusieurs différences."
            : "Objects are compared by key name. Arrays remain ordered and are compared item by item, so moving an item may produce multiple differences."}
        </p>
        <p className="text-sm text-[var(--muted)]">
          {fr
            ? "Les documents sont analysés localement. Pour limiter le coût de calcul, chaque entrée est plafonnée à 200 000 caractères et le rapport à 500 différences."
            : "Documents are parsed locally. To bound computation, each input is limited to 200,000 characters and reports to 500 differences."}
        </p>
      </ToolSection>
    </>
  );
}
