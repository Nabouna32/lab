import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "🏷️ Comment calculer une réduction ?" : "🏷️ How do you calculate a discount?"}>
            <p>{fr ? "Pour calculer une réduction, on commence par déterminer le montant de la remise, puis on le soustrait au prix initial." : "To calculate a discount, first determine the discount amount, then subtract it from the original price."}</p>
            <Formula>
              <p className="font-semibold text-[var(--foreground)]">{fr ? "Formules" : "Formulas"}</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">discount = price × percentage ÷ 100</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">final price = price − discount</p>
            </Formula>
            <p className="mt-5">{fr ? "Par exemple, pour un article à 150 € avec 20 % de réduction :" : "For example, for an item costing €150 with a 20% discount:"}</p>
            <Card>
              <p className="font-semibold text-[var(--foreground)]">150 × 20 ÷ 100 = 30 €</p>
              <p className="mt-2 text-sm">{fr ? <>La remise est donc de <strong>30 €</strong>, et le prix après réduction est de <strong>120 €</strong>.</> : <>The discount is <strong>€30</strong>, so the price after the discount is <strong>€120</strong>.</>}</p>
            </Card>
          </ToolSection>
          <ToolSection title={fr ? "💡 Réduction et prix final" : "💡 Discount and final price"}>
            <p>{fr ? <>Une réduction de 20 % ne signifie pas que le prix final représente 20 % du prix initial. Elle signifie que 20 % du prix initial sont retirés. Le prix final représente donc 80 % du prix de départ.</> : <>A 20% discount does not mean that the final price is 20% of the original price. It means that 20% of the original price is removed. The final price therefore represents 80% of the starting price.</>}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );;
}
