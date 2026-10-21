import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  return (
    <>
      <ToolSection title={fr ? "Comparer des exports, pas seulement des lignes" : "Compare exports, not just lines"}>
        <p>{fr
          ? "Collez deux exports CSV pour repérer les enregistrements ajoutés, supprimés ou modifiés. Choisissez une colonne commune (par exemple un identifiant) pour reconnaître les mêmes enregistrements même si leur ordre change."
          : "Paste two CSV exports to find added, removed, and changed records. Choose a shared column (such as an ID) to match the same records even when their order changes."}</p>
      </ToolSection>
      <ToolSection title={fr ? "Traitement local et limites" : "Local processing and limits"} collapsible>
        <p>{fr
          ? "Les données restent dans votre navigateur. Les fichiers CSV sont limités à 200 000 caractères et 10 000 lignes par entrée ; le rapport affiche au maximum 500 différences."
          : "Your data stays in your browser. Each CSV input is limited to 200,000 characters and 10,000 rows; the report displays at most 500 differences."}</p>
      </ToolSection>
    </>
  );
}
