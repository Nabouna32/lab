import type { Locale } from "./config";

type ToolMessages = {
  age: {
    birthDate: string; referenceDate: string; years: string; months: string; days: string;
    invalidRange: string; summary: (years: string, months: string, days: string) => string;
    yearSingular: string; yearPlural: string; monthSingular: string; monthPlural: string;
    daySingular: string; dayPlural: string;
  };
  duration: {
    datesMode: string; timesMode: string; startDate: string; endDate: string; startTime: string; endTime: string;
    days: string; hours: string; minutes: string; invalidRange: string;
    summaryDates: (days: string, hours: string, minutes: string) => string;
    summaryTimes: (hours: string, minutes: string) => string;
    overnight: string;
    daySingular: string; dayPlural: string; hourSingular: string; hourPlural: string;
    minuteSingular: string; minutePlural: string;
  };
  percentage: {
    type: string; result: string; how: string; formulaIntro: string; differenceNote: string;
    modes: { percentage: { title: string; description: string }; evolution: { title: string; description: string }; difference: { title: string; description: string } };
    firstLabels: { percentage: string; evolution: string; difference: string };
    secondLabels: { percentage: string; evolution: string; difference: string };
    firstPlaceholders: { percentage: string; evolution: string; difference: string };
    secondPlaceholders: { percentage: string; evolution: string; difference: string };
    evolutionZero: string; differenceZero: string; invalid: string;
    percentageExplanation: (first: string, second: string, result: string) => string;
    increaseExplanation: (from: string, to: string, result: string) => string;
    decreaseExplanation: (from: string, to: string, result: string) => string;
    unchangedExplanation: string;
    differenceExplanation: (first: string, second: string, result: string) => string;
    formulaIntroWithValues: string; waitingResult: string; eyebrow: string; heading: string; intro: string; inputHint: string; emptyResult: string;
  };
  reduction: {
    price: string; discount: string; discountedPrice: string; saved: string; placeholderPrice: string; placeholderDiscount: string;
    invalid: string; how: string; explanation: (amount: string) => string;
  };
  ruleOfThree: {
    firstValue: string; correspondingValue: string; secondValue: string; result: string;
    placeholders: { first: string; corresponding: string; second: string }; invalid: string; how: string; explanation: string;
  };
  vat: {
    htToTtc: string; ttcToHt: string; priceHt: string; priceTtc: string; rate: string; resultHt: string; vat: string; resultTtc: string;
    placeholders: { ht: string; ttc: string; rate: string }; invalid: string; how: string; explanation: (rate: string, vat: string) => string;
  };
  fileSizeCalculator: {
    duration: string; durationPlaceholder: string; durationUnit: string; durationUnits: Record<string, string>;
    bitrate: string; bitratePlaceholder: string; bitrateUnit: string; bitrateUnits: Record<string, string>;
    sizeUnit: string; sizeUnits: Record<string, string>; result: string; note: string; invalid: string;
  };
  fileSize: {
    value: string; from: string; to: string; result: string; placeholder: string; invalid: string;
    units: Record<string, string>;
  };
  downloadTime: {
    fileSize: string; sizeUnit: string; speed: string; speedUnit: string; placeholderSize: string; placeholderSpeed: string;
    estimated: string; seconds: (value: string) => string; note: string; invalid: string;
  };
  downloadSpeed: {
    value: string; from: string; to: string; result: string; placeholder: string; invalid: string;
    units: Record<string, string>;
  };
  textCounter: {
    input: string; placeholder: string; characters: string; charactersWithoutSpaces: string;
    words: string; spaces: string; lines: string; clear: string; copyStats: string;
  };
};

