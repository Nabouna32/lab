import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { Card, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

const content = {
  fr: {
    intro: {
      title: "Comprendre le bitrate vidéo",
      text: "Le bitrate indique la quantité de données utilisée chaque seconde pour représenter une vidéo. À durée égale, un bitrate plus élevé produit généralement un fichier plus volumineux, mais la qualité dépend aussi du codec, de la résolution et des paramètres d’encodage.",
      formula: "Taille du fichier = bitrate × durée ÷ 8",
    },
    target: {
      title: "Trouver un bitrate à partir d’une taille cible",
      text: "Indiquez la durée de la vidéo et la taille de fichier souhaitée. L’outil calcule le débit total moyen nécessaire pour atteindre cette taille.",
      note: "Le résultat correspond au bitrate total moyen. Si vous connaissez le bitrate audio, soustrayez-le pour obtenir une estimation du bitrate vidéo.",
    },
    estimate: {
      title: "Estimer la taille à partir d’un bitrate",
      text: "Indiquez la durée et le bitrate total moyen. L’outil estime alors la taille théorique du fichier, sans tenir compte des variations réelles du débit pendant l’encodage.",
    },
  },
  en: {
    intro: {
      title: "Understand video bitrate",
      text: "Bitrate is the amount of data used each second to represent a video. At the same duration, a higher bitrate generally produces a larger file, but quality also depends on the codec, resolution, and encoding settings.",
      formula: "File size = bitrate × duration ÷ 8",
    },
    target: {
      title: "Find a bitrate from a target size",
      text: "Enter the video duration and desired file size. The tool calculates the average total bitrate needed to reach that size.",
      note: "The result is the average total bitrate. If you know the audio bitrate, subtract it to estimate the video bitrate.",
    },
    estimate: {
      title: "Estimate file size from a bitrate",
      text: "Enter the duration and average total bitrate. The tool estimates the theoretical file size without accounting for real-world bitrate variation during encoding.",
    },
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <>
      <ToolSection title={t.intro.title}>
        <p>{t.intro.text}</p>
        <Formula><p className="font-mono text-sm text-[var(--foreground)]">{t.intro.formula}</p></Formula>
      </ToolSection>
      <ToolSection title={t.target.title} collapsible>
        <p>{t.target.text}</p>
        <Card><p className="text-sm">{t.target.note}</p></Card>
      </ToolSection>
      <ToolSection title={t.estimate.title} collapsible>
        <p>{t.estimate.text}</p>
      </ToolSection>
    </>
  );
}
