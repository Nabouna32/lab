import type { Locale } from "@/lib/i18n/config";
import ToolSection from "@/components/tools/ToolPage/ToolSection";

const content = {
  fr: {
    sections: [
      { title: "Calculer un préfixe IPv6 CIDR", text: "Saisissez une adresse IPv6 suivie d’un préfixe de /0 à /128, par exemple 2001:db8:1234:1::42/64. Le résultat donne le préfixe réseau canonique, la dernière adresse du bloc et le nombre exact d’adresses." },
      { title: "Comprendre la plage IPv6", text: "IPv6 n’utilise pas d’adresse de broadcast. L’outil affiche donc les bornes du préfixe et le nombre total d’adresses, sans inventer une notion générique d’hôtes utilisables." },
      { title: "Traitement local", text: "Tous les calculs sont effectués dans votre navigateur. Aucune adresse saisie n’est envoyée à un service externe ni conservée par Loculary." },
    ],
  },
  en: {
    sections: [
      { title: "Calculate an IPv6 CIDR prefix", text: "Enter an IPv6 address followed by a /0–/128 prefix, for example 2001:db8:1234:1::42/64. The result shows the canonical network prefix, the block’s last address, and the exact address count." },
      { title: "Understand the IPv6 range", text: "IPv6 does not use a broadcast address. The tool therefore shows the prefix boundaries and total address count without inventing a generic usable-host count." },
      { title: "Local processing", text: "All calculations run in your browser. The address you enter is never sent to an external service or stored by Loculary." },
    ],
  },
} as const;

export default function ToolEditorial({ locale }: { locale: Locale }) {
  return <>{content[locale].sections.map((section, index) => (
    <ToolSection key={section.title} title={section.title} collapsible={index > 0}><p>{section.text}</p></ToolSection>
  ))}</>;
}
