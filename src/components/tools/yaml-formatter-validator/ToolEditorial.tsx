import type { Locale } from "@/lib/i18n/config";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = getToolMessages(locale).yamlFormatterValidator;
  const fr = locale === "fr";

  return (
    <>
      <ToolSection title={fr ? "Pourquoi valider du YAML ?" : "Why validate YAML?"}>
        <p>
          {fr
            ? "Une validation permet de repérer une structure YAML invalide avant de l'utiliser dans une configuration, un manifeste ou un autre fichier de données."
            : "Validation catches malformed YAML before you use it in a configuration, manifest, or other data file."}
        </p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.valid}</p>
          <p className="mt-2 text-sm">
            {fr
              ? "Le document est analysé localement dans votre navigateur. Aucun contenu n'est envoyé à un serveur."
              : "The document is parsed locally in your browser. No content is sent to a server."}
          </p>
        </Formula>
      </ToolSection>

      <ToolSection
        title={fr ? "Les commentaires sont-ils conservés ?" : "Are comments preserved?"}
        collapsible
      >
        <p>
          {fr
            ? "Oui. Le formateur travaille sur le document YAML plutôt que de le convertir en JSON, ce qui permet de conserver les commentaires et les lignes vides lors du formatage."
            : "Yes. The formatter works on the YAML document instead of converting it through JSON, so comments and blank lines can be preserved while formatting."}
        </p>
        <Card>
          <p className="font-mono text-sm leading-6 text-[var(--foreground)]">
            {"# Configuration\nname: Loculary\ntools:\n  - JSON\n  - YAML"}
          </p>
        </Card>
      </ToolSection>
    </>
  );
}
