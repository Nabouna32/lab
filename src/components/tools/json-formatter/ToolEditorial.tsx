import type { Locale } from "@/lib/i18n/config";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = getToolMessages(locale).jsonFormatter;
  const fr = locale === "fr";

  return (
    <>
      <ToolSection title={fr ? "Pourquoi valider un JSON ?" : "Why validate JSON?"}>
        <p>
          {fr
            ? "Un JSON valide respecte une syntaxe précise. Le validateur vérifie cette structure avant de produire une version lisible ou compacte."
            : "Valid JSON follows a precise syntax. The validator checks that structure before producing a readable or compact version."}
        </p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.valid}</p>
          <p className="mt-2 text-sm">
            {fr
              ? "Les objets, tableaux, chaînes, nombres, booléens et valeurs null sont vérifiés sans envoyer le contenu à un serveur."
              : "Objects, arrays, strings, numbers, booleans, and null values are checked without sending the content to a server."}
          </p>
        </Formula>
      </ToolSection>

      <ToolSection title={fr ? "Formater ou minifier ?" : "Format or minify?"} collapsible>
        <p>
          {fr
            ? "Le formatage ajoute une indentation pour faciliter la lecture. La minification retire les espaces inutiles pour obtenir une version plus compacte."
            : "Formatting adds indentation to make JSON easier to read. Minification removes unnecessary whitespace to produce a more compact version."}
        </p>
        <Card>
          <p className="font-mono text-sm leading-6 text-[var(--foreground)]">
            {String.raw`{ "name": "Loculary", "tools": ["JSON"] }`}
          </p>
        </Card>
      </ToolSection>
    </>
  );
}
