import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";
import { BackToTools, Formula } from "@/components/tools/ToolPage/EditorialPrimitives";

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const fr = locale === "fr";

  return (
        <>
          <ToolSection title={fr ? "💾 Comment estimer une taille de fichier ?" : "💾 How do you estimate a file size?"}>
            <p>
              {fr
                ? "Indiquez la durée du contenu et son débit binaire. Le calcul convertit la durée en secondes, multiplie par le débit et exprime le résultat dans l'unité de stockage choisie."
                : "Enter the content duration and its bitrate. The calculation converts the duration to seconds, multiplies it by the bitrate, and expresses the result in the selected storage unit."}
            </p>
            <Formula>
              <p className="font-semibold text-[var(--foreground)]">{fr ? "Principe" : "Principle"}</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">file size = duration × bitrate ÷ 8</p>
            </Formula>
          </ToolSection>
          <ToolSection title={fr ? "💡 Exemple" : "💡 Example"}>
            <p>
              {fr
                ? "Pour 10 minutes à 8 Mbit/s, la taille théorique est d'environ 600 Mo. Le résultat est une estimation : un fichier réel peut contenir des données supplémentaires ou utiliser une compression variable."
                : "For 10 minutes at 8 Mbps, the theoretical size is about 600 MB. This is an estimate: a real file may contain additional data or use variable compression."}
            </p>
          </ToolSection>
          <BackToTools locale={locale} />
        </>
      );
}
