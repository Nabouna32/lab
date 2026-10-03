import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    intro: {
      title: "Comprendre le contraste",
      text: "Le ratio de contraste compare la luminance relative d’un texte et de son arrière-plan. Les seuils affichés suivent les critères WCAG couramment utilisés pour vérifier la lisibilité.",
    },
    levels: {
      title: "Seuils WCAG",
      text: "Pour le texte courant, le niveau AA demande un ratio d’au moins 4,5:1 et le niveau AAA 7:1. Pour le grand texte, les seuils sont respectivement 3:1 et 4,5:1.",
    },
  },
  en: {
    intro: {
      title: "Understand contrast",
      text: "Contrast ratio compares the relative luminance of foreground and background colors. The thresholds shown follow the commonly used WCAG criteria for checking text readability.",
    },
    levels: {
      title: "WCAG thresholds",
      text: "For normal text, AA requires a ratio of at least 4.5:1 and AAA 7:1. For large text, the thresholds are 3:1 and 4.5:1 respectively.",
    },
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.intro.title}><p>{t.intro.text}</p></ToolSection>
      <ToolSection title={t.levels.title} collapsible><p>{t.levels.text}</p></ToolSection>
    </>
  );
}
