import type { Locale } from "@/lib/i18n/config";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = getToolMessages(locale).htmlPreviewer;
  const fr = locale === "fr";

  return (
    <>
      <ToolSection title={fr ? "Prévisualiser du HTML sans l'envoyer" : "Preview HTML without uploading it"}>
        <p>
          {fr
            ? "Saisissez un fragment ou une page HTML pour voir immédiatement son rendu dans un aperçu isolé."
            : "Enter an HTML fragment or page to see its rendered result immediately in an isolated preview."}
        </p>
        <Card>
          <p className="font-mono text-sm leading-6 text-[var(--foreground)]">
            {String.raw\`<h1>Bonjour</h1>\`}
          </p>
          <p className="mt-3 text-sm leading-6">
            {t.security}
          </p>
        </Card>
      </ToolSection>

      <ToolSection title={fr ? "Une prévisualisation isolée" : "An isolated preview"} collapsible>
        <p>
          {fr
            ? "L’aperçu est rendu dans une iframe sandboxée sans exécution de JavaScript ni accès au même domaine que Loculary. Une politique de sécurité limite aussi les ressources externes."
            : "The preview is rendered in a sandboxed iframe without JavaScript execution or same-origin access to Loculary. A content security policy also limits external resources."}
        </p>
      </ToolSection>
    </>
  );
}
