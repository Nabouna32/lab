# Audit des usages React/Web — Compose UI Text

## Périmètre et méthode

Audit ciblé des consommateurs directs des composants de saisie partagés recensés dans la revue [Compose UI Text 1.12.1](compose-ui-text-1.12.1.md) et de l'adaptateur Material 3 OutlinedTextField. L'objectif est de distinguer les usages produit des démonstrations et les composants HTML natifs des adaptations Web.

- Référence AndroidX : Compose UI Text 1.12.1, commit `5e0747401bf56b243e3b5141ae080dc9bc61d29c`.
- Dépôt examiné : branche `main` après fusion de la PR #1076.
- Méthode : analyse AST TypeScript des 423 fichiers `.ts`/`.tsx` suivis par Git. Le parcours associe les imports nommés (y compris les alias) aux balises JSX : 16 fichiers/21 instances `TextField`, 20 fichiers/23 instances `TextArea`, deux fichiers/quatre instances `OutlinedSecureTextField` (trois dans le formulaire de changement de mot de passe et une dans le Design Lab). `OutlinedTextField` est la base interne de `OutlinedSecureTextField` et n'a pas de consommateur direct supplémentaire. La recherche des balises natives confirme un seul `textarea` indépendant dans `HashGenerator`. Les implémentations et leurs consommateurs pertinents ont ensuite été relus.
- Limite d'inventaire : cette analyse couvre les imports directs et leurs usages JSX dans les fichiers suivis ; elle ne prétend pas détecter les compositions indirectes ou créations dynamiques hors de ce contrat.
- Tests comportementaux : huit tests DOM montent `TextField`, `TextArea`, `OutlinedTextField` et `OutlinedSecureTextField` avec React 19 et happy-dom 21.0.4. Ils couvrent labels/IDs, descriptions ARIA, erreurs/aides, changements contrôlés, compteur, désactivation et révélation.
- Validation Chromium headless en Production : connexion et compteur FR/EN ; `OutlinedSecureTextField` dans le Design Lab public FR/EN ; viewports 320, 360, 390, 768, 1024, 1440 et 1920 CSS px ; transitions erreur/valide, association `aria-describedby`, état `aria-invalid`, arbre d'accessibilité Chromium, ordre clavier, focus tactile simulé, thèmes clair/sombre et `prefers-reduced-motion`. Aucun débordement horizontal ni erreur JavaScript/console observé.
- Simulation de composition IME via le protocole Chromium sur le `TextArea` contrôlé du compteur : événements `compositionstart`/`compositionupdate`/`compositionend`, composition intermédiaire « にほん », validation « 日本 » et compteur actualisé de 3 à 2 caractères. Cette simulation navigateur ne remplace pas un clavier IME réel.
- Audit axe-core 4.14.0 du Design Lab FR/EN avec les tags WCAG 2.0/2.1 A/AA et WCAG 2.2 AA : zéro violation détectée ; un résultat `color-contrast` reste incomplet sur la galerie et demande une revue manuelle. Sur le seul `MaterialTextField`, 11 règles passent sans violation ni résultat incomplet en thème clair comme sombre. Ce contrôle ciblé ne vaut pas déclaration de conformité globale WCAG.

## Résultats de l'inventaire

### TextField — champ mono-ligne

16 fichiers consommateurs directs ont été retrouvés (21 instances JSX) :

| Zone | Fichiers |
|---|---|
| Compte et administration | `src/app/[locale]/compte/connexion/page.tsx`, `inscription/page.tsx`, `email/page.tsx`, `suppression/page.tsx`, `informations-personnelles/page.tsx`, `src/app/[locale]/admin/utilisateurs/page.tsx` |
| Outils | `src/components/tools/calculator/CalculatorField.tsx`, `regex-tester/RegexTester.tsx`, `uuid/UuidGenerator.tsx`, `color-converter/ColorConverter.tsx`, `ipv6-subnet-calculator/Ipv6SubnetCalculator.tsx`, `number-base-converter/NumberBaseConverter.tsx`, `contrast-checker/ContrastChecker.tsx`, `ip-subnet-calculator/IpSubnetCalculator.tsx`, `color-palette-generator/ColorPaletteGenerator.tsx` |
| Démonstration | `src/app/[locale]/design-lab/VisualLab.tsx` |

