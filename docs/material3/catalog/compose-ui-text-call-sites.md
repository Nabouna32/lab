# Audit des usages React/Web — Compose UI Text

## Périmètre et méthode

Audit ciblé des consommateurs directs des trois composants de saisie partagés recensés dans la revue [Compose UI Text 1.12.1](compose-ui-text-1.12.1.md). L'objectif est de distinguer les usages produit des démonstrations et les composants HTML natifs des adaptations Loculary.

- Référence AndroidX : Compose UI Text 1.12.1, commit `5e0747401bf56b243e3b5141ae080dc9bc61d29c`.
- Dépôt examiné : branche `main` après fusion de la PR #1076.
- Méthode : recherches GitHub ciblées des JSX `<TextField`, `<TextArea`, `<MaterialTextField` et des imports directs depuis `@/components/ui/*`, puis lecture des implémentations et consommateurs pertinents.
- Limite : l'index de recherche GitHub est un outil de repérage, pas un analyseur AST. Les résultats ci-dessous sont un inventaire vérifié des correspondances remontées ; ils ne prouvent pas l'absence d'alias, de composition indirecte ou de rendu dynamique non retrouvé. Aucun test navigateur n'a été exécuté.

## Résultats de l'inventaire

### TextField — champ mono-ligne

16 fichiers consommateurs directs ont été retrouvés :

| Zone | Fichiers |
|---|---|
| Compte et administration | `src/app/[locale]/compte/connexion/page.tsx`, `inscription/page.tsx`, `email/page.tsx`, `suppression/page.tsx`, `informations-personnelles/page.tsx`, `src/app/[locale]/admin/utilisateurs/page.tsx` |
| Outils | `src/components/tools/calculator/CalculatorField.tsx`, `regex-tester/RegexTester.tsx`, `uuid/UuidGenerator.tsx`, `color-converter/ColorConverter.tsx`, `ipv6-subnet-calculator/Ipv6SubnetCalculator.tsx`, `number-base-converter/NumberBaseConverter.tsx`, `contrast-checker/ContrastChecker.tsx`, `ip-subnet-calculator/IpSubnetCalculator.tsx`, `color-palette-generator/ColorPaletteGenerator.tsx` |
| Démonstration | `src/app/[locale]/design-lab/VisualLab.tsx` |

Le test `src/lib/design-system/material-components.test.mjs` contient également une assertion de contrat, pas un consommateur runtime.

Les usages couvrent des formulaires d'authentification et de profil, des entrées numériques, des paramètres d'outils et des champs de démonstration. `CalculatorField` est un wrapper qui délègue à `TextField`, et non un second moteur de saisie.

### TextArea — champ multiligne Web

20 fichiers utilisent directement le composant :

- Outils : `text-counter/TextCounter.tsx`, `html-previewer/HtmlPreviewer.tsx`, `base64/Base64Encoder.tsx`, `jwt-decoder/JwtDecoder.tsx`, `text-diff-checker/TextDiffChecker.tsx`, `url-parser/UrlParser.tsx`, `url-encoder/UrlEncoder.tsx`, `csv-diff-checker/CsvDiffChecker.tsx`, `regex-tester/RegexTester.tsx`, `html-entity-encoder/HtmlEntityEncoder.tsx`, `text-case-converter/TextCaseConverter.tsx`, `json-to-typescript/JsonToTypeScript.tsx`, `csv-json/CsvJsonConverter.tsx`, `json-formatter/JsonFormatter.tsx`, `json-diff-checker/JsonDiffChecker.tsx`, `text-line-processor/TextLineProcessor.tsx`, `qr-code-generator/QrCodeGenerator.tsx`, `xml-formatter-validator/XMLFormatterValidator.tsx`, `yaml-formatter-validator/YamlFormatterValidator.tsx`.
- Démonstration : `src/app/[locale]/design-lab/VisualLab.tsx`.

Un autre résultat de recherche, `src/components/tools/hash-generator/HashGenerator.tsx`, utilise un `textarea` HTML natif directement : il ne consomme pas `TextArea`. Ce choix est à examiner séparément avant toute centralisation ; aucune migration n'est justifiée par le seul fait qu'un wrapper existe.

### MaterialTextField — composition contrôlée

Un seul consommateur direct est retrouvé : `src/components/account/PasswordChangeForm.tsx`, avec trois instances (mot de passe actuel, nouveau mot de passe, confirmation). C'est le seul parcours de production identifié pour cette adaptation contrôlée.

## Contrats observés dans le code

### TextField

