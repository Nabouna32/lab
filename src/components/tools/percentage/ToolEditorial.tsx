import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    first: { title: "Calculer un pourcentage", text: "Un pourcentage permet d'exprimer une proportion par rapport à 100. Pour calculer un pourcentage d'une valeur, il suffit de multiplier cette valeur par le pourcentage puis de diviser le résultat par 100.", formula: "Formule", example: "Par exemple, pour calculer 20 % de 150 :", result: "20 % de 150 correspondent donc à 30." },
    change: { title: "Mesurer une évolution en pourcentage", text: "Pour mesurer l'évolution d'une valeur, on compare sa nouvelle valeur à sa valeur de départ. Le résultat indique le pourcentage d'augmentation ou de diminution.", formula: "Formule", example: "Par exemple, si un prix passe de 100 € à 120 €, son évolution est de :", result: "Le prix a donc augmenté de 20 %." },
    difference: {
      title: "Évolution ou différence en pourcentage ?",
      intro: "Les deux calculs comparent deux valeurs, mais ils ne répondent pas à la même question.",
      changeTitle: "Évolution en pourcentage",
      changeText: "L'évolution utilise une valeur de départ comme référence. Elle permet de mesurer une augmentation ou une diminution entre deux moments ou deux états.",
      differenceTitle: "Différence en pourcentage",
      differenceText: "La différence en pourcentage compare deux valeurs sans privilégier une valeur de départ comme référence.",
    },
  },
  en: {
    first: { title: "Calculate a percentage", text: "A percentage expresses a proportion out of 100. To calculate a percentage of a value, multiply the value by the percentage and divide the result by 100.", formula: "Formula", example: "For example, to calculate 20% of 150:", result: "20% of 150 is therefore 30." },
    change: { title: "Measure percentage change", text: "To measure how a value changes, compare its new value with its starting value. The result gives the percentage increase or decrease.", formula: "Formula", example: "For example, if a price goes from €100 to €120, its change is:", result: "The price therefore increased by 20%." },
    difference: {
      title: "Percentage change or percentage difference?",
      intro: "Both calculations compare two values, but they answer different questions.",
      changeTitle: "Percentage change",
      changeText: "Percentage change uses a starting value as its reference. It measures an increase or decrease between two points in time or two states.",
      differenceTitle: "Percentage difference",
      differenceText: "Percentage difference compares two values without choosing either one as the starting reference.",
    },
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.first.title}>
        <p>{t.first.text}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.first.formula}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">value × percentage ÷ 100</p>
        </Formula>
        <p className="mt-5">{t.first.example}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">150 × 20 ÷ 100 = 30</p>
          <p className="mt-2 text-sm">{t.first.result}</p>
        </Card>
      </ToolSection>

      <ToolSection title={t.change.title} collapsible>
        <p>{t.change.text}</p>
        <Formula>
          <p className="font-semibold text-[var(--foreground)]">{t.change.formula}</p>
          <p className="mt-2 font-mono text-sm text-[var(--foreground)]">(new value − starting value) ÷ starting value × 100</p>
        </Formula>
        <p className="mt-5">{t.change.example}</p>
        <Card>
          <p className="font-semibold text-[var(--foreground)]">(120 − 100) ÷ 100 × 100 = +20 %</p>
          <p className="mt-2 text-sm">{t.change.result}</p>
        </Card>
      </ToolSection>

      <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
          <span>{t.difference.title}</span>
          <span className="shrink-0 text-xl text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-5 sm:px-6">
          <p>{t.difference.intro}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-semibold text-[var(--foreground)]">{t.difference.changeTitle}</h3>
              <p className="mt-3">{t.difference.changeText}</p>
              <div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="font-mono text-sm text-[var(--foreground)]">(120 − 100) ÷ 100 × 100 = 20 %</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-semibold text-[var(--foreground)]">{t.difference.differenceTitle}</h3>
              <p className="mt-3">{t.difference.differenceText}</p>
              <div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4">
                <p className="font-mono text-sm text-[var(--foreground)]">|120 − 100| ÷ ((120 + 100) ÷ 2) × 100 ≈ 18.18 %</p>
              </div>
            </div>
          </div>
        </div>
      </details>

    </>
  );
}
