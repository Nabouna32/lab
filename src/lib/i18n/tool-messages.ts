import type { Locale } from "./config";

type ToolMessages = {
  age: {
    birthDate: string; referenceDate: string; years: string; months: string; days: string;
    invalidRange: string; emptyResult: string; summary: (years: string, months: string, days: string) => string;
    yearSingular: string; yearPlural: string; monthSingular: string; monthPlural: string;
    daySingular: string; dayPlural: string;
  };
  duration: {
    datesMode: string; timesMode: string; startDate: string; endDate: string; startTime: string; endTime: string;
    days: string; hours: string; minutes: string; invalidRange: string; emptyResult: string;
    summaryDates: (days: string, hours: string, minutes: string) => string;
    summaryTimes: (hours: string, minutes: string) => string;
    overnight: string;
  };
  dateCalculator: {
    operation: string; add: string; subtract: string; startDate: string; amount: string; unit: string; result: string;
    emptyResult: string; invalid: string;
    units: { days: string; weeks: string; months: string; years: string };
    summary: (start: string, amount: number, unit: string, direction: string, result: string) => string;
  };
  compoundInterest: {
    principal: string; principalPlaceholder: string; rate: string; ratePlaceholder: string; years: string; yearsPlaceholder: string;
    frequency: string; frequencies: Record<1 | 2 | 4 | 12 | 365, string>; contribution: string; contributionPlaceholder: string;
    contributionHint: string; result: string; finalBalance: string; interestEarned: string; totalContributions: string;
    resultHint: string; emptyResult: string; invalid: string;
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
    formulaIntroWithValues: string; waitingResult: string; inputHint: string; emptyResult: string;
  };
  reduction: {
    price: string; discount: string; discountedPrice: string; saved: string; placeholderPrice: string; placeholderDiscount: string;
    invalid: string; emptyResult: string; how: string; explanation: (amount: string) => string;
  };
  ruleOfThree: {
    firstValue: string; correspondingValue: string; secondValue: string; result: string;
    placeholders: { first: string; corresponding: string; second: string }; invalid: string; emptyResult: string; how: string; explanation: string;
  };
  vat: {
    htToTtc: string; ttcToHt: string; priceHt: string; priceTtc: string; rate: string; resultHt: string; vat: string; resultTtc: string;
    placeholders: { ht: string; ttc: string; rate: string }; invalid: string; emptyResult: string; how: string; explanation: (rate: string, vat: string) => string;
  };
  fileSizeCalculator: {
    duration: string; durationPlaceholder: string; durationUnit: string; bitrate: string; bitratePlaceholder: string; bitrateUnit: string; sizeUnit: string; result: string; note: string; invalid: string; emptyResult: string;
  };
  fileSize: {
    value: string; from: string; to: string; result: string; placeholder: string; invalid: string; emptyResult: string;
      };
  downloadTime: {
    fileSize: string; sizeUnit: string; speed: string; speedUnit: string; placeholderSize: string; placeholderSpeed: string;
    estimated: string; seconds: (value: string) => string; note: string; invalid: string;

  };
  downloadSpeed: {
    value: string; from: string; to: string; result: string; placeholder: string; invalid: string; emptyResult: string;
    };
  textCounter: {
    input: string; placeholder: string; characters: string; charactersWithoutSpaces: string;
    words: string; spaces: string; lines: string; clear: string; copyStats: string;
  };
  textCaseConverter: {
    input: string; placeholder: string; mode: string; result: string; ready: string; emptyResult: string; copy: string; clear: string;
    modes: { uppercase: string; lowercase: string; title: string; camel: string; pascal: string; snake: string; kebab: string };
  };
  unitConverter: {
    value: string; category: string; from: string; to: string; result: string; placeholder: string; invalid: string;
    emptyResult: string; copy: string; swap: string; hint: string;
    categories: { length: string; mass: string; temperature: string; volume: string; area: string };
  };
  jsonFormatter: {
    input: string; placeholder: string; output: string; format: string; minify: string; copy: string; clear: string;
    indentation: string; spaces2: string; spaces4: string; tab: string; valid: string; invalid: string;
    emptyResult: string; formatted: string; minified: string; errorAt: (line: string, column: string) => string;
  };
  yamlFormatterValidator: {
    input: string; placeholder: string; output: string; format: string; copy: string; clear: string;
    indentation: string; spaces2: string; spaces4: string; tab: string; valid: string; invalid: string;
    emptyResult: string; formatted: string; errorAt: (line: string, column: string) => string; resourceLimit: string;
  };
  urlEncoder: {
    input: string; placeholder: string; output: string; scope: string; component: string; uri: string;
    operation: string; encode: string; decode: string; copy: string; clear: string; encoded: string; decoded: string;
    emptyResult: string; error: string; invalidEncoding: string; invalidText: string;
  };
  urlParser: {
    input: string; placeholder: string; result: string; ready: string; emptyResult: string; invalid: string;
    clear: string; copy: string; hint: string; emptyValue: string; queryParameters: string; noQueryParameters: string;
    protocol: string; origin: string; username: string; host: string; hostname: string; port: string; pathname: string; search: string; hash: string;
  };
  base64: {
    input: string; placeholder: string; output: string; encode: string; decode: string; copy: string; clear: string;
    encoded: string; decoded: string; emptyResult: string; error: string; invalidBase64: string; invalidText: string;
  };
  htmlEntityEncoder: {
    input: string; placeholder: string; operation: string; encode: string; decode: string; result: string;
    ready: string; emptyResult: string; copy: string; clear: string;
  };
  jsonToTypeScript: {
    input: string; placeholder: string; rootName: string; rootPlaceholder: string; generate: string;
    result: string; ready: string; emptyResult: string; copy: string; clear: string; error: string;
    invalidJson: string; unsupportedRoot: string;
  };
  csvJson: {
    input: string; placeholder: string; delimiter: string; csvToJson: string; jsonToCsv: string;
    result: string; ready: string; emptyResult: string; copy: string; clear: string; error: string;
    invalidCsv: string; invalidJson: string; unsupportedJson: string;
  };
  uuidGenerator: {
    count: string; countPlaceholder: string; generate: string; copy: string; copied: string; clear: string; result: string;
    emptyResult: string; invalidCount: string; generatedOne: string; generatedMany: (count: number) => string;
  };
  htmlPreviewer: {
    input: string; placeholder: string; hint: string; preview: string; ready: string; emptyResult: string; clear: string; security: string;
  };
  imageCompressor: {
    input: string; inputHint: string; format: string; maxDimension: string; original: string; quality: string; qualityHint: string;
    processing: string; download: string; reset: string; preview: string; emptyResult: string; invalid: string; invalidType: string; tooLarge: string;
    originalSize: string; compressedSize: string; reduction: string;
  };
  qrCodeGenerator: {
    input: string; placeholder: string; hint: string; size: string; download: string; clear: string;
    preview: string; emptyResult: string; tooLong: string; version: (version: number) => string;
  };
  markdownTable: {
    table: string; hint: string; addColumn: string; addRow: string; removeColumn: string; removeRow: string; reset: string;
    column: string; alignmentLabel: (column: number) => string; left: string; center: string; right: string;
    headerCell: string; bodyCell: string; markdown: string; outputHint: string; preview: string; copy: string;
  };
  jwtDecoder: {
    input: string; placeholder: string; decode: string; clear: string; header: string; payload: string; signature: string; copy: string; invalid: string; signatureNote: string;
  };
  hashGenerator: {
    input: string; placeholder: string; algorithm: string; generate: string; generating: string; clear: string;
    result: string; complete: string; emptyResult: string; copy: string; invalid: string;
  };
  passwordGenerator: {
    length: string; characters: string; lowercase: string; uppercase: string; numbers: string; symbols: string;
    excludeAmbiguous: string; generate: string; result: string; emptyResult: string; copy: string; invalid: string;
  };
  regexTester: {
    pattern: string; patternPlaceholder: string; flags: string; flagsHint: string; input: string; inputPlaceholder: string;
    test: string; clear: string; invalid: string; result: string; emptyResult: string; noMatches: string;
    matchCount: (count: number) => string; position: string; captures: string; namedGroups: string; emptyMatch: string;
    truncated: string; copy: string;
  };

  timezoneConverter: {
    dateTime: string; source: string; destination: string; sourcePlaceholder: string; destinationPlaceholder: string;
    hint: string; convert: string; result: string; converted: string; emptyResult: string; invalid: string;
    ambiguous: string; sourceTime: string; destinationTime: string; sourceOffset: string; destinationOffset: string;
    copy: string; clear: string; zonesHint: string;
  };
  xmlFormatterValidator: {
    input: string; placeholder: string; output: string; indentation: string; spaces2: string; spaces4: string; tab: string;
    format: string; validate: string; copy: string; clear: string; valid: string; invalid: string; formatted: string; emptyResult: string;
  };
  unixTimestamp: {
    timestampToDate: string; dateToTimestamp: string; timestamp: string; timestampPlaceholder: string;
    timestampUnit: string; seconds: string; milliseconds: string; dateTime: string; timestampHint: string;
    dateHint: string; convert: string; result: string; converted: string; localDate: string; utcDate: string;
    timestampResult: string; emptyResult: string; invalid: string; copy: string; clear: string;
  };
  colorConverter: {
    input: string; picker: string; placeholder: string; hint: string; reset: string; preview: string;
    previewDescription: string; result: string; copy: string; copied: string; invalid: string; emptyResult: string;
  };
  colorPaletteGenerator: {
    input: string; picker: string; placeholder: string; hint: string; reset: string; basePreview: string;
    analogous: string; complementary: string; triadic: string; splitComplementary: string; monochromatic: string;
    copy: string; copied: string; invalid: string;
  };
  contrastChecker: {
    foreground: string; background: string; colorHint: string; swap: string; reset: string;
    preview: string; previewText: string; previewDescription: string; result: string; ratio: string;
    normalText: string; largeText: string; invalid: string; thresholds: string;
  };
  ipSubnetCalculator: {
    input: string; placeholder: string; result: string; ready: string; emptyResult: string;
    invalid: string; clear: string; reset: string; hint: string; copy: string;
    networkAddress: string; broadcastAddress: string; subnetMask: string; wildcardMask: string;
    firstUsableAddress: string; lastUsableAddress: string; totalAddresses: string; usableHosts: string;
    hostCountNote: string;
  };
  numberBaseConverter: {
    input: string; placeholder: string; fromBase: string; toBase: string; result: string;
    emptyResult: string; invalid: string; hint: string; reset: string; swap: string;
    copy: string; copied: string; baseLabel: (base: number) => string;
  };
  cronExpression: {
    input: string; placeholder: string; result: string; valid: string; invalid: string; emptyResult: string;
    expressionHint: string; nextRuns: string; copy: string; clear: string; reset: string;
    fields: { minute: string; hour: string; dayOfMonth: string; month: string; dayOfWeek: string };
    examples: { everyMinute: string; everyWeekday: string; midnight: string };
    descriptions: { everyMinute: string; everyHour: string; midnight: string; weekdayMorning: string; custom: (expression: string) => string };
  };
  textDiffChecker: {
    original: string; originalPlaceholder: string; updated: string; updatedPlaceholder: string;
    result: string; emptyResult: string; resourceLimit: string; copy: string; clear: string; reset: string;
    summary: (added: number, removed: number, unchanged: number) => string;
  };
  videoBitrate: {
    mode: string; duration: string; hours: string; minutes: string; seconds: string;
    hoursPlaceholder: string; minutesPlaceholder: string; secondsPlaceholder: string;
    targetSize: string; sizeUnit: string; sizePlaceholder: string; bitrate: string; bitratePlaceholder: string; bitrateUnit: string;
    result: string; emptyResult: string; inputHint: string; invalid: string; invalidDuration: string;
    invalidSize: string; invalidBitrate: string; bitrateResultNote: string; sizeResultNote: string;
    copy: string; copied: string;
    modes: { bitrate: { title: string; description: string }; size: { title: string; description: string } };
  };
};

