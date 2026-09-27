import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    percentageTitle: "🧮 Comment calculer un pourcentage ?",
    percentage: "Un pourcentage permet d'exprimer une proportion par rapport à 100. Pour calculer un pourcentage d'une valeur, il suffit de multiplier cette valeur par le pourcentage puis de diviser le résultat par 100.",
    formula: "Formule",
    percentageExample: "Par exemple, pour calculer 20 % de 150 :",
    percentageResult: "20 % de 150 correspondent donc à 30.",
    evolutionTitle: "📈 Calculer une augmentation ou une diminution en pourcentage",
    evolution: "Pour mesurer l'évolution d'une valeur, on compare sa nouvelle valeur à sa valeur de départ. Le résultat indique le pourcentage d'augmentation ou de diminution.",
    evolutionExample: "Par exemple, si un prix passe de 100 € à 120 €, son évolution est de :",
    evolutionResult: "Le prix a donc augmenté de 20 %.",
    comparisonTitle: "↔️ Évolution ou différence en pourcentage ?",
    comparisonIntro: "Les deux calculs comparent deux valeurs, mais ils ne répondent pas à la même question.",
    changeTitle: "📈 Évolution en pourcentage",
    change: "L'évolution utilise une valeur de départ comme référence. Elle permet de mesurer une augmentation ou une diminution entre deux moments ou deux états.",
    differenceTitle: "↔️ Différence en pourcentage",
    difference: "La différence en pourcentage compare deux valeurs sans privilégier une valeur de départ comme référence.",
  },
  en: {
    percentageTitle: "🧮 How do you calculate a percentage?",
    percentage: "A percentage expresses a proportion out of 100. To calculate a percentage of a value, multiply the value by the percentage and divide the result by 100.",
    formula: "Formula",
    percentageExample: "For example, to calculate 20% of 150:",
    percentageResult: "20% of 150 is therefore 30.",
    evolutionTitle: "📈 Calculate a percentage increase or decrease",
    evolution: "To measure how a value changes, compare its new value with its starting value. The result gives the percentage increase or decrease.",
    evolutionExample: "For example, if a price goes from €100 to €120, its change is:",
    evolutionResult: "The price therefore increased by 20%.",
    comparisonTitle: "↔️ Percentage change or percentage difference?",
    comparisonIntro: "Both calculations compare two values, but they answer different questions.",
    changeTitle: "📈 Percentage change",
    change: "Percentage change uses a starting value as its reference. It measures an increase or decrease between two points in time or two states.",
    differenceTitle: "↔️ Percentage difference",
    difference: "Percentage difference compares two values without choosing either one as the starting reference.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.percentageTitle}>
        <p>{t.percentage}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.formula}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">value × percentage ÷ 100</p>
        </Formula>
        <p className="mt-5">{t.percentageExample}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">150 × 20 ÷ 100 = 30</p>
          <p className="mt-2 text-sm">{t.percentageResult}</p>
        </Card>
      </ToolSection>
      <ToolSection title={t.evolutionTitle}>
        <p>{t.evolution}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.formula}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">(new value − starting value) ÷ starting value × 100</p>
        </Formula>
        <p className="mt-5">{t.evolutionExample}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">(120 − 100) ÷ 100 × 100 = +20 %</p>
          <p className="mt-2 text-sm">{t.evolutionResult}</p>
        </Card>
      </ToolSection>
      <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
          <span>{t.comparisonTitle}</span>
          <span className="shrink-0 text-xl text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-5 sm:px-6">
          <p>{t.comparisonIntro}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-semibold text-[var(--foreground)]">{t.changeTitle}</h3>
              <p className="mt-3">{t.change}</p>
              <div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="font-mono text-sm text-[var(--foreground)]">(120 − 100) ÷ 100 × 100 = 20 %</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-semibold text-[var(--foreground)]">{t.differenceTitle}</h3>
              <p className="mt-3">{t.difference}</p>
              <div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="font-mono text-sm text-[var(--foreground)]">|120 − 100| ÷ ((120 + 100) ÷ 2) × 100 ≈ 18.18 %</p>
              </div>
            </div>
          </div>
        </div>
      </details>
      <BackToTools locale={locale} />
    </>
  );
}
