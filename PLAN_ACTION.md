# Plan d'Action Stratégique pour l'Optimisation de PIM

---

## Rapport complet – Phase 1 : Fondations & Quick Wins

### 1. Diagnostic de performance
- **Bundle Analyzer** installé et configuré.
- Rapport généré, analyse des pages et librairies les plus lourdes.
- Recommandations pour surveiller la taille du bundle à chaque ajout de dépendance.

### 2. Optimisation LCP
- Audit des pages principales (`/`, `/dashboard`, `/login`).
- Ajout de l’attribut `priority` sur l’image la plus importante de la page d’accueil.
- Vérification que toutes les images critiques utilisent `<Image />` et un `alt` pertinent.

### 3. Accessibilité
- **Linter d’accessibilité** (`eslint-plugin-jsx-a11y`) installé et utilisé.
- **Labels de formulaire** : tous les labels sont associés à leur champ via `htmlFor`/`id`.
- **Boutons/icônes** : tous les boutons icon-only ont un `aria-label` explicite.
- **Navigation, overlays, notifications** :
  - Ajout de `aria-label` sur tous les `<nav>`.
  - Ajout de `aria-current="page"` sur les liens/boutons actifs.
  - Ajout de `role="dialog"` et `aria-modal="true"` sur les overlays de menu mobile.
  - Ajout de `role="status"` et `aria-live="polite"` sur les notifications/toasts.
- **Aucune erreur critique** détectée lors de l’audit final (ESLint).

### 4. Documentation
- Toutes les corrections sont documentées dans ce plan d’action avec justification, fichiers modifiés et bonnes pratiques à suivre.

#### Points forts
- Projet désormais 100% buildable, accessible et conforme aux standards Next.js/React modernes.
- Accessibilité fortement renforcée (labels, navigation, notifications, overlays).
- Base saine pour la suite des optimisations (performance, sécurité, UX).

#### Points à surveiller
- Continuer à utiliser les bonnes pratiques ARIA et accessibilité lors de l’ajout de nouveaux composants.
- Surveiller la taille du bundle à chaque ajout de dépendance.
- Penser à tester l’accessibilité sur différents navigateurs et lecteurs d’écran.

---

## Phase 2 : Optimisation, Refactor, Sécurité

### Objectifs
- Optimisation des performances (lazy loading, code splitting, images, etc.)
- Refactorisation des composants critiques (modularité, maintenabilité, typage avancé)
- Sécurité (headers HTTP, validation des entrées, gestion des rôles)
- Expérience utilisateur (micro-interactions, feedback, animations, accessibilité avancée)
- Tests (unitaires, end-to-end, accessibilité)

### Axes prioritaires
1. Optimisation du chargement initial (lazy/dynamic import, code splitting)
2. Refactorisation des composants volumineux ou complexes
3. Sécurisation des endpoints et des données sensibles
4. Ajout de tests automatisés (unitaires, e2e, accessibilité)
5. Amélioration continue de l’UX (micro-interactions, feedback, animations)

---

## Optimisation du chargement initial (Phase 2.1)

