# Loculary — Product Brainstorming

> **Status: VALIDÉ — direction produit issue du brainstorming.**
>
> Ce document conserve les idées, ambitions, réponses et directions complémentaires validées pendant la phase de brainstorming. Il complète les documents canoniques du projet sans les remplacer.
>
> Une idée présente ici n'est pas automatiquement une fonctionnalité à implémenter. Les décisions opérationnelles sont enregistrées dans `DECISIONS.md`, les spécifications dans les documents concernés, les sujets ouverts dans `DISCUSSIONS.md` et les évolutions différées dans `FUTURE.md`.

## 1. Vision

Loculary doit devenir une **boîte à outils numérique universelle** : un ensemble potentiellement immense de milliers d'outils web, organisé pour rester simple, compréhensible, moderne, rapide, visuel, agréable et pratique.

La vision dépasse une simple collection de calculateurs : Loculary est une plateforme de **micro-outils, outils avancés et mini-applications** permettant de partir d'un besoin et d'arriver rapidement à une solution.

Parcours fondamental :

**Besoin → Loculary → recherche/découverte → outil(s) → résultat → action/partage/sauvegarde**

Positionnement de travail possible :

> **Loculary — trouvez simplement comment faire.**

## 2. Public et ambition

- Public : tout le monde.
- Utilisateurs débutants comme avancés.
- Toute fonctionnalité raisonnablement réalisable dans un navigateur peut potentiellement devenir un outil.
- Domaines possibles : calcul, conversion, technique, développement, fichiers, web, création, analyse, visualisation, mesure, génération, éducation, productivité, ludique, émotionnel, symbolique/spirituel, etc.
- La limite réelle est la faisabilité technique, la sécurité, la légalité, le coût et la qualité produit.

## 3. Principes produit

- Simple par défaut, puissant quand nécessaire.
- Résultat visible immédiatement.
- Visuel lorsque le visuel apporte une vraie compréhension.
- Expérience moderne, dynamique et éventuellement ludique, jamais imposée.
- Confidentialité et transparence comme éléments de confiance.
- Browser-first / local-first lorsque raisonnable.
- Infrastructure serveur limitée lorsque le navigateur peut faire le travail.
- Richesse progressive : ne pas imposer à l'utilisateur la complexité ou le coût des fonctions dont il n'a pas besoin.
- Mobile, tablette, desktop et grands écrans sont des contextes de première classe.
- Accessibilité WCAG 2.2 AA.
- Publicité possible, mais toujours secondaire à l'action principale.

## 4. Recherche : du nom du besoin à la solution

L'utilisateur ne doit pas connaître le nom de l'outil. La recherche doit comprendre des noms, actions, besoins, questions, synonymes, alias, catégories et intentions.

Exemples :
- « calculer 17 % de 283 »
- « convertir miles en kilomètres »
- « réduire une image »
- « vérifier si cette adresse IP est valide »
- « calculer mon débit internet »

Direction progressive :
1. recherche catalogue ;
2. synonymes/alias/tags/catégories et tolérance aux fautes ;
3. compréhension d'intention ;
4. éventuellement préremplissage/exécution de tâches déterministes simples ;
5. à long terme, moteur de solution pouvant proposer plusieurs outils/composer un workflow.

L'IA peut enrichir la recherche mais n'est pas une dépendance fondamentale. Elle doit justifier coût, confidentialité, latence et fiabilité.

Si aucun résultat n'est trouvé : proposer reformulations, outils proches, catégories et éventuellement une voie de proposition d'outil.

## 5. Accueil et découverte

Direction **A + C** :
- premier plan : « Que voulez-vous faire ? » / recherche/action ;
- profondeur : outils populaires, catégories, découvertes, suggestions, collections, outils récents/personnalisés.

Une navigation orientée intention peut présenter :
**Calculer, Convertir, Transformer, Créer, Analyser, Vérifier, Générer, Mesurer, Découvrir**.

Les catégories internes restent structurées ; l'interface peut être plus naturelle.

## 6. Expérience des outils

Ordre recommandé :
1. entrées ;
2. résultat ;
3. actions ;
4. explication ;
5. documentation.

Le tool doit être utilisable sans parcourir une longue documentation.

Prévoir lorsque pertinent :
- résultat principal très visible ;
- valeurs secondaires ;
- copie ;
- reset ;
- partage ;
- « Comment avons-nous obtenu ce résultat ? » en section secondaire ;
- exemples « Essayer cet exemple » ;
- FAQ/documentation contextuelle.

Les valeurs impossibles doivent être empêchées lorsque raisonnable. Les erreurs doivent être compréhensibles et actionnables.

## 7. Trois niveaux de complexité