export const toolMessages: Record<Locale, ToolMessages> = {
  fr: {
    fileSizeCalculator: {
      duration: "Durée", durationPlaceholder: "Ex. 10", durationUnit: "Unité de durée",
      durationUnits: { seconds: "Secondes", minutes: "Minutes", hours: "Heures" },
      bitrate: "Débit", bitratePlaceholder: "Ex. 8", bitrateUnit: "Unité de débit",
      bitrateUnits: { kbps: "Kbit/s", mbps: "Mbit/s", gbps: "Gbit/s" },
      sizeUnit: "Unité de taille", sizeUnits: { mb: "Mégaoctets (Mo)", gb: "Gigaoctets (Go)" },
      result: "Taille estimée", note: "Estimation théorique à débit constant. Les unités de taille et de débit sont décimales.",
      invalid: "Saisissez une durée et un débit valides, positifs ou nuls.",
    },
    age: {
      birthDate: "Date de naissance", referenceDate: "Calculer au", years: "Années", months: "Mois", days: "Jours",
      invalidRange: "La date de naissance doit être antérieure ou égale à la date de référence.",
      summary: (years, months, days) => `Vous avez ${years}, ${months} et ${days}.`,
      yearSingular: "an", yearPlural: "ans", monthSingular: "mois", monthPlural: "mois", daySingular: "jour", dayPlural: "jours",
    },
    duration: {
      datesMode: "📅 Entre deux dates", timesMode: "🕐 Entre deux horaires", startDate: "Date et heure de début", endDate: "Date et heure de fin",
      startTime: "Heure de début", endTime: "Heure de fin", days: "Jours", hours: "Heures", minutes: "Minutes",
      invalidRange: "La date et l'heure de début doivent être antérieures ou égales à la date et l'heure de fin.",
      summaryDates: (days, hours, minutes) => `La durée est de ${days}, ${hours} et ${minutes}.`,
      summaryTimes: (hours, minutes) => `La durée est de ${hours} et ${minutes}.`,
      overnight: "Le calcul considère que l'heure de fin est le lendemain.",
      daySingular: "jour", dayPlural: "jours", hourSingular: "heure", hourPlural: "heures", minuteSingular: "minute", minutePlural: "minutes",
    },
    percentage: {
      type: "Type de calcul", result: "Résultat", how: "💡 Comment avons-nous trouvé ce résultat ?", formulaIntro: "Voici le calcul réalisé à partir des valeurs que vous avez saisies :",
      differenceNote: "💡 Une différence en pourcentage peut dépasser 100 % lorsque les deux valeurs sont très éloignées. Ce résultat est normal : le calcul compare l'écart à la moyenne des deux valeurs.",
      modes: {
        percentage: { title: "X % de Y", description: "Calculer une part" },
        evolution: { title: "Évolution", description: "Augmentation ou diminution" },
        difference: { title: "Différence", description: "Comparer deux valeurs" },
      },
      firstLabels: { percentage: "Pourcentage", evolution: "Valeur finale", difference: "Première valeur" },
      secondLabels: { percentage: "Valeur", evolution: "Valeur de départ", difference: "Deuxième valeur" },
      firstPlaceholders: { percentage: "Ex. 20", evolution: "Ex. 120", difference: "Ex. 100" },
      secondPlaceholders: { percentage: "Ex. 150", evolution: "Ex. 100", difference: "Ex. 120" },
      evolutionZero: "La valeur de départ ne peut pas être égale à 0.", differenceZero: "Les deux valeurs ne peuvent pas être égales à 0.", invalid: "Le résultat dépasse la précision numérique disponible.",
      percentageExplanation: (first, second, result) => `${first} % de ${second} = ${result}`,
      increaseExplanation: (from, to, result) => `La valeur est passée de ${from} à ${to}, soit une augmentation de ${result} %.`,
      decreaseExplanation: (from, to, result) => `La valeur est passée de ${from} à ${to}, soit une diminution de ${result} %.`,
      unchangedExplanation: "La valeur n'a pas changé.",
      differenceExplanation: (first, second, result) => `L'écart entre ${first} et ${second} représente ${result} % de leur moyenne.`,
      formulaIntroWithValues: "Voici le calcul réalisé à partir des valeurs que vous avez saisies :", waitingResult: "Le résultat apparaîtra ici dès que vous aurez renseigné les deux valeurs.", eyebrow: "Calculateur", heading: "Votre résultat, en un instant", intro: "Choisissez le calcul qui correspond à votre besoin, puis renseignez simplement les deux valeurs.", inputHint: "Le calcul se met à jour automatiquement. Vous pouvez modifier les valeurs à tout moment.", emptyResult: "Renseignez les deux valeurs pour voir le résultat ici.",
    },
    reduction: {
      price: "Prix initial", discount: "Réduction", discountedPrice: "Prix après réduction", saved: "Montant économisé",
      placeholderPrice: "Ex. 150", placeholderDiscount: "Ex. 20", invalid: "Saisissez un prix positif et une réduction comprise entre 0 et 100 %",
      how: "💡 Comment avons-nous trouvé ce résultat ?", explanation: (amount) => `La réduction représente ${amount} € sur le prix initial.`,
    },
    ruleOfThree: {
      firstValue: "Première valeur", correspondingValue: "Valeur correspondante", secondValue: "Deuxième valeur", result: "Résultat",
      placeholders: { first: "Ex. 4", corresponding: "Ex. 10", second: "Ex. 6" },
      invalid: "Saisissez trois nombres valides. La première valeur doit être différente de zéro.",
      how: "💡 Comment avons-nous trouvé ce résultat ?", explanation: "On conserve le même rapport entre les deux premières valeurs pour calculer la quatrième.",
    },
    vat: {
      htToTtc: "HT → TTC", ttcToHt: "TTC → HT", priceHt: "Prix HT", priceTtc: "Prix TTC", rate: "Taux de TVA",
      resultHt: "Prix HT", vat: "TVA", resultTtc: "Prix TTC", placeholders: { ht: "Ex. 100", ttc: "Ex. 120", rate: "Ex. 20" },
      invalid: "Saisissez un prix supérieur ou égal à 0 et un taux de TVA compris entre 0 et 100 %.",
      how: "💡 Comment avons-nous trouvé ce résultat ?", explanation: (rate, vat) => `Avec un taux de ${rate} %, la TVA représente ${vat} €.`,
    },
    fileSize: {
      value: "Valeur à convertir", from: "Unité de départ", to: "Unité d'arrivée", result: "Résultat", placeholder: "Ex. 1,5",
      invalid: "Saisissez une valeur positive ou nulle.",
      units: { o: "Octets (o)", ko: "Kilooctets (ko) — 1 000 o", mo: "Mégaoctets (Mo) — 1 000 000 o", go: "Gigaoctets (Go) — 1 000 000 000 o", to: "Téraoctets (To) — 1 000 000 000 000 o", kio: "Kio — 1 024 o", mio: "Mio — 1 048 576 o", gio: "Gio — 1 073 741 824 o", tio: "Tio — 1 099 511 627 776 o" },
    },
    downloadTime: {
      fileSize: "Taille du fichier", sizeUnit: "Unité de taille du fichier", speed: "Vitesse de téléchargement", speedUnit: "Unité de vitesse de téléchargement",
      placeholderSize: "Ex. 10", placeholderSpeed: "Ex. 100", estimated: "Temps estimé", seconds: (value) => `Soit environ ${value} secondes.`,
      note: "Estimation théorique à débit constant. Les unités de taille et de débit sont décimales.",
      invalid: "Saisissez une taille valide et une vitesse strictement supérieure à 0.",
    },
    downloadSpeed: {
      value: "Vitesse à convertir", from: "Unité de départ", to: "Unité d'arrivée", result: "Résultat", placeholder: "Ex. 100",
      invalid: "Saisissez une vitesse positive ou nulle.",
      units: { mbps: "Mégabits/s (Mbps)", gbps: "Gigabits/s (Gbps)", "ko-s": "Kilooctets/s (ko/s)", "mo-s": "Mégaoctets/s (Mo/s)", "go-s": "Gigaoctets/s (Go/s)" },
    },
    textCounter: {
      input: "Votre texte", placeholder: "Saisissez ou collez votre texte ici…", characters: "Caractères",
      charactersWithoutSpaces: "Caractères sans espaces", words: "Mots", spaces: "Espaces", lines: "Lignes", clear: "Effacer", copyStats: "Copier les statistiques",
    },
  },
  en: {
    fileSizeCalculator: {
      duration: "Duration", durationPlaceholder: "e.g. 10", durationUnit: "Duration unit",
      durationUnits: { seconds: "Seconds", minutes: "Minutes", hours: "Hours" },
      bitrate: "Bitrate", bitratePlaceholder: "e.g. 8", bitrateUnit: "Bitrate unit",
      bitrateUnits: { kbps: "Kbit/s", mbps: "Mbit/s", gbps: "Gbit/s" },
      sizeUnit: "Size unit", sizeUnits: { mb: "Megabytes (MB)", gb: "Gigabytes (GB)" },
      result: "Estimated size", note: "Theoretical estimate at a constant bitrate. Size and bitrate units are decimal.",
      invalid: "Enter a valid duration and bitrate, both 0 or greater.",
    },
    age: {
      birthDate: "Birth date", referenceDate: "Calculate on", years: "Years", months: "Months", days: "Days",
      invalidRange: "The birth date must be on or before the reference date.",
      summary: (years, months, days) => `You are ${years}, ${months}, and ${days} old.`,
      yearSingular: "year", yearPlural: "years", monthSingular: "month", monthPlural: "months", daySingular: "day", dayPlural: "days",
    },
    duration: {
      datesMode: "📅 Between two dates", timesMode: "🕐 Between two times", startDate: "Start date and time", endDate: "End date and time",
      startTime: "Start time", endTime: "End time", days: "Days", hours: "Hours", minutes: "Minutes",
      invalidRange: "The start date and time must be on or before the end date and time.",
      summaryDates: (days, hours, minutes) => `The duration is ${days}, ${hours}, and ${minutes}.`,
      summaryTimes: (hours, minutes) => `The duration is ${hours} and ${minutes}.`,
      overnight: "The calculation treats the end time as being on the following day.",
      daySingular: "day", dayPlural: "days", hourSingular: "hour", hourPlural: "hours", minuteSingular: "minute", minutePlural: "minutes",
    },
    percentage: {
      type: "Calculation type", result: "Result", how: "💡 How did we get this result?", formulaIntro: "Here is the calculation based on the values you entered:",
      differenceNote: "💡 A percentage difference can exceed 100% when the two values are far apart. This is expected: the calculation compares the gap with their average.",
      modes: {
        percentage: { title: "X% of Y", description: "Calculate a share" },
        evolution: { title: "Change", description: "Increase or decrease" },
        difference: { title: "Difference", description: "Compare two values" },
      },
      firstLabels: { percentage: "Percentage", evolution: "Final value", difference: "First value" },
      secondLabels: { percentage: "Value", evolution: "Starting value", difference: "Second value" },
      firstPlaceholders: { percentage: "e.g. 20", evolution: "e.g. 120", difference: "e.g. 100" },
      secondPlaceholders: { percentage: "e.g. 150", evolution: "e.g. 100", difference: "e.g. 120" },
      evolutionZero: "The starting value cannot be 0.", differenceZero: "The two values cannot both be 0.", invalid: "The result exceeds the available numeric precision.",
      percentageExplanation: (first, second, result) => `${first}% of ${second} = ${result}`,
      increaseExplanation: (from, to, result) => `The value changed from ${from} to ${to}, an increase of ${result}%.`,
      decreaseExplanation: (from, to, result) => `The value changed from ${from} to ${to}, a decrease of ${result}%.`,
      unchangedExplanation: "The value did not change.",
      differenceExplanation: (first, second, result) => `The difference between ${first} and ${second} is ${result}% of their average.`,
      formulaIntroWithValues: "Here is the calculation based on the values you entered:", waitingResult: "Your result will appear here as soon as both values are filled in.", eyebrow: "Calculator", heading: "Your answer, in an instant", intro: "Choose the calculation that matches your need, then enter the two values.", inputHint: "The calculation updates automatically. You can change either value at any time.", emptyResult: "Enter both values to see the result here.",
    },
    reduction: {
      price: "Initial price", discount: "Discount", discountedPrice: "Price after discount", saved: "Amount saved",
      placeholderPrice: "e.g. 150", placeholderDiscount: "e.g. 20", invalid: "Enter a positive price and a discount between 0 and 100%",
      how: "💡 How did we get this result?", explanation: (amount) => `The discount represents €${amount} of the initial price.`,
    },
    ruleOfThree: {
      firstValue: "First value", correspondingValue: "Corresponding value", secondValue: "Second value", result: "Result",
      placeholders: { first: "e.g. 4", corresponding: "e.g. 10", second: "e.g. 6" },
      invalid: "Enter three valid numbers. The first value must be different from zero.",
      how: "💡 How did we get this result?", explanation: "We keep the same ratio between the first two values to calculate the fourth.",
    },
    vat: {
      htToTtc: "Net → Gross", ttcToHt: "Gross → Net", priceHt: "Net price", priceTtc: "Gross price", rate: "VAT rate",
      resultHt: "Net price", vat: "VAT", resultTtc: "Gross price", placeholders: { ht: "e.g. 100", ttc: "e.g. 120", rate: "e.g. 20" },
      invalid: "Enter a price of at least 0 and a VAT rate between 0 and 100%.",
      how: "💡 How did we get this result?", explanation: (rate, vat) => `At a ${rate}% rate, VAT is €${vat}.`,
    },
    fileSize: {
      value: "Value to convert", from: "From unit", to: "To unit", result: "Result", placeholder: "e.g. 1.5",
      invalid: "Enter a value that is 0 or greater.",
      units: { o: "Bytes (B)", ko: "Kilobytes (kB) — 1,000 B", mo: "Megabytes (MB) — 1,000,000 B", go: "Gigabytes (GB) — 1,000,000,000 B", to: "Terabytes (TB) — 1,000,000,000,000 B", kio: "Kibibytes (KiB) — 1,024 B", mio: "Mebibytes (MiB) — 1,048,576 B", gio: "Gibibytes (GiB) — 1,073,741,824 B", tio: "Tebibytes (TiB) — 1,099,511,627,776 B" },
    },
    downloadTime: {
      fileSize: "File size", sizeUnit: "File size unit", speed: "Download speed", speedUnit: "Download speed unit",
      placeholderSize: "e.g. 10", placeholderSpeed: "e.g. 100", estimated: "Estimated time", seconds: (value) => `About ${value} seconds.`,
      note: "Theoretical estimate at a constant rate. Size and speed units are decimal.",
      invalid: "Enter a valid file size and a speed greater than 0.",
    },
    downloadSpeed: {
      value: "Speed to convert", from: "From unit", to: "To unit", result: "Result", placeholder: "e.g. 100",
      invalid: "Enter a speed that is 0 or greater.",
      units: { mbps: "Megabits/s (Mbps)", gbps: "Gigabits/s (Gbps)", "ko-s": "Kilobytes/s (kB/s)", "mo-s": "Megabytes/s (MB/s)", "go-s": "Gigabytes/s (GB/s)" },
    },
    textCounter: {
      input: "Your text", placeholder: "Type or paste your text here…", characters: "Characters",
      charactersWithoutSpaces: "Characters without spaces", words: "Words", spaces: "Spaces", lines: "Lines", clear: "Clear", copyStats: "Copy statistics",
    },
  },
};

export function getToolMessages(locale: Locale): ToolMessages {
  return toolMessages[locale];
}
