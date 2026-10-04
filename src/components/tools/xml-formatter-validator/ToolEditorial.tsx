import type { Locale } from "@/lib/i18n/config";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = getToolMessages(locale).xmlFormatterValidator;
  const fr = locale === "fr";

  return (
    <>
      <ToolSection title={fr ? "Que vérifie ce validateur ?" : "What does this validator check?"}>
        <p>
          {fr
            ? "Le navigateur analyse votre XML et vérifie qu’il est bien formé avant le formatage. Le traitement reste entièrement local."
            : "Your browser parses the XML and checks that it is well-formed before formatting it. Processing stays entirely local."}
        </p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.valid}</p>
          <p className="mt-2 text-sm">
            {fr
              ? "La validation porte sur la syntaxe XML. Elle ne vérifie pas la conformité à un schéma XSD ou à une DTD."
              : "Validation covers XML syntax and well-formedness. It does not validate against an XSD schema or DTD."}
          </p>
        </Formula>
      </ToolSection>

      <ToolSection title={fr ? "Pourquoi formater du XML ?" : "Why format XML?"} collapsible>
        <p>
          {fr
            ? "L’indentation rend les éléments, attributs et niveaux d’imbrication plus faciles à lire et à vérifier."
            : "Indentation makes elements, attributes, and nesting levels easier to read and inspect."}
        </p>
        <Card>
          <p className="font-mono text-sm leading-6 text-[var(--foreground)]">
            {"<catalog><item id=\"1\">Loculary</item></catalog>"}
          </p>
        </Card>
      </ToolSection>
    </>
  );
}
