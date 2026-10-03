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
  jsonFormatter: {
    input: string; placeholder: string; output: string; format: string; minify: string; copy: string; clear: string;
    indentation: string; spaces2: string; spaces4: string; tab: string; valid: string; invalid: string;
    emptyResult: string; formatted: string; minified: string; errorAt: (line: string, column: string) => string;
  };
  urlEncoder: {
    input: string; placeholder: string; output: string; scope: string; component: string; uri: string;
    operation: string; encode: string; decode: string; copy: string; clear: string; encoded: string; decoded: string;
    emptyResult: string; error: string; invalidEncoding: string; invalidText: string;
  };
  base64: {
    input: string; placeholder: string; output: string; encode: string; decode: string; copy: string; clear: string;
    encoded: string; decoded: string; emptyResult: string; error: string; invalidBase64: string; invalidText: string;
  };
  uuidGenerator: {
    count: string; countPlaceholder: string; generate: string; copy: string; copied: string; clear: string; result: string;
    emptyResult: string; invalidCount: string; generatedOne: string; generatedMany: (count: number) => string;
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
    colorPaletteGenerator: {
      input: "Starting color", picker: "Choose a color", placeholder: "#336699 or hsl(210, 50%, 40%)",
      hint: "Accepted formats: #RGB, #RRGGBB, rgb(...), and hsl(...).", reset: "Reset", basePreview: "Palette preview",
      analogous: "Analogous", complementary: "Complementary", triadic: "Triadic", splitComplementary: "Split-complementary", monochromatic: "Monochromatic",
      copy: "Copy", copied: "Copied", invalid: "Enter a valid HEX, RGB, or HSL color.",
    },
    contrastChecker: {
      foreground: "Texte / premier plan", background: "Arrière-plan", colorHint: "Formats acceptés : #RGB, #RRGGBB ou rgb(r, g, b).",
      swap: "Inverser", reset: "Réinitialiser", preview: "Aperçu", previewText: "Exemple de texte", previewDescription: "Utilisez cet aperçu pour vérifier le rendu du contraste.",
      result: "Résultat", ratio: "Ratio de contraste", normalText: "Texte courant", largeText: "Grand texte",
      invalid: "Saisissez deux couleurs valides.", thresholds: "AA : 4,5:1 pour le texte courant et 3:1 pour le grand texte. AAA : 7:1 pour le texte courant et 4,5:1 pour le grand texte.",
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
    jsonFormatter: {
      input: "Votre JSON", placeholder: '{\\n  "name": "Loculary"\\n}', output: "Résultat", format: "Formater", minify: "Minifier", copy: "Copier", clear: "Effacer",
      indentation: "Indentation", spaces2: "2 espaces", spaces4: "4 espaces", tab: "Tabulation", valid: "JSON valide", invalid: "JSON invalide",
      emptyResult: "Le résultat apparaîtra ici après validation.", formatted: "Formaté", minified: "Minifié", errorAt: (line, column) => "Ligne " + line + ", colonne " + column,
    },
    urlEncoder: {
      input: "Votre texte", placeholder: "Saisissez du texte ou une URL…", output: "Résultat", scope: "Mode d’encodage", component: "Composant d’URL", uri: "URL complète",
      operation: "Action", encode: "Encoder", decode: "Décoder", copy: "Copier", clear: "Effacer", encoded: "Encodé", decoded: "Décodé",
      emptyResult: "Le résultat apparaîtra ici après transformation.", error: "La transformation n’a pas pu être effectuée.", invalidEncoding: "L’encodage URL est invalide.", invalidText: "Le texte contient un caractère qui ne peut pas être encodé.",
    },
    base64: {
      input: "Votre texte", placeholder: "Saisissez du texte à encoder ou une chaîne Base64 à décoder…", output: "Résultat", encode: "Encoder", decode: "Décoder", copy: "Copier", clear: "Effacer",
      encoded: "Encodé en Base64", decoded: "Décodé", emptyResult: "Le résultat apparaîtra ici après transformation.", error: "La transformation n’a pas pu être effectuée.", invalidBase64: "La chaîne Base64 est invalide ou ne contient pas de texte UTF-8 valide.", invalidText: "Le texte ne peut pas être encodé.",
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
    contrastChecker: {
      foreground: "Text / foreground", background: "Background", colorHint: "Accepted formats: #RGB, #RRGGBB, or rgb(r, g, b).",
      swap: "Swap", reset: "Reset", preview: "Preview", previewText: "Sample text", previewDescription: "Use this preview to check how the contrast looks.",
      result: "Result", ratio: "Contrast ratio", normalText: "Normal text", largeText: "Large text",
      invalid: "Enter two valid colors.", thresholds: "AA: 4.5:1 for normal text and 3:1 for large text. AAA: 7:1 for normal text and 4.5:1 for large text.",
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
    jsonFormatter: {
      input: "Your JSON", placeholder: '{\\n  "name": "Loculary"\\n}', output: "Result", format: "Format", minify: "Minify", copy: "Copy", clear: "Clear",
      indentation: "Indentation", spaces2: "2 spaces", spaces4: "4 spaces", tab: "Tab", valid: "Valid JSON", invalid: "Invalid JSON",
      emptyResult: "The result will appear here after validation.", formatted: "Formatted", minified: "Minified", errorAt: (line, column) => "Line " + line + ", column " + column,
    },
    urlEncoder: {
      input: "Your text", placeholder: "Enter text or a URL…", output: "Result", scope: "Encoding mode", component: "URL component", uri: "Complete URL",
      operation: "Action", encode: "Encode", decode: "Decode", copy: "Copy", clear: "Clear", encoded: "Encoded", decoded: "Decoded",
      emptyResult: "The result will appear here after transformation.", error: "The transformation could not be completed.", invalidEncoding: "The URL encoding is invalid.", invalidText: "The text contains a character that cannot be encoded.",
    },
    base64: {
      input: "Your text", placeholder: "Enter text to encode or a Base64 string to decode…", output: "Result", encode: "Encode", decode: "Decode", copy: "Copy", clear: "Clear",
      encoded: "Base64 encoded", decoded: "Decoded", emptyResult: "The result will appear here after transformation.", error: "The transformation could not be completed.", invalidBase64: "The Base64 string is invalid or does not contain valid UTF-8 text.", invalidText: "The text could not be encoded.",
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