1. **Petit outil** : calculateur, convertisseur, générateur simple, vérificateur.
2. **Outil avancé** : analyse, éditeur, traitement plus lourd, outil technique.
3. **Mini-application** : workflow, plusieurs écrans, état complexe, interactions et fonctionnalités importantes.

Un contrat commun existe, mais l'interface n'est pas uniformisée artificiellement.

## 8. Identité visuelle

Loculary doit avoir une cohérence globale mais chaque outil peut avoir sa propre identité graphique et d'animation.

Le design system standardise notamment :
- navigation ;
- accessibilité ;
- confiance/privacy ;
- actions communes ;
- comportement ;
- SEO ;
- erreurs ;
- cycle de vie.

Un outil peut avoir ses propres visualisations, animations, layouts et interactions.

## 9. Modes d'expérience

Deux grandes expressions :
- **Sober** : minimal, rapide, professionnel, dense, peu décoratif.
- **Playful** : visuel, animé, expressif, micro-interactions, personnalité.

Niveaux d'animation possibles :
- off ;
- reduced ;
- normal ;
- playful.

`prefers-reduced-motion` doit primer lorsque nécessaire.

Thèmes initiaux : clair, sombre, système. La création de thèmes personnalisés par l'utilisateur est une idée future.

## 10. Personnalisation : « mon Loculary »

Un utilisateur connecté pourra progressivement personnaliser son espace :
- masquer des outils ;
- réordonner outils et éléments ;
- personnaliser l'accueil ;
- favoris ;
- collections ;
- historique ;
- thème ;
- animations ;
- densité/style ;
- préférences de confidentialité ;
- expérience/ton contextuel lorsque pertinent.

La personnalisation motive la création de compte mais ne doit pas bloquer l'usage anonyme.

## 11. Favoris, collections et historique

- Les favoris anonymes peuvent être stockés localement.
- À la connexion, ils peuvent être fusionnés avec les favoris du compte, avec gestion déterministe des conflits.
- Les collections sont des objets de première classe : privées, partageables ou publiques.
- L'historique peut contenir outil, date, paramètres/résultat selon l'outil et les préférences.
- Les données sensibles/raw content ne doivent pas être synchronisées par défaut.
- La conservation doit être adaptée au type d'outil.

## 12. Comptes

Compte optionnel et anonymous-first.

Sans compte :
- outils principaux utilisables ;
- état local non sensible ;
- favoris locaux ;
- préférences locales lorsque pertinent.

Avec compte :
- synchronisation ;
- favoris ;
- collections ;
- préférences ;
- historique compatible ;
- personnalisation ;
- fonctionnalités communautaires ;
- évaluations/commentaires.

L'architecture doit permettre une future synchronisation web/mobile et une future application Android, sans faire d'Android une contrainte du MVP.

## 13. Partage

Un outil peut être partagé :
- vierge ;
- configuré ;
- avec résultat/état.

Les données sensibles ne doivent jamais être exposées involontairement dans une URL.

Possibilités : URL, Web Share API, QR code et mécanismes natifs lorsqu'ils sont pertinents.

## 14. Confidentialité et transparence

Chaque outil doit indiquer son mode de traitement :
- 100 % local ;
- service externe ;
- serveur Loculary ;
- hybride.

Le détail doit expliquer :
- quelles données sont utilisées ;
- ce qui quitte l'appareil ;
- où ;
- pourquoi ;
- stockage ;
- rétention ;
- permissions ;
- dépendances ;
- comportement en cas de panne.

Phrase de confiance appréciée :

> **🔒 Vos fichiers restent sur votre appareil.**

Cette affirmation ne doit être utilisée que lorsque le comportement technique la justifie.

## 15. Local-first et fichiers

Lorsque possible :
**appareil → navigateur → traitement local → résultat**

Éviter les gros uploads/downloads via l'infrastructure Loculary par défaut.

Pour les traitements lourds, utiliser lorsque pertinent :
- Web Workers ;
- WebAssembly ;
- chunking ;
- streaming ;
- traitement progressif.

Les API externes restent possibles lorsqu'elles apportent une vraie capacité.

## 16. Capacités et sécurité

Chaque outil doit déclarer explicitement ses capacités :
- traitement local ;
- fichiers ;
- clipboard ;
- caméra ;
- microphone ;
- géolocalisation ;
- réseau/API ;
- données de compte ;
- serveur/base de données.

L'accès doit être explicite et, à terme, techniquement contrôlé.

Toutes les données client sont non fiables. Validation côté client pour l'UX, validation/autorisation côté serveur pour la sécurité.

## 17. Documentation des outils

La documentation est secondaire mais réelle :
- résumé ;
- comment utiliser ;
- exemple ;
- formule/calcul ;
- cas limites ;
- FAQ ;
- confidentialité ;
- contenu éducatif/historique lorsque pertinent.

