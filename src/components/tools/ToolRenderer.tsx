"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const toolComponents: Record<string, ComponentType> = {
  pourcentage: dynamic(() => import("@/components/tools/percentage/PercentageCalculator")),
  reduction: dynamic(() => import("@/components/tools/reduction/ReductionCalculator")),
  tva: dynamic(() => import("@/components/tools/tva/TVACalculator")),
  "regle-de-trois": dynamic(() => import("@/components/tools/regle-de-trois/RuleOfThreeCalculator")),
  age: dynamic(() => import("@/components/tools/age/AgeCalculator")),
  duree: dynamic(() => import("@/components/tools/duree/DurationCalculator")),
  "vitesse-telechargement": dynamic(() => import("@/components/tools/vitesse-telechargement/DownloadSpeedConverter")),
  "temps-telechargement": dynamic(() => import("@/components/tools/temps-telechargement/DownloadTimeCalculator")),
  "taille-fichier": dynamic(() => import("@/components/tools/taille-fichier/FileSizeCalculator")),
  "convertisseur-taille": dynamic(() => import("@/components/tools/convertisseur-taille/FileSizeConverter")),
  "mots-caracteres": dynamic(() => import("@/components/tools/text-counter/TextCounter")),
};

export default function ToolRenderer({ toolId }: { toolId: string }) {
  const ToolComponent = toolComponents[toolId];

  if (!ToolComponent) {
    throw new Error(`Published tool "${toolId}" has no client implementation.`);
  }

  return <ToolComponent />;
}
