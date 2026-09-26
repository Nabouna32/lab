import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "🧮 Comment calculer un pourcentage ?" : "🧮 How do you calculate a percentage?"}>
            <p>
              {fr
                ? "Un pourcentage permet d'exprimer une proportion par rapport à 100. Pour calculer un pourcentage d'une valeur, il suffit de multiplier cette valeur par le pourcentage puis de diviser le résultat par 100."
                : "A percentage expresses a proportion out of 100. To calculate a percentage of a value, multiply the value by the percentage and divide the result by 100."}
            </p>
            <Formula>
              <p className="font-semibold text-[var(--foreground)]">{fr ? "Formule" : "Formula"}</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">value × percentage ÷ 100</p>
            </Formula>
            <p className="mt-5">{fr ? "Par exemple, pour calculer 20 % de 150 :" : "For example, to calculate 20% of 150:"}</p>
            <Card>
              <p className="font-semibold text-[var(--foreground)]">150 × 20 ÷ 100 = 30</p>
              <p className="mt-2 text-sm">
                {fr ? <>20 % de 150 correspondent donc à <strong>30</strong>.</> : <>20% of 150 is therefore <strong>30</strong>.</>}
              </p>
            </Card>
          </ToolSection>
          <ToolSection title={fr ? "📈 Calculer une augmentation ou une diminution en pourcentage" : "📈 Calculate a percentage increase or decrease"}>
            <p>
              {fr
                ? "Pour mesurer l'évolution d'une valeur, on compare sa nouvelle valeur à sa valeur de départ. Le résultat indique le pourcentage d'augmentation ou de diminution."
                : "To measure how a value changes, compare its new value with its starting value. The result gives the percentage increase or decrease."}
            </p>
            <Formula>
              <p className="font-semibold text-[var(--foreground)]">{fr ? "Formule" : "Formula"}</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">
                (new value − starting value) ÷ starting value × 100
              </p>
            </Formula>
            <p className="mt-5">
              {fr ? "Par exemple, si un prix passe de 100 € à 120 €, son évolution est de :" : "For example, if a price goes from €100 to €120, its change is:"}
            </p>
            <Card>
              <p className="font-semibold text-[var(--foreground)]">(120 − 100) ÷ 100 × 100 = +20 %</p>
              <p className="mt-2 text-sm">
                {fr ? <>Le prix a donc augmenté de <strong>20 %</strong>.</> : <>The price therefore increased by <strong>20%</strong>.</>}
              </p>
            </Card>
          </ToolSection>
          <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              <span>{fr ? "↔️ Évolution ou différence en pourcentage ?" : "↔️ Percentage change or percentage difference?"}</span>
              <span className="shrink-0 text-xl text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="border-t border-[var(--border)] px-5 pb-5 pt-5 sm:px-6">
              <p>
                {fr
                  ? "Les deux calculs comparent deux valeurs, mais ils ne répondent pas à la même question."
                  : "Both calculations compare two values, but they answer different questions."}
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <h3 className="font-semibold text-[var(--foreground)]">{fr ? "📈 Évolution en pourcentage" : "📈 Percentage change"}</h3>
                  <p className="mt-3">
                    {fr
                      ? "L'évolution utilise une valeur de départ comme référence. Elle permet de mesurer une augmentation ou une diminution entre deux moments ou deux états."
                      : "Percentage change uses a starting value as its reference. It measures an increase or decrease between two points in time or two states."}
                  </p>
                  <div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4">
                    <p className="font-mono text-sm text-[var(--foreground)]">(120 − 100) ÷ 100 × 100 = 20 %</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <h3 className="font-semibold text-[var(--foreground)]">{fr ? "↔️ Différence en pourcentage" : "↔️ Percentage difference"}</h3>
                  <p className="mt-3">
                    {fr
                      ? "La différence en pourcentage compare deux valeurs sans privilégier une valeur de départ comme référence."
                      : "Percentage difference compares two values without choosing either one as the starting reference."}
                  </p>
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
