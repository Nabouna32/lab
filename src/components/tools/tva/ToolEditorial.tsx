import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    main: { title: "Calculer la TVA", text: "Pour passer d'un prix HT à un prix TTC, on ajoute la TVA au prix hors taxes. Pour retrouver le prix HT à partir d'un prix TTC, on retire la TVA en divisant par 1 + le taux de TVA.", formulas: "Formules", example: "Par exemple, avec 100 € HT et une TVA de 20 % :", result: "La TVA est donc de 20 € et le prix toutes taxes comprises est de 120 €." },
    definitions: { title: "Comprendre HT, TTC et TVA", text: "Le prix HT correspond au prix hors taxes. La TVA est la taxe ajoutée selon un taux donné. Le prix TTC correspond au prix payé après ajout de cette taxe." },
  },
  en: {
    main: { title: "Calculate VAT", text: "To convert a net price to a gross price, add VAT to the net amount. To find the net price from a gross price, divide by 1 + the VAT rate.", formulas: "Formulas", example: "For example, with €100 net and 20% VAT:", result: "VAT is therefore €20 and the gross price is €120." },
    definitions: { title: "Understanding net, gross, and VAT", text: "The net price is the amount before tax. VAT is the tax added at a given rate. The gross price is the amount paid after adding that tax." },
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.main.title}>
        <p>{t.main.text}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.main.formulas}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">Gross = Net × (1 + rate ÷ 100)</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">Net = Gross ÷ (1 + rate ÷ 100)</p>
        </Formula>
        <p className="mt-5">{t.main.example}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">100 × 1.20 = 120 €</p>
          <p className="mt-2 text-sm">{t.main.result}</p>
        </Card>
      </ToolSection>
      <ToolSection title={t.definitions.title} collapsible>
        <p>{t.definitions.text}</p>
      </ToolSection>
    </>
  );
}
