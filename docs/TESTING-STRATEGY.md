# Loculary — stratégie de tests fondée sur les risques

## Objet et autorité

Cette politique commune s'applique aux modes **PILOTAGE**, **COLLABORATIF** et **AUTONOME**, ainsi qu'à toute contribution au dépôt. Elle complète les contrats produit et techniques sans les remplacer.

Les tests sont un moyen de réduire un risque identifié, pas un objectif de couverture en soi. La présence d'un fichier, d'un composant, d'un outil ou d'une fonction ne crée pas automatiquement une obligation d'ajouter un test.

Distinguer quatre objets :
- **Contrat normatif** : une source faisant autorité définit exactement une API, une valeur ou un comportement, notamment AndroidX épinglé.
- **Comportement produit** : une règle métier, un parcours ou un résultat observable doit rester correct.
- **Protection technique** : sécurité, permissions, confidentialité, intégrité, frontières d'accès, migrations et contrats d'infrastructure.
- **Preuve d'expérience** : rendu visuel, ergonomie, interactions navigateur, responsive et expérience réelle avec clavier ou technologie d'assistance.

Un changement peut relever de plusieurs objets ; chacun doit être vérifié par une preuve adaptée. Ne jamais présenter un type de preuve comme s'il en établissait un autre.

## 1. Décider si un test apporte une protection utile

Avant d'ajouter, réécrire ou supprimer un test, identifier :
1. **Le risque concret** : quel défaut plausible ou quelle régression importante cherche-t-on à prévenir ou détecter ?
2. **La conséquence** : quel serait l'effet pour les utilisateurs, les données, la sécurité, un contrat ou la livraison ?
3. **Le signal attendu** : quel résultat observable permettrait de détecter le défaut ?
4. **Le niveau adapté** : quel test simple et déterministe protège réellement ce risque ?
5. **Le coût** : exécution, fragilité, maintenance et diagnostic, comparés à la valeur de protection.

Si aucun risque significatif ni signal utile ne peut être formulé, ne pas créer de test artificiel. Une couverture chiffrée plus élevée n'est pas, à elle seule, un bénéfice.

Un test existant n'est pas conservé uniquement parce qu'il existe ou qu'il a historiquement passé. Lorsqu'il est touché ou audité, qualifier ce qu'il protège réellement. Ne pas réécrire toutes les suites ni supprimer en masse des tests sans examiner leurs risques et dépendances.

## 2. Choisir le niveau de vérification

Choisir le niveau minimal qui donne un signal fiable :
- **Unitaire** : fonction déterministe, règle métier, transformation ou calcul isolable.
- **Intégration** : interaction entre modules, runtime, persistance, permissions, API ou services.
- **Contrat** : API, schéma, format, source normative, invariant architectural ou frontière stable.
- **Navigateur / bout en bout** : parcours dont la validité dépend du DOM, du navigateur, du routage, du focus ou de l'intégration réelle.
- **SQL / infrastructure** : contraintes, politiques RLS, migrations, fonctions et invariants de données.
- **Sécurité / confidentialité** : contrôle d'accès effectif, permission, absence de fuite ou de transfert interdit, intégrité et comportement face à une entrée hostile.
- **Vérification manuelle ou visuelle** : aspect qui ne peut pas être établi de façon fiable par les contrôles automatisés disponibles.
- **Aucun test dédié** : choix valide lorsqu'un changement à faible risque est suffisamment couvert par une revue ciblée et les contrôles existants.

Éviter les doublons entre niveaux. Un test navigateur ne doit pas répéter artificiellement toute la logique unitaire ; un test statique ne prouve pas un comportement d'exécution qu'il n'observe pas.

## 3. Contrats AndroidX et Material 3 — règle impérative

Pour tout port AndroidX, la source stable épinglée et ses preuves de provenance font autorité pour l'intégralité du contrat : API, paramètres, valeurs par défaut, composition, slots, typographie, géométrie, mesures, densités, dimensions, espacements, alignements, couleurs, rôles, opacités, surfaces, formes, contours, élévations, ombres, icônes, états, interactions, gestes, focus, retours, animations, transitions, durées, courbes, thèmes et variantes. Cette liste est non limitative.

Les tests de contrat AndroidX protègent les valeurs et comportements exacts de la source épinglée. Ne pas arrondir, normaliser, remplacer ou assouplir ces valeurs pour satisfaire WCAG, axe-core, une convention Web ou une préférence d'implémentation. Ne pas transformer un choix propre à l'adaptation Web en valeur normative AndroidX.

Séparer explicitement :
- les tests de source, d'API et de valeurs normatives ;
- les tests du comportement du port React/Web ;
- les vérifications d'adaptation de plateforme (DOM, sémantique, clavier, focus, pointeur, navigation et intégration navigateur) ;
- la comparaison du rendu réel avec la référence.

