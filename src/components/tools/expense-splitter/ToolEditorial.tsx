import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    title: "Comment répartir les dépenses d’un groupe ?",
    text: "Ajoutez les personnes, puis chaque dépense et la personne qui l’a réglée. Loculary calcule la part égale de chacun et propose un plan simple de virements pour solder les comptes.",
    exampleTitle: "Exemple",
    example: "Si Alex paie 90 € et Sam paie 30 € pour trois personnes, les dépenses totalisent 120 €. Chacun supporte 40 € : Sam rembourse 10 € à Alex et la troisième personne lui rembourse 40 €.",
    privacyTitle: "Vos données restent sur votre appareil",
    privacy: "Les noms et les montants sont conservés uniquement dans l’état temporaire de la page. Ils ne sont pas envoyés à Loculary et disparaissent lorsque vous quittez ou rechargez la page.",
  },
  en: {
    title: "How do you split group expenses?",
    text: "Add the people, then each expense and who paid it. Loculary calculates everyone's equal share and consolidates reimbursements to reduce the number of transfers.",
    exampleTitle: "Example",
    example: "If Alex pays €90 and Sam pays €30 for three people, the total is €120. Each person's share is €40: Sam pays Alex €10 and the third person pays Alex €40.",
    privacyTitle: "Your data stays on your device",
    privacy: "Names and amounts stay only in the page's temporary state. They are not sent to Loculary and disappear when you leave or reload the page.",
  },
};

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <div className="space-y-5">
      <ToolSection title={t.title}>
        <p>{t.text}</p>
        <Card title={t.exampleTitle}><p>{t.example}</p></Card>
      </ToolSection>
      <ToolSection title={t.privacyTitle}>
        <p>{t.privacy}</p>
      </ToolSection>
    </div>
  );
}
