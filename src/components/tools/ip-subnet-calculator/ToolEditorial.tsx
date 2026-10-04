import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      {
        title: "Lire un réseau IPv4 en notation CIDR",
        text: "Saisissez une adresse IPv4 suivie d’un préfixe, par exemple 192.168.1.42/24. Loculary calcule le réseau auquel appartient l’adresse, son masque et sa plage d’adresses.",
      },
      {
        title: "Comprendre les adresses calculées",
        text: "L’adresse réseau identifie le sous-réseau et l’adresse de broadcast en marque la limite. Pour les préfixes de /0 à /30, la première et la dernière adresse de la plage sont présentées comme adresses hôte utilisables. Les préfixes /31 et /32 suivent leurs usages IPv4 particuliers.",
      },
      {
        title: "Traitement local",
        text: "Le calcul est effectué entièrement dans votre navigateur. Aucune adresse saisie n’est envoyée à un service externe ni stockée par Loculary.",
      },
    ],
  },
  en: {
    sections: [
      {
        title: "Read an IPv4 network in CIDR notation",
        text: "Enter an IPv4 address followed by a prefix, such as 192.168.1.42/24. Loculary calculates the network, subnet mask, and address range.",
      },
      {
        title: "Understand the calculated addresses",
        text: "The network address identifies the subnet and the broadcast address marks its upper boundary. For /0 through /30, the first and last addresses are shown as usable host addresses. /31 and /32 follow their special IPv4 usage.",
      },
      {
        title: "Local processing",
        text: "The calculation runs entirely in your browser. The address you enter is not sent to an external service or stored by Loculary.",
      },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  const t = content[locale];

  return (
    <>
      {t.sections.map((section, index) => (
        <ToolSection key={section.title} title={section.title} collapsible={index > 0}>
          <p>{section.text}</p>
        </ToolSection>
      ))}
    </>
  );
}