La documentation peut être progressive/accordéon.

Le SEO ne doit jamais repousser le tool hors de portée.

## 18. SEO

Chaque outil public pertinent doit être une page stable, indexable et utile avec :
- titre ;
- description ;
- structure sémantique ;
- canonical ;
- Open Graph ;
- données structurées lorsque pertinentes ;
- contenu unique ;
- exemples ;
- FAQ ;
- liens internes.

Pas de production massive de pages SEO pauvres.

## 19. Internationalisation

Initialement :
- français ;
- anglais.

Architecture préparée pour davantage de langues :
- fichiers UI ;
- contenu spécifique aux outils ;
- registre des langues ;
- statut de traduction ;
- fallback ;
- RTL ;
- SEO localisé.

Aucune chaîne UI française en dur dans la logique métier.

Une traduction partielle peut être publiée avec indication et fallback explicite.

## 20. Accessibilité et performance

Objectif WCAG 2.2 AA.

Principes :
- clavier ;
- focus ;
- sémantique ;
- contraste ;
- erreurs accessibles ;
- informations non dépendantes de la couleur ;
- responsive ;
- lecteurs d'écran ;
- reduced motion.

Performance :
- code splitting ;
- chargement à la demande ;
- outils simples très rapides ;
- budgets adaptés aux outils lourds ;
- support des appareils modestes sans dégrader tout le produit ;
- détection de capacités lorsque nécessaire ;
- mode allégé si pertinent ;
- connexion lente et graceful degradation ;
- timeout/retry/fallback pour services externes ;
- progression honnête et annulation des opérations longues ;
- tests sur appareils modestes/standards/performants ;
- Core Web Vitals.

Principe central :
> **La richesse doit être progressive.**

## 21. Offline et PWA

Identifier clairement les outils pouvant fonctionner hors connexion.

La PWA est une capacité future : préparer la compatibilité lorsque cela est raisonnable mais ne pas en faire une dépendance du MVP.

Une future décision PWA doit évaluer :
- valeur offline ;
- installation ;
- cache/stockage ;
- mises à jour ;
- support navigateur ;
- impact performance.

## 22. Communauté

La communauté est secondaire au produit principal et ne doit pas transformer Loculary en réseau social.

Fonctions futures :
- proposer un outil ;
- proposer une amélioration ;
- noter ;
- commenter ;
- signaler ;
- collections publiques ;
- contributions ;
- attribution.

Ratings/commentaires : authentifiés.

Commentaires : anti-spam, signalement, modération, historique.

Proposition :
**proposition → validation automatique → revue → modération/humain → publication**, avec possibilité de rejet, fusion, transformation ou pause.

Rôles de contribution :
- auteur original ;
- contributeur ;
- traducteur ;
- améliorateur ;
- mainteneur.

Les crédits restent discrets sur la page outil.

## 23. Cycle de vie et administration

Cycle outil :
**draft → review → published → hidden → archived**

La suppression définitive est exceptionnelle.

L'admin est un vrai backend protégé et doit gérer notamment :
- outils ;
- catégories ;
- tags ;
- utilisateurs ;
- permissions ;
- commentaires ;
- signalements ;
- propositions ;
- contributeurs ;
- analytics ;
- configuration ;
- audit.

Le code exécutable reste dans Git ; l'admin gère métadonnées, contenu, état et configuration autorisée.

Permissions granulaires et audit des changements sensibles.

## 24. Données et architecture

Architecture de départ : monolithe modulaire, pas de microservices prématurés.

Next.js avec frontière API claire est le baseline actuel.

Base relationnelle PostgreSQL planifiée pour les données durables :
- comptes/auth ;
- préférences ;
- outils/versions/lifecycle ;
- catégories/tags ;
- contenu/SEO ;
- favoris/collections ;
- historique compatible ;
- ratings/commentaires ;
- propositions/modération ;
- contributeurs ;
- permissions/audit ;
- analytics/consentement.

Le code reste dans Git ; les données métier/configuration durable dans la base.

## 25. Analytics

Analytics provider-independent.

Événements possibles :
- outil ouvert ;
- outil terminé ;
- recherche ;
- aucun résultat ;
- partage ;
- favori ;
- collection ;
- erreur ;
- performance.

Ne pas collecter les entrées sensibles par défaut.

## 26. Publicité et modèle économique

Service gratuit, publicité comme source de revenus possible.

Règles :
- publicité secondaire ;
- jamais entre saisie et résultat ;
- jamais bloquante ;
- pas d'audio automatique ;
- pas d'interaction trompeuse ;
- desktop : rails latéraux si l'espace le permet ;
- mobile/petit écran : placement inférieur non intrusif si acceptable ;
- ne pas couvrir les contrôles essentiels.

