import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    title: "📐 Comment convertir un débit Internet ?",
    intro: "Saisissez une vitesse, choisissez son unité de départ puis l’unité souhaitée. Les conversions utilisent les unités décimales : 1 Mbps = 1 000 000 bits/s et 1 Mo/s = 1 000 000 octets/s. Comme 1 octet vaut 8 bits, 100 Mbps correspondent à 12,5 Mo/s.",
    whyTitle: "💡 Pourquoi convertir Mbps en Mo/s ?",
    why: "Les fournisseurs d’accès indiquent généralement les débits en mégabits par seconde (Mbps), tandis que les logiciels de téléchargement affichent souvent les vitesses en mégaoctets par seconde (Mo/s). Cette conversion permet de comparer les deux valeurs plus facilement.",
  },
  en: {
    title: "📐 How do you convert an Internet speed?",
    intro: "Enter a speed, choose its starting unit, then choose the desired unit. Conversions use decimal units: 1 Mbps = 1,000,000 bits/s and 1 MB/s = 1,000,000 bytes/s. Since 1 byte equals 8 bits, 100 Mbps equals 12.5 MB/s.",
    whyTitle: "💡 Why convert Mbps to MB/s?",
    why: "Internet providers usually report speeds in megabits per second (Mbps), while download software often displays speeds in megabytes per second (MB/s). This conversion makes the two values easier to compare.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.title}><p>{t.intro}</p></ToolSection>
      <ToolSection title={t.whyTitle}><p>{t.why}</p></ToolSection>
      <BackToTools locale={locale} />
    </>
  );
}
