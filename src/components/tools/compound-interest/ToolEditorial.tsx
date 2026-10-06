import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    title: "Comment fonctionnent les intérêts composés ?",
    text: "Le capital évolue à chaque période de capitalisation. Les versements réguliers sont considérés comme effectués en fin de période.",
    formula: "A = P × (1 + r / n)^(n × t)",
    contribution: "Les versements réguliers sont capitalisés séparément puis ajoutés au capital final.",
    example: "Exemple : 1 000 € à 5 % par an pendant 10 ans, avec une capitalisation mensuelle et sans versement supplémentaire.",
    result: "Le capital final est d’environ 1 647,01 €.",
  },
  en: {
    title: "How does compound interest work?",
    text: "The balance grows at each compounding period. Regular contributions are treated as being made at the end of each period.",
    formula: "A = P × (1 + r / n)^(n × t)",
    contribution: "Regular contributions are compounded separately and added to the final balance.",
    example: "Example: €1,000 at 5% per year for 10 years, compounded monthly, with no additional contribution.",
    result: "The final balance is about €1,647.01.",
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <ToolSection title={t.title}>
      <p>{t.text}</p>
      <Formula>
        <p className="font-mono text-sm text-[var(--foreground)]">{t.formula}</p>
        <p className="mt-2 text-sm">{t.contribution}</p>
      </Formula>
      <Card>
        <p className="font-semibold text-[var(--foreground)]">{t.example}</p>
        <p className="mt-2 text-sm">{t.result}</p>
      </Card>
    </ToolSection>
  );
}