Architecture :
**AdSlot → AdProvider**

Le fournisseur peut changer sans modifier les outils.

Les coûts d'infrastructure doivent rester proportionnels à l'usage et aux revenus.

## 27. IA

L'IA est optionnelle.

Elle peut apporter de la valeur pour :
- compréhension d'intention ;
- recherche ;
- découverte ;
- assistance.

Elle ne doit pas être une fondation obligatoire.

Avant intégration : mesurer valeur contre coût récurrent, confidentialité, latence, fiabilité et complexité.

## 28. Recherche de tags et catégories

Catégories hiérarchiques, outils pouvant appartenir à plusieurs catégories.

Tags centralisés avec alias/synonymes pour éviter les doublons sémantiques.

Outils associés possibles :
- outils similaires ;
- complémentaires ;
- populaires ;
- récemment utilisés.

Les relations doivent être pertinentes et non artificielles.

## 29. Dualité / complémentarité

Le catalogue peut exprimer une complémentarité entre :
- concret/utile et exploration/expression ;
- factuel et symbolique ;
- technique et ludique ;
- sobre et expressif.

Les outils émotionnels, introspectifs, symboliques ou spirituels peuvent exister, mais doivent être présentés honnêtement et ne pas être artificiellement présentés comme des vérités scientifiques lorsqu'ils ne le sont pas.

## 30. Profils publics

Idée future :
- pseudo ;
- avatar/photo ;
- centres d'intérêt ;
- hobbies ;
- favoris ;
- collections publiques ;
- contributions.

Le profil doit rester secondaire et ne doit pas transformer Loculary en réseau social.

## 31. Mode enfant

Idée très future.

Si elle est étudiée, elle doit avoir une conception spécifique concernant :
- sécurité ;
- confidentialité ;
- vocabulaire ;
- modération ;
- publicité ;
- design ;
- contraintes légales.

Ne pas l'implémenter comme un simple thème.

## 32. Android

Application Android future possible.

Le web reste le produit principal. L'architecture ne doit pas rendre une future application mobile impossible, mais ne doit pas introduire d'abstractions coûteuses uniquement pour un client hypothétique.

## 33. Vision en trois couches

**Public**
- recherche ;
- catalogue ;
- découverte.

**Outil**
- exécution ;
- résultat ;
- explication ;
- partage.

**Personnel**
- favoris ;
- collections ;
- historique ;
- préférences ;
- personnalisation ;
- profil.

Cette séparation permet de rester simple pour l'anonyme tout en offrant de la profondeur au compte.

## 34. Ton et identité contextuels

Un outil professionnel peut rester sobre. Un outil créatif/ludique peut être plus expressif.

Le ton contextuel peut devenir configurable dans les préférences si cela apporte une vraie valeur.

## 35. Vision long terme : moteur de solutions

À terme, Loculary pourrait évoluer de :
**« trouver un outil »**
vers :
**« résoudre un besoin »**.

Une demande complexe pourrait conduire vers plusieurs outils et un workflow.

Cette capacité reste une direction future, pas une obligation du MVP.

## 36. Idées futures conservées

À ne pas perdre :
- PWA ;
- offline renforcé ;
- profils publics ;
- thèmes personnalisés ;
- espace personnel avancé ;
- collections publiques ;
- moteur de solutions ;
- composition multi-outils ;
- IA avancée ;
- Android ;
- davantage de langues ;
- RTL ;
- contenus éducatifs/historiques ;
- ton contextuel ;
- mode enfant ;
- identités visuelles plus riches ;
- capacités de personnalisation plus poussées.

Une idée future devient du scope durable uniquement après décision explicite, spécification et planification.

## 37. Gouvernance de la vision

La vision ne doit jamais être réécrite simplement parce que le code est en retard.

En cas de divergence :
1. lire les documents et décisions existants ;
2. identifier la divergence ;
3. corriger le code si la vision reste correcte ;
4. documenter explicitement l'écart si nécessaire ;
5. ne modifier la vision que lorsqu'une véritable décision produit est prise ;
6. si la vision évolue, mettre à jour le document canonique, la décision et les documents dépendants.

Le dépôt doit rester compréhensible par une autre IA ou un autre développeur sans dépendre de la mémoire des conversations.

## 38. Résumé directeur

Loculary ne doit pas être pensé comme « un site avec beaucoup de petits outils », mais comme :

> **un environnement web universel permettant à chacun de trouver, utiliser, personnaliser et progressivement combiner des outils pour résoudre des besoins réels.**

La quantité compte, mais la valeur vient surtout de l'organisation, de la simplicité, de la qualité, de la rapidité, de la transparence, de la découverte, de la personnalisation et de la cohérence de l'ensemble.