export const toolMessages: Record<Locale, ToolMessages> = {
  fr: {
    colorConverter: {
      input: "Votre couleur", picker: "Choisir une couleur", placeholder: "#336699, rgb(51, 102, 153) ou hsl(210, 50%, 40%)",
      hint: "Formats acceptés : #RGB, #RRGGBB, rgb(...) et hsl(...).", reset: "Réinitialiser", preview: "Aperçu", previewDescription: "Cette couleur est traitée localement dans votre navigateur.",
      result: "Conversions", copy: "Copier", copied: "Copié", invalid: "Saisissez une couleur HEX, RGB ou HSL valide.", emptyResult: "Le résultat apparaîtra ici après conversion.",
    },
    colorPaletteGenerator: {
      input: "Votre couleur de départ", picker: "Choisir une couleur", placeholder: "#336699 ou hsl(210, 50%, 40%)",
      hint: "Formats acceptés : #RGB, #RRGGBB, rgb(...) et hsl(...).", reset: "Réinitialiser", basePreview: "Aperçu de la palette",
      analogous: "Analogique", complementary: "Complémentaire", triadic: "Triadique", splitComplementary: "Complémentaire scindée", monochromatic: "Monochromatique",
      copy: "Copier", copied: "Copié", invalid: "Saisissez une couleur HEX, RGB ou HSL valide.",
    },
    contrastChecker: {
      foreground: "Texte / premier plan", background: "Arrière-plan", colorHint: "Formats acceptés : #RGB, #RRGGBB ou rgb(r, g, b).",
      swap: "Inverser", reset: "Réinitialiser", preview: "Aperçu", previewText: "Exemple de texte", previewDescription: "Utilisez cet aperçu pour vérifier le rendu du contraste.",
      result: "Résultat", ratio: "Ratio de contraste", normalText: "Texte courant", largeText: "Grand texte",
      invalid: "Saisissez deux couleurs valides.", thresholds: "AA : 4,5:1 pour le texte courant et 3:1 pour le grand texte. AAA : 7:1 pour le texte courant et 4,5:1 pour le grand texte.",
    },
    ipSubnetCalculator: {
      input: "Réseau IPv4 (CIDR)", placeholder: "Ex. 192.168.1.42/24", result: "Résultat", ready: "Calcul mis à jour", emptyResult: "Le résultat apparaîtra ici après le calcul.",
      invalid: "Saisissez une adresse IPv4 valide et un préfixe de /0 à /32.", clear: "Effacer", reset: "Réinitialiser", copy: "Copier", hint: "Le calcul accepte la notation CIDR IPv4, par exemple 192.168.1.42/24. Il est effectué localement dans votre navigateur.",
      networkAddress: "Adresse réseau", broadcastAddress: "Adresse de broadcast", subnetMask: "Masque de sous-réseau", wildcardMask: "Masque générique",
      firstUsableAddress: "Première adresse hôte", lastUsableAddress: "Dernière adresse hôte", totalAddresses: "Adresses totales", usableHosts: "Hôtes utilisables",
      hostCountNote: "Pour /0 à /30, les adresses réseau et broadcast ne sont pas comptées comme hôtes utilisables. Les préfixes /31 et /32 suivent leurs usages IPv4 particuliers.",
    },
    numberBaseConverter: {
      input: "Nombre à convertir", placeholder: "Ex. FF", fromBase: "Base de départ", toBase: "Base d’arrivée",
      result: "Résultat", emptyResult: "Le résultat apparaîtra ici après conversion.",
      invalid: "Saisissez un entier valide pour la base choisie.", hint: "Les bases 2 à 36 sont prises en charge. Les lettres A–Z représentent les chiffres 10–35.",
      reset: "Réinitialiser", swap: "Inverser les bases", copy: "Copier", copied: "Copié",
      baseLabel: (base) => "Base " + base,
    },

    fileSizeCalculator: {
      duration: "Durée", durationPlaceholder: "Ex. 10", durationUnit: "Unité de durée",
      bitrate: "Débit", bitratePlaceholder: "Ex. 8", bitrateUnit: "Unité de débit",
      sizeUnit: "Unité de taille",
      result: "Taille estimée", note: "Estimation théorique à débit constant. Les unités de taille et de débit sont décimales.",
      invalid: "Saisissez une durée et un débit valides, positifs ou nuls.", emptyResult: "Renseignez la durée et le débit pour voir la taille estimée.",
    },
    age: {
      birthDate: "Date de naissance", referenceDate: "Calculer au", years: "Années", months: "Mois", days: "Jours",
      invalidRange: "La date de naissance doit être antérieure ou égale à la date de référence.", emptyResult: "Renseignez une date de naissance pour voir l’âge calculé.",
      summary: (years, months, days) => `Vous avez ${years}, ${months} et ${days}.`,
      yearSingular: "an", yearPlural: "ans", monthSingular: "mois", monthPlural: "mois", daySingular: "jour", dayPlural: "jours",
    },
    duration: {
      datesMode: "Entre deux dates", timesMode: "Entre deux horaires", startDate: "Date et heure de début", endDate: "Date et heure de fin",
      startTime: "Heure de début", endTime: "Heure de fin", days: "Jours", hours: "Heures", minutes: "Minutes",
      invalidRange: "La date et l'heure de début doivent être antérieures ou égales à la date et l'heure de fin.", emptyResult: "Renseignez les dates ou horaires pour voir la durée.",
      summaryDates: (days, hours, minutes) => `La durée est de ${days}, ${hours} et ${minutes}.`,
      summaryTimes: (hours, minutes) => `La durée est de ${hours} et ${minutes}.`,
      overnight: "Le calcul considère que l'heure de fin est le lendemain.",
    },
    dateCalculator: {
      operation: "Opération", add: "Ajouter", subtract: "Retirer", startDate: "Date de départ", amount: "Quantité", unit: "Unité",
      result: "Nouvelle date", emptyResult: "La nouvelle date apparaîtra ici.", invalid: "Saisissez une date et une quantité entière valide.",
      units: { days: "jours", weeks: "semaines", months: "mois", years: "années" },
      summary: (start, amount, unit, direction, result) => `À partir du ${start}, ${direction} ${amount} ${unit} donne le ${result}.`,
    },
    compoundInterest: {
      principal: "Capital initial", principalPlaceholder: "ex. 1 000", rate: "Taux annuel", ratePlaceholder: "ex. 5",
      years: "Durée (années)", yearsPlaceholder: "ex. 10", frequency: "Capitalisation",
      frequencies: { 1: "Annuelle", 2: "Semestrielle", 4: "Trimestrielle", 12: "Mensuelle", 365: "Quotidienne" },
      contribution: "Versement par période", contributionPlaceholder: "Optionnel", contributionHint: "Chaque versement est considéré comme effectué en fin de période.",
      result: "Résultat", finalBalance: "Capital final", interestEarned: "Intérêts gagnés", totalContributions: "Capital versé",
      resultHint: "Calcul indicatif : il ne tient pas compte des impôts, frais ou variations de taux.",
      emptyResult: "Saisissez les valeurs pour voir le résultat.", invalid: "Vérifiez les valeurs saisies. Le taux et les montants doivent être positifs ou nuls, et la durée doit être comprise entre 0 et 1 000 ans.",
    },
    compoundInterest: {
      principal: "Initial principal", principalPlaceholder: "e.g. 1,000", rate: "Annual rate", ratePlaceholder: "e.g. 5",
      years: "Years", yearsPlaceholder: "e.g. 10", frequency: "Compounding",
      frequencies: { 1: "Annually", 2: "Semi-annually", 4: "Quarterly", 12: "Monthly", 365: "Daily" },
      contribution: "Contribution per period", contributionPlaceholder: "Optional", contributionHint: "Each contribution is treated as being made at the end of the period.",
      result: "Result", finalBalance: "Final balance", interestEarned: "Interest earned", totalContributions: "Total contributions and principal",
      resultHint: "Illustrative calculation only: taxes, fees, and rate changes are not included.",
      emptyResult: "Enter the values to see the result.", invalid: "Check the values entered. Rates and amounts must be zero or greater, and duration must be between 0 and 1,000 years.",
    },
    percentage: {
      type: "Type de calcul", result: "Résultat", how: "Voir le calcul", formulaIntro: "Voici le calcul réalisé à partir des valeurs que vous avez saisies :",
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
      formulaIntroWithValues: "Voici le calcul réalisé à partir des valeurs que vous avez saisies :", waitingResult: "Le résultat apparaît ici dès que les deux valeurs sont renseignées.", inputHint: "Le résultat se met à jour automatiquement lorsque vous modifiez une valeur.", emptyResult: "Renseignez les deux valeurs pour voir le résultat ici.",
    },
    reduction: {
      price: "Prix initial", discount: "Réduction", discountedPrice: "Prix après réduction", saved: "Montant économisé",
      placeholderPrice: "Ex. 150", placeholderDiscount: "Ex. 20", invalid: "Saisissez un prix positif et une réduction comprise entre 0 et 100 %",
      emptyResult: "Saisissez le prix et la remise pour afficher le résultat.", how: "Voir le calcul", explanation: (amount) => `La réduction représente ${amount} € sur le prix initial.`,
    },
    ruleOfThree: {
      firstValue: "Première valeur", correspondingValue: "Valeur correspondante", secondValue: "Deuxième valeur", result: "Résultat",
      placeholders: { first: "Ex. 4", corresponding: "Ex. 10", second: "Ex. 6" },
      invalid: "Saisissez trois nombres valides. La première valeur doit être différente de zéro.", emptyResult: "Saisissez les trois valeurs pour afficher le résultat.",
      how: "Voir le calcul", explanation: "On conserve le même rapport entre les deux premières valeurs pour calculer la quatrième.",
    },
    vat: {
      htToTtc: "HT → TTC", ttcToHt: "TTC → HT", priceHt: "Prix HT", priceTtc: "Prix TTC", rate: "Taux de TVA",
      resultHt: "Prix HT", vat: "TVA", resultTtc: "Prix TTC", placeholders: { ht: "Ex. 100", ttc: "Ex. 120", rate: "Ex. 20" },
      invalid: "Saisissez un prix supérieur ou égal à 0 et un taux de TVA compris entre 0 et 100 %.", emptyResult: "Saisissez les valeurs pour afficher le calcul de TVA.",
      how: "Voir le calcul", explanation: (rate, vat) => `Avec un taux de ${rate} %, la TVA représente ${vat} €.`,
    },
    fileSize: {
      value: "Valeur à convertir", from: "Unité de départ", to: "Unité d'arrivée", result: "Résultat", placeholder: "Ex. 1,5",
      invalid: "Saisissez une valeur positive ou nulle.", emptyResult: "Saisissez une valeur pour afficher la conversion.",

    },
    downloadTime: {
      fileSize: "Taille du fichier", sizeUnit: "Unité de taille du fichier", speed: "Vitesse de téléchargement", speedUnit: "Unité de vitesse de téléchargement",
      placeholderSize: "Ex. 10", placeholderSpeed: "Ex. 100", estimated: "Temps estimé", seconds: (value) => `Soit environ ${value} secondes.`,
      note: "Estimation théorique à débit constant. Les unités de taille et de débit sont décimales.",
      invalid: "Saisissez une taille valide et une vitesse strictement supérieure à 0.",
    },
    downloadSpeed: {
      value: "Vitesse à convertir", from: "Unité de départ", to: "Unité d'arrivée", result: "Résultat", placeholder: "Ex. 100",
      invalid: "Saisissez une vitesse positive ou nulle.", emptyResult: "Saisissez une vitesse pour afficher la conversion.",

    },
    textCounter: {
      input: "Votre texte", placeholder: "Saisissez ou collez votre texte ici…", characters: "Caractères",
      charactersWithoutSpaces: "Caractères sans espaces", words: "Mots", spaces: "Espaces", lines: "Lignes", clear: "Effacer", copyStats: "Copier les statistiques",
    },
    textCaseConverter: {
      input: "Votre texte", placeholder: "Saisissez ou collez votre texte…", mode: "Transformer en", result: "Résultat", ready: "Transformation mise à jour", emptyResult: "Le résultat apparaîtra ici.", copy: "Copier", clear: "Effacer",
      modes: { uppercase: "MAJUSCULES", lowercase: "minuscules", title: "Title Case", camel: "camelCase", pascal: "PascalCase", snake: "snake_case", kebab: "kebab-case" },
    },
    unitConverter: {
      value: "Valeur à convertir", category: "Catégorie", from: "De", to: "Vers", result: "Résultat", placeholder: "Ex. 1,5", invalid: "Saisissez une valeur valide et compatible avec l’unité choisie.",
      emptyResult: "Saisissez une valeur pour voir la conversion.", copy: "Copier", swap: "Inverser les unités", hint: "La conversion est calculée localement dans votre navigateur.",
      categories: { length: "Longueur", mass: "Masse", temperature: "Température", volume: "Volume", area: "Surface" },
    },
    jsonFormatter: {
      input: "Votre JSON", placeholder: '{\\n  "name": "Loculary"\\n}', output: "Résultat", format: "Formater", minify: "Minifier", copy: "Copier", clear: "Effacer",
      indentation: "Indentation", spaces2: "2 espaces", spaces4: "4 espaces", tab: "Tabulation", valid: "JSON valide", invalid: "JSON invalide",
      emptyResult: "Le résultat apparaîtra ici après validation.", formatted: "Formaté", minified: "Minifié", errorAt: (line, column) => "Ligne " + line + ", colonne " + column,
    },
    yamlFormatterValidator: {
      input: "Votre YAML", placeholder: "name: Loculary\\ntools:\\n  - JSON\\n  - YAML", output: "Résultat", format: "Formater", copy: "Copier", clear: "Effacer",
      indentation: "Indentation", spaces2: "2 espaces", spaces4: "4 espaces", tab: "Tabulation", valid: "YAML valide", invalid: "YAML invalide",
      emptyResult: "Le résultat apparaîtra ici après validation.", formatted: "Formaté", resourceLimit: "Le document est trop volumineux ou trop complexe à traiter en toute sécurité.",
      errorAt: (line, column) => "Ligne " + line + ", colonne " + column,
    },
    urlEncoder: {
      input: "Votre texte", placeholder: "Saisissez du texte ou une URL…", output: "Résultat", scope: "Mode d’encodage", component: "Composant d’URL", uri: "URL complète",
      operation: "Action", encode: "Encoder", decode: "Décoder", copy: "Copier", clear: "Effacer", encoded: "Encodé", decoded: "Décodé",
      emptyResult: "Le résultat apparaîtra ici après transformation.", error: "La transformation n’a pas pu être effectuée.", invalidEncoding: "L’encodage URL est invalide.", invalidText: "Le texte contient un caractère qui ne peut pas être encodé.",
    },
    urlParser: {
      input: "Votre URL", placeholder: "https://exemple.com/chemin?lang=fr#section", result: "Analyse", ready: "URL analysée", emptyResult: "Le résultat apparaîtra ici après analyse.", invalid: "Saisissez une URL absolue valide.",
      clear: "Effacer", copy: "Copier l’URL", hint: "L’analyse est effectuée localement dans votre navigateur. Aucun service externe n’est utilisé.", emptyValue: "—",
      queryParameters: "Paramètres de requête", noQueryParameters: "Aucun paramètre de requête.", protocol: "Protocole", origin: "Origine", username: "Nom d’utilisateur",
      host: "Hôte", hostname: "Nom d’hôte", port: "Port", pathname: "Chemin", search: "Requête", hash: "Fragment",
    },
    base64: {
      input: "Votre texte", placeholder: "Saisissez du texte à encoder ou une chaîne Base64 à décoder…", output: "Résultat", encode: "Encoder", decode: "Décoder", copy: "Copier", clear: "Effacer",
      encoded: "Encodé en Base64", decoded: "Décodé", emptyResult: "Le résultat apparaîtra ici après transformation.", error: "La transformation n’a pas pu être effectuée.", invalidBase64: "La chaîne Base64 est invalide ou ne contient pas de texte UTF-8 valide.", invalidText: "Le texte ne peut pas être encodé.",
    },
    htmlEntityEncoder: {
      input: "Votre texte", placeholder: "Saisissez du HTML ou du texte à transformer…", operation: "Action", encode: "Encoder", decode: "Décoder",
      result: "Résultat", ready: "Transformation mise à jour", emptyResult: "Le résultat apparaîtra ici.", copy: "Copier", clear: "Effacer",
    },
    jsonToTypeScript: {
      input: "Votre JSON", placeholder: "Collez un objet ou un tableau JSON…", rootName: "Nom du type racine", rootPlaceholder: "Root", generate: "Générer",
      result: "TypeScript généré", ready: "Génération terminée", emptyResult: "Le code TypeScript apparaîtra ici.", copy: "Copier", clear: "Effacer", error: "Le JSON n’a pas pu être converti.",
      invalidJson: "Le JSON est invalide.", unsupportedRoot: "Utilisez un objet ou un tableau JSON comme valeur racine.",
    },
    csvJson: {
      input: "Données", placeholder: "Collez un CSV ou un tableau JSON d’objets…", delimiter: "Séparateur CSV", csvToJson: "CSV → JSON", jsonToCsv: "JSON → CSV",
      result: "Résultat", ready: "Conversion mise à jour", emptyResult: "Le résultat apparaîtra ici.", copy: "Copier", clear: "Effacer", error: "La conversion n’a pas pu être effectuée.",
      invalidCsv: "Le CSV est invalide ou mal formé.", invalidJson: "Le JSON est invalide.", unsupportedJson: "Utilisez un tableau JSON composé d’objets.",
    },
    textDiffChecker: {
      original: "Version originale", originalPlaceholder: "Collez le texte original…", updated: "Version modifiée", updatedPlaceholder: "Collez le texte modifié…",
      result: "Comparaison", emptyResult: "Collez deux versions pour afficher les différences.", resourceLimit: "Les textes sont trop volumineux pour être comparés en toute sécurité.", copy: "Copier le diff", clear: "Effacer", reset: "Réinitialiser",
      summary: (added, removed, unchanged) => `+${added} ajout${added === 1 ? "" : "s"} · -${removed} suppression${removed === 1 ? "" : "s"} · ${unchanged} ligne${unchanged === 1 ? "" : "s"} inchangée${unchanged === 1 ? "" : "s"}`,
    },
    cronExpression: {
      input: "Expression Cron", placeholder: "ex. 0 9 * * 1-5", result: "Analyse", valid: "Expression valide",
      invalid: "Expression Cron invalide.", emptyResult: "Saisissez une expression pour voir son analyse.",
      expressionHint: "Format classique à 5 champs : minute, heure, jour du mois, mois, jour de la semaine.",
      nextRuns: "Prochaines exécutions", copy: "Copier", clear: "Effacer", reset: "Réinitialiser",
      fields: { minute: "Minute", hour: "Heure", dayOfMonth: "Jour du mois", month: "Mois", dayOfWeek: "Jour de la semaine" },
      examples: { everyMinute: "Chaque minute", everyWeekday: "À 9 h, du lundi au vendredi", midnight: "À minuit chaque jour" },
      descriptions: { everyMinute: "Chaque minute", everyHour: "Au début de chaque heure", midnight: "À minuit chaque jour", weekdayMorning: "À 9 h, du lundi au vendredi", custom: (expression) => `Planning personnalisé : ${expression}` },
    },
    videoBitrate: {
      mode: "Mode de calcul", duration: "Durée", hours: "Heures", minutes: "Minutes", seconds: "Secondes",
      hoursPlaceholder: "0", minutesPlaceholder: "0", secondsPlaceholder: "0",
      targetSize: "Taille cible", sizeUnit: "Unité de taille", sizePlaceholder: "Ex. 2", bitrate: "Bitrate total moyen", bitratePlaceholder: "Ex. 8", bitrateUnit: "Unité de débit",
      result: "Résultat", emptyResult: "Renseignez la durée et la valeur à calculer pour voir le résultat.",
      inputHint: "Les unités de taille et de débit sont décimales. Choisissez l’unité du bitrate pour éviter toute ambiguïté entre kbit/s, Mbit/s et Gbit/s.",
      invalid: "Impossible de calculer ce résultat avec les valeurs saisies.", invalidDuration: "La durée doit être supérieure à 0, avec 0 à 59 minutes et secondes.",
      invalidSize: "La taille cible doit être positive ou nulle.", invalidBitrate: "Le bitrate doit être positif ou nul.",
      bitrateResultNote: "Débit total moyen nécessaire pour atteindre la taille cible.", sizeResultNote: "Taille théorique du fichier à débit constant.",
      copy: "Copier", copied: "Copié", modes: { bitrate: { title: "Calculer le bitrate", description: "À partir d’une taille cible" }, size: { title: "Estimer la taille", description: "À partir du bitrate" } },
    },
    htmlPreviewer: {
      input: "Votre HTML", placeholder: "<h1>Bonjour</h1>\\n<p>Votre contenu…</p>",
      hint: "Le rendu est effectué localement dans une iframe isolée. JavaScript et ressources externes sont bloqués.",
      preview: "Aperçu", ready: "Aperçu mis à jour", emptyResult: "Saisissez du HTML pour afficher l’aperçu.", clear: "Effacer",
      security: "L’aperçu n’a pas accès au domaine Loculary et n’exécute pas le JavaScript du contenu.",
    },
    imageCompressor: {
      input: "Choisir une image", inputHint: "JPG, PNG, WebP ou autre image — traitement local dans votre navigateur.", format: "Format de sortie",
      maxDimension: "Dimension maximale", original: "Conserver la dimension", quality: "Qualité", qualityHint: "La qualité agit surtout sur JPEG et WebP.",
      processing: "Compression…", download: "Télécharger", reset: "Réinitialiser", preview: "Aperçu de l’image compressée",
      emptyResult: "Sélectionnez une image pour afficher le résultat.", invalid: "Cette image ne peut pas être traitée dans votre navigateur.",
      invalidType: "Sélectionnez un fichier image.", tooLarge: "Le fichier dépasse la limite de 25 Mo.",
      originalSize: "Taille originale", compressedSize: "Taille compressée", reduction: "Réduction",
    },
    qrCodeGenerator: {
      input: "Contenu à encoder", placeholder: "https://example.com ou votre texte…",
      hint: "Jusqu’à environ 100 octets. Le contenu reste dans votre navigateur.",
      size: "Taille", download: "Télécharger le SVG", clear: "Effacer", preview: "Aperçu du QR Code",
      emptyResult: "Saisissez un contenu pour générer votre QR Code.", tooLong: "Le contenu est trop long pour le format local pris en charge.",
      version: (version) => `Version ${version}`,
    },
    markdownTable: {
      table: "Tableau",
      hint: "Saisissez les en-têtes et les valeurs. Le Markdown et l’aperçu se mettent à jour automatiquement.",
      addColumn: "Ajouter une colonne", addRow: "Ajouter une ligne", removeColumn: "Supprimer une colonne", removeRow: "Supprimer une ligne", reset: "Réinitialiser",
      column: "Colonne", alignmentLabel: (column) => "Alignement de la colonne " + column,
      left: "Gauche", center: "Centré", right: "Droite", headerCell: "En-tête", bodyCell: "Cellule",
      markdown: "Markdown", outputHint: "Copiez ce résultat dans un README, une documentation ou un autre contenu Markdown.", preview: "Aperçu", copy: "Copier",
    },
    jwtDecoder: {
      input: "Votre JWT", placeholder: "Collez votre JSON Web Token ici…", decode: "Décoder", clear: "Effacer", header: "En-tête", payload: "Contenu", signature: "Signature encodée", copy: "Copier", invalid: "Le JWT est invalide ou mal formé.", signatureNote: "Le décodage ne vérifie pas la signature et ne confirme pas l’authenticité du token.",
    },
    hashGenerator: {
      input: "Votre texte", placeholder: "Saisissez ou collez votre texte…", algorithm: "Algorithme", generate: "Générer", generating: "Calcul…", clear: "Effacer", result: "Empreinte", complete: "Empreinte générée", emptyResult: "Le résultat apparaîtra ici après génération.", copy: "Copier", invalid: "Impossible de calculer cette empreinte.",
    },
    passwordGenerator: {
      length: "Longueur", characters: "Types de caractères", lowercase: "Minuscules", uppercase: "Majuscules", numbers: "Chiffres", symbols: "Symboles",
      excludeAmbiguous: "Exclure les caractères ambigus", generate: "Générer un mot de passe", result: "Mot de passe", emptyResult: "Générez un mot de passe pour l’afficher ici.", copy: "Copier", invalid: "Impossible de générer un mot de passe avec ces options.",
    },
    regexTester: {
      pattern: "Expression régulière", patternPlaceholder: "Ex. \\b\\d{4}\\b", flags: "Indicateurs", flagsHint: "g · i · m · s · u · y", input: "Texte à tester", inputPlaceholder: "Saisissez ou collez le texte à analyser…",
      test: "Tester", clear: "Effacer", invalid: "L’expression régulière ou les indicateurs sont invalides.", result: "Résultats", emptyResult: "Lancez un test pour afficher les correspondances.", noMatches: "Aucune correspondance trouvée.",
      matchCount: (count) => count === 1 ? "1 correspondance" : `${count} correspondances`, position: "Position", captures: "Groupes", namedGroups: "Groupes nommés", emptyMatch: "Correspondance vide", truncated: "Affichage limité aux 200 premières correspondances.", copy: "Copier les correspondances",
    },
    timezoneConverter: {
      dateTime: "Date et heure", source: "Fuseau source", destination: "Fuseau de destination",
      sourcePlaceholder: "Ex. Europe/Paris", destinationPlaceholder: "Ex. America/New_York",
      hint: "Les noms de fuseaux utilisent les identifiants IANA. La conversion tient compte des changements d’heure.",
      convert: "Convertir", result: "Résultat", converted: "Conversion effectuée",
      emptyResult: "Le résultat apparaîtra ici après conversion.",
      invalid: "Vérifiez la date, l’heure et les fuseaux horaires sélectionnés. Certaines heures n’existent pas pendant un changement d’heure.",
      ambiguous: "Cette heure locale apparaît deux fois à cause d’un changement d’heure. Loculary utilise la première occurrence.",
      sourceTime: "Heure source", destinationTime: "Heure convertie", sourceOffset: "Décalage source", destinationOffset: "Décalage de destination",
      copy: "Copier", clear: "Effacer", zonesHint: "Commencez à saisir un identifiant pour filtrer les fuseaux disponibles.",
    },
    xmlFormatterValidator: {
      input: "Votre XML", placeholder: "<catalog><item id=\"1\">Loculary</item></catalog>",
      output: "XML formaté", indentation: "Indentation", spaces2: "2 espaces", spaces4: "4 espaces", tab: "Tabulation",
      format: "Formater", validate: "Valider", copy: "Copier", clear: "Effacer", valid: "XML valide",
      invalid: "XML invalide", formatted: "Formatage terminé", emptyResult: "Saisissez du XML pour commencer.",
    },
    unixTimestamp: {
      timestampToDate: "Timestamp → date", dateToTimestamp: "Date → timestamp", timestamp: "Timestamp Unix",
      timestampPlaceholder: "Ex. 1710000000", timestampUnit: "Unité du timestamp", seconds: "secondes", milliseconds: "millisecondes",
      dateTime: "Date et heure", timestampHint: "Les timestamps en secondes sont courants sur Unix. Choisissez les millisecondes pour les valeurs JavaScript.",
      dateHint: "La date et l’heure sont interprétées dans votre fuseau horaire local.",
      convert: "Convertir", result: "Résultat", converted: "Conversion effectuée", localDate: "Heure locale",
      utcDate: "UTC", timestampResult: "Timestamp", emptyResult: "Le résultat apparaîtra ici après conversion.",
      invalid: "Saisissez une valeur de timestamp ou une date valide.", copy: "Copier", clear: "Effacer",
    },
    uuidGenerator: {
      count: "Nombre d’UUID", countPlaceholder: "Ex. 5", generate: "Générer", copy: "Copier", copied: "Copié", clear: "Effacer", result: "UUID générés",
      emptyResult: "Générez des UUID pour les afficher ici.", invalidCount: "Choisissez un nombre entier compris entre 1 et 50.", generatedOne: "1 UUID généré", generatedMany: (count) => `${count} UUID générés`,
    },
  },
  en: {
    colorConverter: {
      input: "Your color", picker: "Choose a color", placeholder: "#336699, rgb(51, 102, 153), or hsl(210, 50%, 40%)",
      hint: "Accepted formats: #RGB, #RRGGBB, rgb(...), and hsl(...).", reset: "Reset", preview: "Preview", previewDescription: "This color is processed locally in your browser.",
      result: "Conversions", copy: "Copy", copied: "Copied", invalid: "Enter a valid HEX, RGB, or HSL color.", emptyResult: "The result will appear here after conversion.",
    },
    colorPaletteGenerator: {
      input: "Starting color", picker: "Choose a color", placeholder: "#336699 or hsl(210, 50%, 40%)",
      hint: "Accepted formats: #RGB, #RRGGBB, rgb(...), and hsl(...).", reset: "Reset", basePreview: "Palette preview",
      analogous: "Analogous", complementary: "Complementary", triadic: "Triadic", splitComplementary: "Split-complementary", monochromatic: "Monochromatic",
      copy: "Copy", copied: "Copied", invalid: "Enter a valid HEX, RGB, or HSL color.",
    },
    contrastChecker: {
      foreground: "Text / foreground", background: "Background", colorHint: "Accepted formats: #RGB, #RRGGBB, or rgb(r, g, b).",
      swap: "Swap", reset: "Reset", preview: "Preview", previewText: "Sample text", previewDescription: "Use this preview to check how the contrast looks.",
      result: "Result", ratio: "Contrast ratio", normalText: "Normal text", largeText: "Large text",
      invalid: "Enter two valid colors.", thresholds: "AA: 4.5:1 for normal text and 3:1 for large text. AAA: 7:1 for normal text and 4.5:1 for large text.",
    },
    ipSubnetCalculator: {
      input: "IPv4 network (CIDR)", placeholder: "e.g. 192.168.1.42/24", result: "Result", ready: "Calculation updated", emptyResult: "The result will appear here after calculation.",
      invalid: "Enter a valid IPv4 address and prefix from /0 to /32.", clear: "Clear", reset: "Reset", copy: "Copy", hint: "Use IPv4 CIDR notation, such as 192.168.1.42/24. The calculation runs locally in your browser.",
      networkAddress: "Network address", broadcastAddress: "Broadcast address", subnetMask: "Subnet mask", wildcardMask: "Wildcard mask",
      firstUsableAddress: "First host address", lastUsableAddress: "Last host address", totalAddresses: "Total addresses", usableHosts: "Usable hosts",
      hostCountNote: "For /0 through /30, the network and broadcast addresses are excluded from the usable host count. /31 and /32 follow their special IPv4 usage.",
    },
    numberBaseConverter: {
      input: "Number to convert", placeholder: "e.g. FF", fromBase: "Source base", toBase: "Target base",
      result: "Result", emptyResult: "The result will appear here once you enter a number.",
      invalid: "Enter a valid integer for the selected base.", hint: "Bases 2 through 36 are supported. Letters A–Z represent digits 10–35.",
      reset: "Reset", swap: "Swap bases", copy: "Copy", copied: "Copied",
      baseLabel: (base) => "Base " + base,
    },

    fileSizeCalculator: {
      duration: "Duration", durationPlaceholder: "e.g. 10", durationUnit: "Duration unit",
      bitrate: "Bitrate", bitratePlaceholder: "e.g. 8", bitrateUnit: "Bitrate unit",
      sizeUnit: "Size unit",
      result: "Estimated size", note: "Theoretical estimate at a constant bitrate. Size and bitrate units are decimal.",
      invalid: "Enter a valid duration and bitrate, both 0 or greater.", emptyResult: "Enter the duration and bitrate to see the estimated size.",
    },
    age: {
      birthDate: "Birth date", referenceDate: "Calculate on", years: "Years", months: "Months", days: "Days",
      invalidRange: "The birth date must be on or before the reference date.", emptyResult: "Enter a birth date to see the calculated age.",
      summary: (years, months, days) => `You are ${years}, ${months}, and ${days} old.`,
      yearSingular: "year", yearPlural: "years", monthSingular: "month", monthPlural: "months", daySingular: "day", dayPlural: "days",
    },
    duration: {
      datesMode: "📅 Between two dates", timesMode: "🕐 Between two times", startDate: "Start date and time", endDate: "End date and time",
      startTime: "Start time", endTime: "End time", days: "Days", hours: "Hours", minutes: "Minutes",
      invalidRange: "The start date and time must be on or before the end date and time.", emptyResult: "Enter the dates or times to see the duration.",
      summaryDates: (days, hours, minutes) => `The duration is ${days}, ${hours}, and ${minutes}.`,
      summaryTimes: (hours, minutes) => `The duration is ${hours} and ${minutes}.`,
      overnight: "The calculation treats the end time as being on the following day.",
    },
    dateCalculator: {
      operation: "Operation", add: "Add", subtract: "Subtract", startDate: "Start date", amount: "Amount", unit: "Unit",
      result: "Resulting date", emptyResult: "The resulting date will appear here.", invalid: "Enter a valid date and a whole-number amount.",
      units: { days: "days", weeks: "weeks", months: "months", years: "years" },
      summary: (start, amount, unit, direction, result) => `Starting on ${start}, ${direction.toLowerCase()}ing ${amount} ${unit} gives ${result}.`,
    },
    percentage: {
      type: "Calculation type", result: "Result", how: "Show the calculation", formulaIntro: "Here is the calculation based on the values you entered:",
      differenceNote: "A percentage difference can exceed 100% when the two values are far apart. The result compares the gap with their average.",
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
      formulaIntroWithValues: "Here is the calculation based on the values you entered:", waitingResult: "Your result appears here once both values are filled in.", inputHint: "The result updates automatically as you change a value.", emptyResult: "Enter both values to see the result here.",
    },
    reduction: {
      price: "Initial price", discount: "Discount", discountedPrice: "Price after discount", saved: "Amount saved",
      placeholderPrice: "e.g. 150", placeholderDiscount: "e.g. 20", invalid: "Enter a positive price and a discount between 0 and 100%",
      emptyResult: "Enter the price and discount to see the result.", how: "Show the calculation", explanation: (amount) => `The discount represents €${amount} of the initial price.`,
    },
    ruleOfThree: {
      firstValue: "First value", correspondingValue: "Corresponding value", secondValue: "Second value", result: "Result",
      placeholders: { first: "e.g. 4", corresponding: "e.g. 10", second: "e.g. 6" },
      invalid: "Enter three valid numbers. The first value must be different from zero.", emptyResult: "Enter the three values to see the result.",
      how: "Show the calculation", explanation: "We keep the same ratio between the first two values to calculate the fourth.",
    },
    vat: {
      htToTtc: "Net → Gross", ttcToHt: "Gross → Net", priceHt: "Net price", priceTtc: "Gross price", rate: "VAT rate",
      resultHt: "Net price", vat: "VAT", resultTtc: "Gross price", placeholders: { ht: "e.g. 100", ttc: "e.g. 120", rate: "e.g. 20" },
      invalid: "Enter a price of at least 0 and a VAT rate between 0 and 100%.", emptyResult: "Enter the values to see the VAT calculation.",
      how: "Show the calculation", explanation: (rate, vat) => `At a ${rate}% rate, VAT is €${vat}.`,
    },
    fileSize: {
      value: "Value to convert", from: "From unit", to: "To unit", result: "Result", placeholder: "e.g. 1.5",
      invalid: "Enter a value that is 0 or greater.", emptyResult: "Enter a value to see the conversion.",
    },
    downloadTime: {
      fileSize: "File size", sizeUnit: "File size unit", speed: "Download speed", speedUnit: "Download speed unit",
      placeholderSize: "e.g. 10", placeholderSpeed: "e.g. 100", estimated: "Estimated time", seconds: (value) => `About ${value} seconds.`,
      note: "Theoretical estimate at a constant rate. Size and speed units are decimal.",
      invalid: "Enter a valid file size and a speed greater than 0.",
    },
    downloadSpeed: {
      value: "Speed to convert", from: "From unit", to: "To unit", result: "Result", placeholder: "e.g. 100",
      invalid: "Enter a speed that is 0 or greater.", emptyResult: "Enter a speed to see the conversion.",
    },
    textCounter: {
      input: "Your text", placeholder: "Type or paste your text here…", characters: "Characters",
      charactersWithoutSpaces: "Characters without spaces", words: "Words", spaces: "Spaces", lines: "Lines", clear: "Clear", copyStats: "Copy statistics",
    },
    textCaseConverter: {
      input: "Your text", placeholder: "Type or paste your text here…", mode: "Transform to", result: "Result", ready: "Transformation updated", emptyResult: "The result will appear here.", copy: "Copy", clear: "Clear",
      modes: { uppercase: "UPPERCASE", lowercase: "lowercase", title: "Title Case", camel: "camelCase", pascal: "PascalCase", snake: "snake_case", kebab: "kebab-case" },
    },
    unitConverter: {
      value: "Value to convert", category: "Category", from: "From", to: "To", result: "Result", placeholder: "e.g. 1.5", invalid: "Enter a valid value that is compatible with the selected unit.",
      emptyResult: "Enter a value to see the conversion.", copy: "Copy", swap: "Swap units", hint: "The conversion is calculated locally in your browser.",
      categories: { length: "Length", mass: "Mass", temperature: "Temperature", volume: "Volume", area: "Area" },
    },
    jsonFormatter: {
      input: "Your JSON", placeholder: '{\\n  "name": "Loculary"\\n}', output: "Result", format: "Format", minify: "Minify", copy: "Copy", clear: "Clear",
      indentation: "Indentation", spaces2: "2 spaces", spaces4: "4 spaces", tab: "Tab", valid: "Valid JSON", invalid: "Invalid JSON",
      emptyResult: "The result will appear here after validation.", formatted: "Formatted", minified: "Minified", errorAt: (line, column) => "Line " + line + ", column " + column,
    },
    yamlFormatterValidator: {
      input: "Your YAML", placeholder: "name: Loculary\\ntools:\\n  - JSON\\n  - YAML", output: "Result", format: "Format", copy: "Copy", clear: "Clear",
      indentation: "Indentation", spaces2: "2 spaces", spaces4: "4 spaces", tab: "Tab", valid: "Valid YAML", invalid: "Invalid YAML",
      emptyResult: "The result will appear here after validation.", formatted: "Formatted", resourceLimit: "The document is too large or complex to process safely.",
      errorAt: (line, column) => "Line " + line + ", column " + column,
    },
    urlEncoder: {
      input: "Your text", placeholder: "Enter text or a URL…", output: "Result", scope: "Encoding mode", component: "URL component", uri: "Complete URL",
      operation: "Action", encode: "Encode", decode: "Decode", copy: "Copy", clear: "Clear", encoded: "Encoded", decoded: "Decoded",
      emptyResult: "The result will appear here after transformation.", error: "The transformation could not be completed.", invalidEncoding: "The URL encoding is invalid.", invalidText: "The text contains a character that cannot be encoded.",
    },
    urlParser: {
      input: "Your URL", placeholder: "https://example.com/path?lang=en#section", result: "Analysis", ready: "URL parsed", emptyResult: "The result will appear here after parsing.", invalid: "Enter a valid absolute URL.",
      clear: "Clear", copy: "Copy URL", hint: "Parsing happens locally in your browser. No external service is used.", emptyValue: "—",
      queryParameters: "Query parameters", noQueryParameters: "No query parameters.", protocol: "Protocol", origin: "Origin", username: "Username",
      host: "Host", hostname: "Hostname", port: "Port", pathname: "Path", search: "Query", hash: "Fragment",
    },
    base64: {
      input: "Your text", placeholder: "Enter text to encode or a Base64 string to decode…", output: "Result", encode: "Encode", decode: "Decode", copy: "Copy", clear: "Clear",
      encoded: "Base64 encoded", decoded: "Decoded", emptyResult: "The result will appear here after transformation.", error: "The transformation could not be completed.", invalidBase64: "The Base64 string is invalid or does not contain valid UTF-8 text.", invalidText: "The text could not be encoded.",
    },
    htmlEntityEncoder: {
      input: "Your text", placeholder: "Enter HTML or text to transform…", operation: "Action", encode: "Encode", decode: "Decode",
      result: "Result", ready: "Transformation updated", emptyResult: "The result will appear here.", copy: "Copy", clear: "Clear",
    },
    jsonToTypeScript: {
      input: "Your JSON", placeholder: "Paste a JSON object or array…", rootName: "Root type name", rootPlaceholder: "Root", generate: "Generate",
      result: "Generated TypeScript", ready: "Generation complete", emptyResult: "Generated TypeScript will appear here.", copy: "Copy", clear: "Clear", error: "The JSON could not be converted.",
      invalidJson: "The JSON is invalid.", unsupportedRoot: "Use a JSON object or array as the root value.",
    },
    csvJson: {
      input: "Data", placeholder: "Paste CSV or a JSON array of objects…", delimiter: "CSV delimiter", csvToJson: "CSV → JSON", jsonToCsv: "JSON → CSV",
      result: "Result", ready: "Conversion updated", emptyResult: "The result will appear here.", copy: "Copy", clear: "Clear", error: "The conversion could not be completed.",
      invalidCsv: "The CSV is invalid or malformed.", invalidJson: "The JSON is invalid.", unsupportedJson: "Use a JSON array containing objects.",
    },
    cronExpression: {
      input: "Cron expression", placeholder: "e.g. 0 9 * * 1-5", result: "Analysis", valid: "Valid expression",
      invalid: "Invalid Cron expression.", emptyResult: "Enter an expression to see its schedule.",
      expressionHint: "Classic 5-field format: minute, hour, day of month, month, day of week.",
      nextRuns: "Next runs", copy: "Copy", clear: "Clear", reset: "Reset",
      fields: { minute: "Minute", hour: "Hour", dayOfMonth: "Day of month", month: "Month", dayOfWeek: "Day of week" },
      examples: { everyMinute: "Every minute", everyWeekday: "At 9 AM, Monday through Friday", midnight: "At midnight every day" },
      descriptions: { everyMinute: "Every minute", everyHour: "At the start of every hour", midnight: "At midnight every day", weekdayMorning: "At 9 AM, Monday through Friday", custom: (expression) => `Custom schedule: ${expression}` },
    },
    textDiffChecker: {
      original: "Original version", originalPlaceholder: "Paste the original text…", updated: "Updated version", updatedPlaceholder: "Paste the updated text…",
      result: "Comparison", emptyResult: "Paste two versions to see the differences.", resourceLimit: "The texts are too large to compare safely.", copy: "Copy diff", clear: "Clear", reset: "Reset",
      summary: (added, removed, unchanged) => `+${added} addition${added === 1 ? "" : "s"} · -${removed} removal${removed === 1 ? "" : "s"} · ${unchanged} unchanged line${unchanged === 1 ? "" : "s"}`,
    },
    videoBitrate: {
      mode: "Calculation mode", duration: "Duration", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      hoursPlaceholder: "0", minutesPlaceholder: "0", secondsPlaceholder: "0",
      targetSize: "Target size", sizeUnit: "Size unit", sizePlaceholder: "e.g. 2", bitrate: "Average total bitrate", bitratePlaceholder: "e.g. 8", bitrateUnit: "Bitrate unit",
      result: "Result", emptyResult: "Enter the duration and value to calculate the result.",
      inputHint: "Size and bitrate units are decimal. Choose the bitrate unit to distinguish kbps, Mbps, and Gbps.",
      invalid: "This result cannot be calculated from the values entered.", invalidDuration: "Duration must be greater than 0, with minutes and seconds from 0 to 59.",
      invalidSize: "Target size must be 0 or greater.", invalidBitrate: "Bitrate must be 0 or greater.",
      bitrateResultNote: "Average total bitrate required to reach the target size.", sizeResultNote: "Theoretical file size at a constant bitrate.",
      copy: "Copy", copied: "Copied", modes: { bitrate: { title: "Calculate bitrate", description: "From a target size" }, size: { title: "Estimate size", description: "From a bitrate" } },
    },
    htmlPreviewer: {
      input: "Your HTML", placeholder: "<h1>Hello</h1>\\n<p>Your content…</p>",
      hint: "Rendering happens locally in an isolated iframe. JavaScript and external resources are blocked.",
      preview: "Preview", ready: "Preview updated", emptyResult: "Enter HTML to display the preview.", clear: "Clear",
      security: "The preview cannot access the Loculary origin and does not execute JavaScript from the content.",
    },
    imageCompressor: {
      input: "Choose an image", inputHint: "JPG, PNG, WebP, or another image — processed locally in your browser.", format: "Output format",
      maxDimension: "Maximum dimension", original: "Keep original size", quality: "Quality", qualityHint: "Quality mainly affects JPEG and WebP.",
      processing: "Compressing…", download: "Download", reset: "Reset", preview: "Compressed image preview",
      emptyResult: "Select an image to see the result.", invalid: "This image cannot be processed in your browser.",
      invalidType: "Select an image file.", tooLarge: "The file exceeds the 25 MB limit.",
      originalSize: "Original size", compressedSize: "Compressed size", reduction: "Reduction",
    },
    qrCodeGenerator: {
      input: "Content to encode", placeholder: "https://example.com or your text…",
      hint: "Up to roughly 100 bytes. Your content stays in your browser.",
      size: "Size", download: "Download SVG", clear: "Clear", preview: "QR Code preview",
      emptyResult: "Enter content to generate your QR Code.", tooLong: "The content is too long for the supported local format.",
      version: (version) => "Version " + version,
    },
    markdownTable: {
      table: "Table",
      hint: "Enter headers and values. The Markdown and preview update automatically.",
      addColumn: "Add column", addRow: "Add row", removeColumn: "Remove column", removeRow: "Remove row", reset: "Reset",
      column: "Column", alignmentLabel: (column) => "Column " + column + " alignment",
      left: "Left", center: "Center", right: "Right", headerCell: "Header", bodyCell: "Cell",
      markdown: "Markdown", outputHint: "Copy this result into a README, documentation, or other Markdown content.", preview: "Preview", copy: "Copy",
    },
    jwtDecoder: {
      input: "Your JWT", placeholder: "Paste your JSON Web Token here…", decode: "Decode", clear: "Clear", header: "Header", payload: "Payload", signature: "Encoded signature", copy: "Copy", invalid: "The JWT is invalid or malformed.", signatureNote: "Decoding does not verify the signature or confirm that the token is authentic.",
    },
    hashGenerator: {
      input: "Your text", placeholder: "Type or paste your text…", algorithm: "Hash algorithm", generate: "Generate", generating: "Hashing…", clear: "Clear", result: "Digest", complete: "Digest generated", emptyResult: "The result will appear here after generation.", copy: "Copy", invalid: "The digest could not be generated.",
    },
    passwordGenerator: {
      length: "Length", characters: "Character types", lowercase: "Lowercase", uppercase: "Uppercase", numbers: "Numbers", symbols: "Symbols",
      excludeAmbiguous: "Exclude ambiguous characters", generate: "Generate password", result: "Password", emptyResult: "Generate a password to display it here.", copy: "Copy", invalid: "A password could not be generated with these options.",
    },
    regexTester: {
      pattern: "Regular expression", patternPlaceholder: "e.g. \\b\\d{4}\\b", flags: "Flags", flagsHint: "g · i · m · s · u · y", input: "Test text", inputPlaceholder: "Type or paste text to analyze…",
      test: "Test", clear: "Clear", invalid: "The regular expression or flags are invalid.", result: "Results", emptyResult: "Run a test to display matches.", noMatches: "No matches found.",
      matchCount: (count) => count === 1 ? "1 match" : `${count} matches`, position: "Position", captures: "Captures", namedGroups: "Named groups", emptyMatch: "Empty match", truncated: "Showing only the first 200 matches.", copy: "Copy matches",
    },
    timezoneConverter: {
      dateTime: "Date and time", source: "Source time zone", destination: "Destination time zone",
      sourcePlaceholder: "e.g. Europe/Paris", destinationPlaceholder: "e.g. America/New_York",
      hint: "Time zone names use IANA identifiers. The conversion accounts for daylight-saving changes.",
      convert: "Convert", result: "Result", converted: "Conversion complete",
      emptyResult: "The result will appear here after conversion.",
      invalid: "Check the date, time, and time zones. Some local times do not exist during a time-zone transition.",
      ambiguous: "This local time occurs twice because of a time-zone transition. Loculary uses the first occurrence.",
      sourceTime: "Source time", destinationTime: "Converted time", sourceOffset: "Source offset", destinationOffset: "Destination offset",
      copy: "Copy", clear: "Clear", zonesHint: "Start typing an identifier to filter the available time zones.",
    },
    xmlFormatterValidator: {
      input: "Your XML", placeholder: "<catalog><item id=\"1\">Loculary</item></catalog>",
      output: "Formatted XML", indentation: "Indentation", spaces2: "2 spaces", spaces4: "4 spaces", tab: "Tab",
      format: "Format", validate: "Validate", copy: "Copy", clear: "Clear", valid: "Valid XML",
      invalid: "Invalid XML", formatted: "Formatting complete", emptyResult: "Enter XML to get started.",
    },
    unixTimestamp: {
      timestampToDate: "Timestamp → date", dateToTimestamp: "Date → timestamp", timestamp: "Unix timestamp",
      timestampPlaceholder: "e.g. 1710000000", timestampUnit: "Timestamp unit", seconds: "seconds", milliseconds: "milliseconds",
      dateTime: "Date and time", timestampHint: "Seconds are the common Unix timestamp unit. Choose milliseconds for JavaScript timestamp values.",
      dateHint: "The date and time are interpreted in your local time zone.",
      convert: "Convert", result: "Result", converted: "Conversion complete", localDate: "Local time",
      utcDate: "UTC", timestampResult: "Timestamp", emptyResult: "The result will appear here after conversion.",
      invalid: "Enter a valid timestamp or date.", copy: "Copy", clear: "Clear",
    },
    uuidGenerator: {
      count: "Number of UUIDs", countPlaceholder: "e.g. 5", generate: "Generate", copy: "Copy", copied: "Copied", clear: "Clear", result: "Generated UUIDs",
      emptyResult: "Generate UUIDs to see them here.", invalidCount: "Choose a whole number between 1 and 50.", generatedOne: "1 UUID generated", generatedMany: (count) => `${count} UUIDs generated`,
    },
  },
};

export function getToolMessages(locale: Locale): ToolMessages {
  return toolMessages[locale];
}