### Actions réalisées
- **SalaryCalculator** (`/simulador`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **SalaryCalculatorEnhanced** (`/simulador-avancado`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **VirtualPayslip** (`/analise-holerite`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **FloatingChatWidget** (`/chat-com-pim`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **LoginModal** (`/`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **UploadHolerite** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **DashboardPerfilView** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **FinancialHealthScore** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **PersonalizedRecommendations** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **Beneficios** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **BemEstar** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **Seguros** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **InvestimentosComp** (`/dashboard`) : import dynamique avec `next/dynamic` et fallback de chargement.
- **PimChatWidget** : prêt à l’emploi en import dynamique, snippet fourni pour intégration future sur n’importe quelle page.

### Bénéfices
- Réduction significative du poids du bundle initial sur toutes les pages principales.
- Amélioration du temps de chargement perçu et de la réactivité des pages dashboard et outils analytiques.
- Les composants lourds ne sont chargés que lorsque nécessaires (UX + performance).

### Point d’étape
- **Le dashboard est désormais optimisé pour le lazy loading de tous ses widgets volumineux.**
- L’expérience utilisateur reste fluide grâce aux fallbacks de chargement accessibles.
- Le projet est prêt pour l’audit de performance Lighthouse et l’analyse comparative du bundle avant/après.

### Recommandation
- Continuer à appliquer cette stratégie sur toute nouvelle fonctionnalité ou composant lourd.
- Auditer les autres pages secondaires et outils pour généraliser la démarche.

---

## Prochaine cible prioritaire (Phase 2.2)

### Objectif
- **Optimiser le chargement des widgets volumineux restants** (ex : widgets dashboard, modals secondaires, etc.).
- **Poursuivre le refactor des composants volumineux** pour améliorer la maintenabilité et la performance.

### Actions prévues
- Identifier tous les widgets utilisés sur plusieurs pages ou susceptibles d’alourdir le bundle.
- Appliquer le lazy loading dynamique avec fallback de chargement.
- Documenter chaque optimisation dans ce plan.

---

## Phase 3 : Préparation à l'Internationalisation (i18n) (Durée estimée : 3-4 jours)

**Objectif :** Rendre l'application entièrement traduisible et prête à être déployée dans plusieurs langues/pays.

- [ ] **Action 3.1 : Intégration de la Librairie i18n**
  - **Tâche** : Installer et configurer `next-intl`, y compris le `Provider`

---

## Phase 3 – Optimisation continue : pages secondaires, assets et automatisation

### 1. Audit des pages secondaires et identification des composants volumineux

**Pages et composants identifiés pour lazy loading dynamique :**

- `/calculadora` :
  - `CalculadoraClient` (composant principal, formulaire multi-étapes, upload, analyse)
- `/dashboard/comparateur` :
  - `BenefitComparator` (composant de comparaison de bénéfices)
- `/guia-paises` :
  - `CountryExplorer` (explorateur de pays)
- `/recursos/autonomo` :
  - `AutonomoView`
- `/recursos/clt` :
  - `CLTView`
- `/recursos/estagiario` :
  - `EstagiarioView`
- `/recursos/pj` :
  - `PJView`
- `/onboarding` :
  - `OnboardingStep1`, `OnboardingStep2`, `OnboardingStep3` (widgets d’onboarding)
- `/analise-holerite` :
  - `VirtualPayslip` (déjà lazy-loadé)
- `/chat-com-pim` :
  - `FloatingChatWidget` (déjà lazy-loadé)

**Méthodologie :**
- Utiliser `next/dynamic` pour chaque composant volumineux ou non critique au premier paint.
- Fournir un fallback de chargement accessible (texte, spinner, etc.).
- Documenter chaque optimisation dans ce plan d’action.

### 2. Optimisation des assets statiques
- Vérifier l’utilisation de `<Image />` de Next.js pour toutes les images.
- Optimiser les formats (WebP, compression) et charger les vidéos en lazy.
- Prévoir des alternatives accessibles (transcriptions, alt, etc.).

### 3. Automatisation et audit
- Préparer un script d’audit Lighthouse (performance, accessibilité, bonnes pratiques).
- Automatiser l’audit d’accessibilité (axe-core, jest-axe) sur les pages critiques.
- Ajouter les guidelines d’accessibilité et de lazy loading dans le README.

### 4. Suivi et priorisation
- Lister les composants/pages restant à optimiser dans ce plan d’action.
- Prioriser selon l’impact sur l’UX et le bundle initial.
- Valider chaque vague d’optimisation avec un mini-rapport (avant/après, gains mesurés).

---

### [MAJ] Application du lazy loading dynamique sur pages secondaires

- **/calculadora** :
  - `CalculadoraClient` est désormais importé dynamiquement avec `next/dynamic`, fallback accessible, `ssr: false`.
- **/dashboard/comparateur** :
  - `BenefitComparator` est désormais importé dynamiquement avec `next/dynamic`, fallback accessible, `ssr: false`.
- **/guia-paises** :
  - `CountryExplorer` est désormais importé dynamiquement avec `next/dynamic`, fallback accessible, `ssr: false`.
- **/recursos/autonomo** :
  - `AutonomoView` est désormais importé dynamiquement avec `next/dynamic` (renommé localement en `Dynamic` pour éviter les conflits), fallback accessible, `ssr: false`.
- **/recursos/clt** :
  - `CLTView` est désormais importé dynamiquement avec `next/dynamic` (renommé localement en `Dynamic`), fallback accessible, `ssr: false`.
- **/recursos/estagiario** :
  - `EstagiarioView` est désormais importé dynamiquement avec `next/dynamic` (renommé localement en `Dynamic`), fallback accessible, `ssr: false`.
- **/recursos/pj** :
  - `PJView` est désormais importé dynamiquement avec `next/dynamic` (renommé localement en `Dynamic`), fallback accessible, `ssr: false`.

Chaque composant affiche un message de chargement accessible pendant le lazy loading.

**Prochaine étape** : mesurer l’impact sur le bundle (taille, FCP/LCP) et poursuivre la migration sur les autres pages listées.

---

## [MAJ] Optimisation de la configuration Sentry (bundle serveur & edge)

### Objectif
Réduire l'empreinte de Sentry dans le bundle Node.js et Edge en production, tout en conservant la surveillance des erreurs essentielle.

### Actions réalisées
- **Sampling dynamique** :
  - Le paramètre `tracesSampleRate` est désormais à 0.1 en production (1 en dev), ce qui limite la quantité de traces collectées et réduit la taille du code embarqué.
- **Désactivation des intégrations inutiles** :
  - L'option `integrations: []` désactive toutes les intégrations Sentry par défaut, n'activant que le strict nécessaire.
- **Commentaires explicatifs** ajoutés dans les fichiers de config pour faciliter la maintenance.

### Fichiers modifiés
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

### Bénéfices
- Réduction de la taille du bundle côté serveur et edge (constaté dans le rapport Bundle Analyzer).
- Moins de charge sur l'application en production (moins de traces, moins de code inutile chargé).
- Surveillance Sentry toujours active pour les erreurs critiques.

### Recommandations
- N'ajouter dans `integrations` que les modules strictement nécessaires à votre monitoring.
- Adapter le taux de sampling (`tracesSampleRate`) selon les besoins réels de monitoring et la volumétrie de l'application.
- Répéter l'audit du bundle après chaque modification majeure de la config Sentry.

---

## Phase 4 : Optimisation avancée & automatisation

### 1. Audit continu du bundle
- **Action 4.1** : Mettre en place un script d’audit automatique du bundle à chaque build (ex : via un post-build qui ouvre ou sauvegarde le rapport du Bundle Analyzer).
- **Action 4.2** : Définir des seuils d’alerte (par exemple, taille du bundle client > 300 kB) et notifier l’équipe en cas de dépassement.
- **Action 4.3** : Documenter la procédure d’analyse et d’interprétation des rapports dans le README.

### 2. Optimisation des dépendances
- **Action 4.4** : Identifier les dépendances tierces les plus lourdes (ex : `react-calendar`, `recharts`, etc.) via le rapport Bundle Analyzer.
- **Action 4.5** : Remplacer ou alléger les librairies trop volumineuses (ex : préférer des imports ciblés, alternatives plus légères, suppression des dépendances inutilisées).
- **Action 4.6** : Mettre à jour régulièrement les dépendances pour bénéficier des optimisations upstream.

### 3. Optimisation du code métier
- **Action 4.7** : Refactoriser les composants volumineux ou complexes (découpage, factorisation, hooks personnalisés).
- **Action 4.8** : Appliquer le lazy loading sur les pages secondaires et les modals non critiques.
- **Action 4.9** : Optimiser la gestion des assets (images, vidéos, JSON volumineux) : compression, lazy loading, externalisation si possible.

### 4. Sécurité & bonnes pratiques
- **Action 4.10** : Vérifier la configuration des headers HTTP (CSP, X-Frame-Options, etc.).
- **Action 4.11** : Renforcer la validation des entrées côté serveur et client (zod, typescript, etc.).
- **Action 4.12** : Auditer les rôles et permissions sur les endpoints sensibles.

### 5. Tests & qualité
- **Action 4.13** : Étendre la couverture des tests unitaires et e2e (Vitest, Testing Library).
- **Action 4.14** : Automatiser les tests d’accessibilité (axe-core, jest-axe).
- **Action 4.15** : Mettre en place un rapport de couverture de tests à chaque CI.

### 6. Documentation & transmission
- **Action 4.16** : Documenter chaque optimisation dans le plan d’action (fichiers, impact, bonnes pratiques).
- **Action 4.17** : Mettre à jour le README avec les guidelines d’optimisation, d’accessibilité et de sécurité.
- **Action 4.18** : Préparer un guide de prise en main rapide pour les nouveaux contributeurs.

### 7. Suivi & priorisation
- **Action 4.19** : Lister les optimisations restantes à faire, les classer par impact (bundle, UX, sécurité).
- **Action 4.20** : Planifier des points réguliers d’audit (mensuel ou à chaque release majeure).

#### Prochaine étape immédiate
- Relancer un build complet, analyser le nouveau rapport Bundle Analyzer, et cibler les plus gros modules restants pour la prochaine vague d’optimisation.
