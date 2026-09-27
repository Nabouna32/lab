import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    title: "🏷️ Comment calculer une réduction ?",
    intro: "Pour calculer une réduction, on commence par déterminer le montant de la remise, puis on le soustrait au prix initial.",
    formulas: "Formules",
    example: "Par exemple, pour un article à 150 € avec 20 % de réduction :",
    exampleResult: "La remise est donc de 30 €, et le prix après réduction est de 120 €.",
    finalTitle: "💡 Réduction et prix final",
    final: "Une réduction de 20 % ne signifie pas que le prix final représente 20 % du prix initial. Elle signifie que 20 % du prix initial sont retirés. Le prix final représente donc 80 % du prix de départ.",
  },
  en: {
    title: "🏷️ How do you calculate a discount?",
    intro: "To calculate a discount, first determine the discount amount, then subtract it from the original price.",
    formulas: "Formulas",
    example: "For example, for an item costing €150 with a 20% discount:",
    exampleResult: "The discount is €30, so the price after the discount is €120.",
    finalTitle: "💡 Discount and final price",
    final: "A 20% discount does not mean that the final price is 20% of the original price. It means that 20% of the original price is removed. The final price therefore represents 80% of the starting price.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.title}>
        <p>{t.intro}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.formulas}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">discount = price × percentage ÷ 100</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">final price = price − discount</p>
        </Formula>
        <p className="mt-5">{t.example}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">150 × 20 ÷ 100 = 30 €</p>
          <p className="mt-2 text-sm">{t.exampleResult}</p>
        </Card>
      </ToolSection>
      <ToolSection title={t.finalTitle}><p>{t.final}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
