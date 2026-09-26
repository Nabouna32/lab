import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "⚖️ Comment fonctionne la règle de trois ?" : "⚖️ How does the rule of three work?"}>
            <p>{fr ? <>La règle de trois permet de trouver une valeur inconnue lorsque deux grandeurs sont proportionnelles. Si A correspond à B et C correspond à X, alors X se calcule ainsi :</> : <>The rule of three finds an unknown value when two quantities are proportional. If A corresponds to B and C corresponds to X, then X is calculated as follows:</>}</p>
            <Formula>
              <p className="font-semibold text-[var(--foreground)]">{fr ? "Formule" : "Formula"}</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">X = B × C ÷ A</p>
            </Formula>
            <p className="mt-5">{fr ? "Par exemple, si 4 articles coûtent 10 €, alors 6 articles coûtent 15 € lorsque le prix unitaire reste proportionnel." : "For example, if 4 items cost €10, then 6 items cost €15 when the unit price remains proportional."}</p>
            <Card>
              <p className="font-semibold text-[var(--foreground)]">10 × 6 ÷ 4 = 15</p>
              <p className="mt-2 text-sm">{fr ? <>Le résultat est donc de <strong>15 €</strong>.</> : <>The result is therefore <strong>€15</strong>.</>}</p>
            </Card>
          </ToolSection>
          <ToolSection title={fr ? "💡 Quand utiliser une règle de trois ?" : "💡 When should you use the rule of three?"}>
            <p>{fr ? "Elle est utile pour les conversions proportionnelles, les prix, les quantités, les recettes, les distances ou tout autre calcul où le rapport entre deux grandeurs reste constant." : "It is useful for proportional conversions involving prices, quantities, recipes, distances, or any other calculation where the ratio between two quantities remains constant."}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );;
}