- S'appuie sur un véritable `input` HTML et un `label` associé par `htmlFor`/`id`.
- Préserve les attributs natifs transmis par les consommateurs (nom, type, contraintes, autocomplétion, valeur et gestionnaire de changement).
- Fournit deux traitements visuels nommés `fidelity` et `expressive`, avec `fidelity` par défaut.
- Définit `inputMode=decimal` par défaut pour `type=number` et `step=any` si aucun pas n'est fourni.
- `CalculatorField` conserve une fine couche métier pour le champ et son unité, sans remplacer le contrôle natif.

### TextArea

- S'appuie sur un véritable `textarea` HTML, un label associé, `rows`, le redimensionnement natif et les attributs de saisie.
- Est explicitement documenté comme une adaptation Web multiligne du cas d'usage Material 3 TextField ; AndroidX n'expose pas un composant Material 3 autonome nommé `TextArea`.
- Expose les props `helperText` et `error`, mais les consommateurs retrouvés ne justifient pas encore une abstraction plus riche ou un éditeur personnalisé.
- Les attributs `aria-invalid` et `aria-describedby` calculés à partir de `error`/`helperText` sont suivis de `{...props}` dans le JSX : les valeurs explicites du consommateur ont donc priorité. Ce comportement est utile aux usages actuels, dont plusieurs fournissent leurs propres IDs d'erreur ; en revanche, si `error`/`helperText` et des attributs ARIA externes sont fournis simultanément, les valeurs externes peuvent masquer les associations internes. Il faut documenter et tester ce contrat de priorité plutôt que prétendre que les attributs consommateurs sont écrasés.

### MaterialTextField

- Est un champ React contrôlé, à label flottant, avec supporting text, erreur, compteur, préfixe/suffixe et contenu auxiliaire.
- N'a qu'un parcours de production identifié, le changement de mot de passe.
- Le bouton de révélation est conditionné par `secure`, pas par `type="password"`. Le consommateur actuel utilise `type="password"` sans `secure` : il n'affiche donc pas cette action.
- Les libellés accessibles et visibles du bouton de révélation sont codés en anglais (`Show password`/`Hide password`, `Show`/`Hide`). Aucun consommateur n'active actuellement `secure`; ce défaut latent doit être corrigé avant d'activer cette option dans le parcours français.
- Le composant a une implémentation et une feuille CSS distinctes des wrappers natifs ; il ne doit pas être assimilé à un portage validé AndroidX sans spécification et vérification supplémentaires.

## Décisions

1. Garder `TextField` et `TextArea` fondés sur les éléments HTML natifs : les usages recensés portent sur de la saisie, du texte technique, du collage et des formulaires, pour lesquels les comportements du navigateur/OS sont une base plus robuste qu'un moteur personnalisé.
2. Ne pas remplacer le `textarea` natif de HashGenerator sans vérifier les besoins propres à cet outil ; il n'y a pas de gain démontré à uniformiser mécaniquement.
3. Conserver `CalculatorField` comme composition légère tant que son unité et ses contraintes restent spécifiques au calcul.
4. Garder `MaterialTextField` circonscrit au formulaire de changement de mot de passe ; ne pas le généraliser aux autres formulaires avant une comparaison de contrat et de rendu.
5. Tester le contrat de priorité des attributs ARIA de `TextArea` lorsque les props `error`/`helperText` sont combinées à des valeurs explicites du consommateur. Il ne s'agit pas d'un écrasement des props externes : l'ordre JSX donne actuellement la priorité à `{...props}`.
6. Garder l'option de révélation `secure` de `MaterialTextField` inactive tant que son besoin produit n'est pas établi ; si elle est activée, localiser ses libellés visibles et accessibles. Le parcours actuel utilise `type="password"` sans `secure`, ce qui laisse la saisie masquée sans bouton de révélation.

## Vérifications restantes

- [x] Rechercher les JSX des trois composants et les imports directs depuis leurs modules.
- [x] Relire les trois implémentations, la feuille CSS de MaterialTextField, le formulaire de mot de passe et les tests de composants Material.
- [x] Distinguer le composant de démonstration, les consommateurs runtime et le textarea natif distinct.
- [ ] Compléter par une recherche AST locale exhaustive lorsque l'environnement de travail local est disponible ; l'index GitHub ne garantit pas la détection de tous les alias.
- [ ] Ajouter des tests de contrat pour la priorité des attributs ARIA en présence d'erreur/aide, la saisie IME, la sélection/collage et le parcours sécurisé localisé.
- [ ] Vérifier clavier, lecteur d'écran, zoom/reflow, FR/EN, RTL et rendu dans un navigateur réel.

Aucun changement applicatif ni test navigateur n'a été effectué dans cette tranche. Cet inventaire est une base de décision, pas une validation de conformité.
