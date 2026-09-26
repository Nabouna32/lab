import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "💶 Comment calculer la TVA ?" : "💶 How do you calculate VAT?"}>
            <p>{fr ? <>Pour passer d&apos;un prix HT à un prix TTC, on ajoute la TVA au prix hors taxes. Pour retrouver le prix HT à partir d&apos;un prix TTC, on retire la TVA en divisant par 1 + le taux de TVA.</> : <>To convert a net price to a gross price, add VAT to the net amount. To find the net price from a gross price, divide by 1 + the VAT rate.</>}</p>
            <Formula>
              <p className="font-semibold text-[var(--foreground)]">{fr ? "Formules" : "Formulas"}</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">Gross = Net × (1 + rate ÷ 100)</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">Net = Gross ÷ (1 + rate ÷ 100)</p>
            </Formula>
            <p className="mt-5">{fr ? "Par exemple, avec 100 € HT et une TVA de 20 % :" : "For example, with €100 net and 20% VAT:"}</p>
            <Card>
              <p className="font-semibold text-[var(--foreground)]">100 × 1.20 = 120 €</p>
              <p className="mt-2 text-sm">{fr ? <>La TVA est donc de <strong>20 €</strong> et le prix toutes taxes comprises est de <strong>120 €</strong>.</> : <>VAT is therefore <strong>€20</strong> and the gross price is <strong>€120</strong>.</>}</p>
            </Card>
          </ToolSection>
          <ToolSection title={fr ? "💡 HT, TTC et TVA" : "💡 Net, gross, and VAT"}>
            <p>{fr ? <>Le prix <strong>HT</strong> correspond au prix hors taxes. La <strong>TVA</strong> est la taxe ajoutée selon un taux donné. Le prix <strong>TTC</strong> correspond au prix payé après ajout de cette taxe.</> : <>The <strong>net</strong> price is the amount before tax. <strong>VAT</strong> is the tax added at a given rate. The <strong>gross</strong> price is the amount paid after adding that tax.</>}</p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );
}