Le test `src/lib/design-system/material-components.test.mjs` contient également des assertions de contrat, pas des consommateurs runtime.

Les usages couvrent des formulaires d'authentification et de profil, des entrées numériques, des paramètres d'outils et des champs de démonstration. `CalculatorField` est un wrapper qui délègue à `TextField`, et non un second moteur de saisie. L'identifiant est exclusivement piloté par `inputId` : les props HTML ne peuvent pas fournir un second `id` susceptible de désynchroniser le contrôle et son label.

### TextArea — champ multiligne Web

20 fichiers utilisent directement le composant (23 instances JSX) :

- Outils : `text-counter/TextCounter.tsx`, `html-previewer/HtmlPreviewer.tsx`, `base64/Base64Encoder.tsx`, `jwt-decoder/JwtDecoder.tsx`, `text-diff-checker/TextDiffChecker.tsx`, `url-parser/UrlParser.tsx`, `url-encoder/UrlEncoder.tsx`, `csv-diff-checker/CsvDiffChecker.tsx`, `regex-tester/RegexTester.tsx`, `html-entity-encoder/HtmlEntityEncoder.tsx`, `text-case-converter/TextCaseConverter.tsx`, `json-to-typescript/JsonToTypeScript.tsx`, `csv-json/CsvJsonConverter.tsx`, `json-formatter/JsonFormatter.tsx`, `json-diff-checker/JsonDiffChecker.tsx`, `text-line-processor/TextLineProcessor.tsx`, `qr-code-generator/QrCodeGenerator.tsx`, `xml-formatter-validator/XMLFormatterValidator.tsx`, `yaml-formatter-validator/YamlFormatterValidator.tsx`.
- Démonstration : `src/app/[locale]/design-lab/VisualLab.tsx`.

Un autre résultat de recherche, `src/components/tools/hash-generator/HashGenerator.tsx`, utilise un `textarea` HTML natif directement : il ne consomme pas `TextArea`. Ce choix est à examiner séparément avant toute centralisation ; aucune migration n'est justifiée par le seul fait qu'un wrapper existe. Comme pour `TextField`, `inputId` est la source unique de l'association label/contrôle ; un `id` concurrent est exclu du contrat de props et ne peut pas remplacer l'identifiant transmis au DOM.

### OutlinedTextField et OutlinedSecureTextField — adaptations Material 3 contrôlées

`OutlinedTextField` est l'adaptation Web du composant AndroidX Material 3 `OutlinedTextField` : label flottant, contour, supporting text, erreur, compteur, préfixe/suffixe et contenus leading/trailing. Le choix d'un contour est explicite dans le nom du composant ; la variante `filled`, sans consommateur, a été supprimée.

`OutlinedSecureTextField` compose cette base avec un input natif `password`/`text` et un `IconButton` de visibilité. Deux consommateurs directs sont retrouvés : `src/components/account/PasswordChangeForm.tsx` (trois instances) et `src/app/[locale]/design-lab/VisualLab.tsx` (un spécimen).

## Contrats observés dans le code

### TextField

- S'appuie sur un véritable `input` HTML et un `label` associé par `htmlFor`/`id`.
- Préserve les attributs natifs transmis par les consommateurs (nom, type, contraintes, autocomplétion, valeur et gestionnaire de changement).
- Conserve un label persistant au-dessus du champ. La variante `expressive`, sans consommateur runtime, a été supprimée : ce composant reste un helper Web léger fondé sur un `input` natif, et non une implémentation concurrente d'AndroidX OutlinedTextField.
- Définit `inputMode=decimal` par défaut pour `type=number` et `step=any` si aucun pas n'est fourni.
- `CalculatorField` conserve une fine couche métier pour le champ et son unité, sans remplacer le contrôle natif.