Un test statique ou une CI verte ne prouve pas la fidélité visuelle. Une vérification navigateur ne prouve pas à elle seule l'exhaustivité de l'API ou de la provenance. Les limites restent explicites. En cas d'écart d'accessibilité réel, reproductible et impossible à résoudre sans déformer AndroidX, conserver le port fidèle et appliquer le processus d'arbitrage défini dans `AGENTS.md` et `docs/material3/README.md`.

## 4. Assertions négatives et tests statiques

Une assertion négative est légitime lorsqu'elle protège une interdiction durable et vérifiable : accès sans permission, transfert ou stockage non autorisé, exposition de données, suppression dangereuse, API interdite, contournement d'une frontière de sécurité ou violation d'un contrat normatif.

Elle est fragile lorsqu'elle interdit seulement une ancienne formulation éditoriale, un nom de classe, une structure JSX ou un détail CSS sans contrat durable, un ancien identifiant sans risque actuel, ou une implémentation précise parmi plusieurs solutions correctes.

Préférer les assertions sur les propriétés et conséquences observables. Les tests statiques restent appropriés pour les contrats de source, règles architecturales et garde-fous de sécurité lorsqu'ils constituent le signal le plus direct ; ne pas les remplacer systématiquement par des tests navigateur plus coûteux.

## 5. Qualifier les échecs avant de corriger

Classer l'échec avant de modifier le produit :
- **Régression réelle** : comportement attendu cassé ; corriger le produit et ajouter/ajuster une protection proportionnée si elle manque.
- **Évolution volontaire** : contrat ou comportement légitimement modifié ; mettre à jour le test et les documents en préservant les garanties toujours requises.
- **Test obsolète ou fragile** : détail sans risque, doublon ou contrat dépassé ; réécrire ou retirer avec justification.
- **Environnement ou outillage** : signal invalide ; diagnostiquer l'environnement sans affaiblir le contrat produit.
- **Résultat incertain** : approfondir la preuve avant de conclure.

Ne jamais changer le produit aveuglément pour satisfaire un test. Ne pas désactiver ou rendre permissif un contrôle de sécurité ou de livraison pour faire passer la CI.

## 6. CI : signal proportionné et honnête

Organiser les contrôles selon leur valeur et leur fréquence :
- **Gate PR** : contrôles rapides, déterministes et nécessaires à la confiance avant fusion, sélectionnés selon les fichiers et risques touchés.
- **Surveillance périodique ou après fusion** : contrôles plus longs, parcours navigateur et analyses utiles qui ne doivent pas forcément bloquer chaque PR.
- **Contrôle informatif ou manuel** : audit complémentaire qui n'est pas un gate obligatoire.

Documenter les déclencheurs réels, suites exécutées, chemins conditionnels et contrôles ignorés. Ne pas confondre inventaire de fichiers, nombre de cas, exécution d'une suite, succès d'un job et preuve de l'expérience réelle.

Ne pas conserver un job uniquement parce qu'il existe, ni retirer un contrôle important uniquement pour réduire la durée. Évaluer le risque couvert, le délai du signal, les doublons, faux positifs, coûts et protections de branche. Après une évolution CI, vérifier le chemin concerné et le contrôle agrégé ; déclarer les environnements qui ne sont plus vérifiés de manière récurrente.

## 7. Vérification visuelle et responsabilité

Les vérifications automatisables raisonnablement disponibles sont à la charge de l'agent. L'utilisateur ne doit pas être sollicité pour des campagnes physiques répétées à chaque petite évolution pendant le développement.

Pour les aspects nécessitant réellement une observation visuelle ou une interaction humaine, regrouper autant que possible la revue vers une phase de préproduction ou de quasi-production. Utiliser entre-temps les preuves navigateur et captures disponibles lorsque pertinent, en signalant leurs limites. Une capture, un smoke test ou axe-core ne vaut pas validation exhaustive du rendu, de l'ergonomie, d'un appareil physique ou d'une technologie d'assistance.

Cela ne dispense pas d'un contrôle manuel lorsqu'un risque critique ne peut être établi autrement ; cela évite les campagnes physiques répétitives à faible valeur.

## 8. Traçabilité et entretien

Pour un test nouveau ou une modification substantielle, le risque et l'intention doivent être compréhensibles dans le nom, le contexte du test ou la documentation proche. Ne pas ajouter de commentaire cérémoniel à chaque assertion.

Pour une suppression ou réécriture significative, consigner dans l'issue ou la PR le test concerné, le risque réellement protégé (ou l'absence de risque durable), la raison du changement, la protection conservée ou la preuve alternative et les vérifications/limites restantes.

Les issues restent la mémoire des travaux ; cette politique et les contrats spécialisés restent les références durables. Ne pas recopier cette politique dans les mandats ou instructions : ils doivent pointer ici.

## Références

- `AGENTS.md` — règles communes et contrat AndroidX.
- `docs/DESIGN-SYSTEM.md` — contrats et fondations du design system.
- `docs/material3/README.md` — portage AndroidX Material 3.
- `docs/TOOL_QUALITY.md` — qualité des métadonnées et des outils.
- `docs/ISSUE-GUIDELINES.md` — traçabilité et cycle de vie des issues.
