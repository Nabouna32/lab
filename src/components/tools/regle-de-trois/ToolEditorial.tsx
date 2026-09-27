import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    main: { title: "⚖️ Comment fonctionne la règle de trois ?", text: "La règle de trois permet de trouver une valeur inconnue lorsque deux grandeurs sont proportionnelles. Si A correspond à B et C correspond à X, alors X se calcule ainsi :", formula: "Formule", example: "Par exemple, si 4 articles coûtent 10 €, alors 6 articles coûtent 15 € lorsque le prix unitaire reste proportionnel.", result: "Le résultat est donc de 15 €." },
    use: { title: "💡 Quand utiliser une règle de trois ?", text: "Elle est utile pour les conversions proportionnelles, les prix, les quantités, les recettes, les distances ou tout autre calcul où le rapport entre deux grandeurs reste constant." },
  },
  en: {
    main: { title: "⚖️ How does the rule of three work?", text: "The rule of three finds an unknown value when two quantities are proportional. If A corresponds to B and C corresponds to X, then X is calculated as follows:", formula: "Formula", example: "For example, if 4 items cost €10, then 6 items cost €15 when the unit price remains proportional.", result: "The result is therefore €15." },
    use: { title: "💡 When should you use the rule of three?", text: "It is useful for proportional conversions involving prices, quantities, recipes, distances, or any other calculation where the ratio between two quantities remains constant." },
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.main.title}>
        <p>{t.main.text}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.main.formula}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">X = B × C ÷ A</p>
        </Formula>
        <p className="mt-5">{t.main.example}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">10 × 6 ÷ 4 = 15</p>
          <p className="mt-2 text-sm">{t.main.result}</p>
        </Card>
      </ToolSection>
      <ToolSection title={t.use.title}>
        <p>{t.use.text}</p>
      </ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