### TextArea

- S'appuie sur un véritable `textarea` HTML, un label associé, `rows`, le redimensionnement natif et les attributs de saisie.
- Est explicitement documenté comme une adaptation Web multiligne du cas d'usage Material 3 TextField ; AndroidX n'expose pas un composant Material 3 autonome nommé `TextArea`.
- Expose les props `helperText` et `error`, mais les consommateurs retrouvés ne justifient pas encore une abstraction plus riche ou un éditeur personnalisé.
- Le composant extrait les attributs `aria-describedby` et `aria-invalid` fournis par le consommateur. Il fusionne les IDs de description externes avec l'ID interne du message d'erreur ou d'aide, déduplique les références et conserve les autres attributs HTML natifs. Une erreur interne force `aria-invalid=true` ; en l'absence d'erreur, la valeur explicite du consommateur est préservée. Le correctif est couvert par un test de contrat source et les tests DOM rendus ; la validation lecteur d'écran reste nécessaire.

### OutlinedTextField

- Est un champ React contrôlé, à label flottant, avec supporting text, erreur, compteur, préfixe/suffixe et contenu auxiliaire.
- Est la base interne de `OutlinedSecureTextField` ; aucun consommateur direct supplémentaire ne justifie une variante filled.
- `OutlinedSecureTextField` est la composition sécurisée dédiée ; la révélation reste limitée aux champs qui ont réellement besoin de ce comportement.
- Référence source : AndroidX Material 3 1.4.0, commit `5113b82a4ed6416d6344efa50e41db8cb65928ff` ; l'exemple `PasswordTextField()` de [TextFieldSamples.kt](https://github.com/androidx/androidx/blob/5113b82a4ed6416d6344efa50e41db8cb65928ff/compose/material3/material3/samples/src/main/java/androidx/compose/material3/samples/TextFieldSamples.kt) combine `SecureTextField`, `IconButton`, les icônes Visibility/VisibilityOff et une description accessible localisée.
- Le contrôle de visibilité utilise le composant partagé `IconButton` et les Material Symbols `visibility`/`visibility_off`, avec des libellés accessibles localisés via `Messages.account.showPassword` et `hidePassword`. La cible d'interaction est de 48 × 48 px et le bouton hérite de l'état désactivé du champ.
- L'adaptation Web bascule l'élément natif entre `type=password` et `type=text`, tout en conservant `autocomplete=current-password/new-password`, la désactivation de la correction orthographique et la casse automatique. Elle ne revendique pas la parité complète avec AndroidX `OutlinedSecureTextField` : la révélation du dernier caractère saisi et les restrictions natives sur les actions de presse-papiers ne sont pas reproduites.
- `OutlinedTextField` est un adaptateur Web documenté du contrat AndroidX ; `OutlinedSecureTextField` est une composition Web explicitement limitée aux besoins de révélation du mot de passe.

## Décisions

1. Garder `TextField` et `TextArea` fondés sur les éléments HTML natifs : les usages recensés portent sur de la saisie, du texte technique, du collage et des formulaires, pour lesquels les comportements du navigateur/OS sont une base plus robuste qu'un moteur personnalisé.
2. Ne pas remplacer le `textarea` natif de HashGenerator sans vérifier les besoins propres à cet outil ; il n'y a pas de gain démontré à uniformiser mécaniquement.
3. Conserver `CalculatorField` comme composition légère tant que son unité et ses contraintes restent spécifiques au calcul.
4. Garder `OutlinedTextField` comme adaptation dédiée du composant AndroidX et `OutlinedSecureTextField` comme composition sécurisée ; ne pas réintroduire une variante filled ou un composant de saisie générique concurrent sans consommateur et contrat source démontrés.
5. Fusionner les IDs de `aria-describedby` fournis par le consommateur avec l'association interne `error`/`helperText`, en dédupliquant les IDs et en donnant priorité à une erreur réelle pour `aria-invalid`. Correction livrée par #1079 ; CI #4593 réussie sur le head exact, avec test de contrat source.
6. Réserver la révélation du mot de passe à `OutlinedSecureTextField`. Ses libellés restent localisés et son action utilise le composant partagé `IconButton`. Ne pas généraliser ce comportement à tous les champs et ne pas prétendre à la parité complète avec AndroidX `OutlinedSecureTextField`.

## Vérifications restantes

- [x] Rechercher les JSX des trois composants et les imports directs depuis leurs modules.
- [x] Relire les quatre implémentations, la feuille CSS de OutlinedTextField, le formulaire de mot de passe, le Design Lab et les tests de composants Material.
- [x] Distinguer le composant de démonstration, les consommateurs runtime et le textarea natif distinct.
- [x] Analyser les imports directs et usages JSX avec l'AST TypeScript dans les 423 fichiers suivis ; les alias d'import sont pris en compte.
- [x] Ajouter un test de contrat source pour la fusion des descriptions accessibles de `TextArea` (#1079).
- [x] Verrouiller le contrat d'identifiant unique `inputId` de `TextField`, `TextArea` et `CalculatorField` avec un test de contrat source.
- [x] Ajouter huit tests DOM pour les associations ARIA, erreurs/aides, saisie contrôlée, compteur, états désactivés et révélation sécurisée.
- [x] Vérifier en Chromium headless Production les parcours de connexion et compteur FR/EN, `OutlinedSecureTextField` dans le Design Lab public, les viewports 320–1920 CSS px, les états erreur/valide, labels/ARIA, ordre clavier, focus tactile simulé, thèmes clair/sombre et réduction des animations.
- [x] Simuler la composition IME sur le `TextArea` contrôlé du compteur avec Chromium CDP ; la valeur composée puis validée et le compteur sont cohérents. Un essai avec un clavier IME réel reste nécessaire.
- [x] Exécuter axe-core 4.14.0 sur le Design Lab FR/EN : aucune violation WCAG 2.0/2.1 A/AA ou 2.2 AA détectée ; un résultat `color-contrast` est incomplet et nécessite une revue manuelle.
- [ ] Vérifier la composition IME réelle, le tactile sur appareil physique et les annonces avec un lecteur d'écran réel ; demande d'action dédiée #1091.
- [x] Vérifier le reflow à 320 CSS px en Production. RTL est hors périmètre tant que seules les locales FR/EN sont prises en charge.

Le correctif ARIA de `TextArea` est fusionné dans #1079. La correction d'identifiant unique `inputId` est livrée dans #1080 ; CI #4594 réussie sur le head exact. L'analyse AST confirme l'inventaire des consommateurs directs. Les huit tests DOM vérifient le rendu React et les interactions dans happy-dom ; Chromium headless et axe-core complètent la validation ciblée du Design Lab et des parcours de saisie. Les variantes inutilisées `expressive` de `TextField` et `filled` de `OutlinedTextField` ont été supprimées ; les contrats AndroidX sont maintenant exposés par les noms `OutlinedTextField` et `OutlinedSecureTextField`. Playwright n'est pas réintroduit dans la CI (DEC-033) : il a été utilisé ponctuellement dans l'environnement isolé. La simulation IME Chromium ne vaut pas un essai clavier réel ; les vérifications sur appareil physique et lecteur d'écran restent en attente de l'action #1091. L'audit automatisé ne relève aucune violation sur le Design Lab FR/EN, mais conserve un résultat `color-contrast` incomplet à examiner manuellement. Le reflow à 320 CSS px est vérifié ; RTL est hors périmètre tant que seules les locales FR/EN sont prises en charge. Cet inventaire ne vaut pas validation globale de conformité.
