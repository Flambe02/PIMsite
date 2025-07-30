# Financial Check-up 360° - Guide d'utilisation

## Vue d'ensemble

Le **Financial Check-up 360°** est un module indépendant et mobile-first qui permet aux utilisateurs d'évaluer leur santé financière en 5 minutes. Inspiré graphiquement de Maji.io, il offre une expérience utilisateur moderne avec des jauges, des cartes animées et un feedback en temps réel.

## Fonctionnalités principales

### 🎯 5 Blocs thématiques
1. **Sécurité & Résilience Financière** - Épargne d'urgence, assurances, capacité à faire face aux imprévus
2. **Revenus, Paie & Avantages** - Clarté de la fiche de paie, satisfaction salariale, avantages sociaux
3. **Santé & Bien-être** - Couverture santé, programmes bien-être, stress financier
4. **Préparation du Futur & Objectifs** - Retraite, projets long terme, épargne
5. **Dettes & Gestion du Budget** - Niveau d'endettement, suivi budgétaire, contrôle des dépenses

### 🌍 Support multilingue
- **Français (FR)** - Questions et interface adaptées au contexte français
- **Portugais (BR)** - Questions et interface adaptées au contexte brésilien

### 📊 Système de scoring
- Score global de 0 à 100
- Scores individuels par bloc
- Recommandations personnalisées basées sur les résultats
- Feedback en temps réel avec animations

### 💾 Stockage et persistance
- Sauvegarde automatique dans Supabase
- Historique des diagnostics
- Données sécurisées avec RLS (Row Level Security)

## Architecture technique

### Stack utilisé
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth

### Structure des fichiers
```
app/[locale]/financial-checkup/
├── page.tsx                    # Page principale
├── components/
│   ├── FinancialCheckupHero.tsx           # Page d'accueil
│   ├── FinancialCheckupStepper.tsx        # Indicateur de progression
│   ├── FinancialCheckupQuestions.tsx      # Interface des questions
│   ├── FinancialCheckupSummary.tsx        # Résultats finaux
│   └── FinancialCheckupSummaryCard.tsx    # Carte de résumé (dashboard)
├── lib/
│   └── financial-checkup/
│       └── data.ts             # Données localisées
├── hooks/
│   └── useFinancialCheckup.ts  # Hook pour la gestion des données
└── supabase/migrations/
    └── 20250130_create_financial_checkups_table.sql
```

## Modèle de données

### Table `financial_checkups`
```sql
CREATE TABLE financial_checkups (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    checkup_date TIMESTAMP WITH TIME ZONE,
    answers JSONB,           -- Réponses aux questions
    scores JSONB,            -- Scores par bloc
    global_score INTEGER,    -- Score global (0-100)
    comments JSONB,          -- Commentaires additionnels
    country TEXT,            -- Code pays (FR, BR)
    language TEXT,           -- Code langue (fr, br)
    version TEXT,            -- Version du format
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Structure des données JSON
```typescript
interface CheckupAnswer {
  questionId: string;
  answer: string | number;
  block: CheckupBlock;
}

interface CheckupScore {
  block: CheckupBlock;
  score: number;
  maxScore: number;
  percentage: number;
}

interface CheckupResult {
  id?: string;
  userId: string;
  checkupDate: Date;
  answers: CheckupAnswer[];
  scores: CheckupScore[];
  globalScore: number;
  comments: Record<string, string>;
  country: string;
  language: string;
  version: string;
}
```

## Utilisation

### Accès au module
1. **Via le dashboard** : Bouton "Financial Check-up 360°" dans les actions rapides
2. **URL directe** : `/{locale}/financial-checkup` (ex: `/fr/financial-checkup`)

### Parcours utilisateur
1. **Page d'accueil** : Présentation du module, sélection pays/langue
2. **Questions** : 5 blocs de 4 questions chacun (20 questions total)
3. **Résultats** : Score global, scores par bloc, recommandations

### Intégration dans le dashboard
Le module s'intègre dans le dashboard principal avec :
- Carte de résumé dans la sidebar
- Bouton d'accès rapide
- Historique des diagnostics

## Personnalisation

### Ajout de nouvelles questions
1. Modifier `lib/financial-checkup/data.ts`
2. Ajouter les questions dans le bloc approprié
3. Définir les options et scores

### Ajout de nouvelles langues
1. Ajouter la traduction dans `data.ts`
2. Adapter les questions au contexte local
3. Mettre à jour les sélecteurs de langue

### Modification du scoring
1. Ajuster les scores dans les options de questions
2. Modifier la logique de calcul dans `calculateQuestionScore()`
3. Adapter les seuils de recommandations

## Sécurité

### RLS (Row Level Security)
- Les utilisateurs ne peuvent voir que leurs propres diagnostics
- Authentification requise pour accéder au module
- Validation des données côté serveur

### Validation des données
- Validation TypeScript stricte
- Validation des réponses avant sauvegarde
- Gestion des erreurs avec fallbacks

## Performance

### Optimisations
- Chargement dynamique des composants
- Animations optimisées avec Framer Motion
- Mise en cache des données utilisateur
- Lazy loading des images et icônes

### Mobile-first
- Design responsive optimisé mobile
- Interactions tactiles fluides
- Performance optimisée sur appareils mobiles

## Maintenance

### Monitoring
- Logs des erreurs dans la console
- Tracking des performances
- Métriques d'utilisation

### Mises à jour
- Versioning des données
- Migration automatique des anciens formats
- Rétrocompatibilité maintenue

## Support et développement

### Dépendances
```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "@supabase/supabase-js": "^2.x"
}
```

### Scripts utiles
```bash
# Appliquer la migration Supabase
supabase db push

# Tester le module
npm run dev
# Puis naviguer vers /fr/financial-checkup ou /br/financial-checkup
```

### Points d'attention
- Vérifier la cohérence des traductions
- Tester sur différents appareils mobiles
- Valider les scores et recommandations
- Surveiller les performances de la base de données

## Roadmap

### Fonctionnalités futures
- [ ] Export PDF des résultats
- [ ] Partage des résultats
- [ ] Comparaison avec les moyennes nationales
- [ ] Recommandations plus détaillées
- [ ] Intégration avec d'autres modules PIM
- [ ] Notifications de rappel pour refaire le diagnostic

### Améliorations techniques
- [ ] PWA (Progressive Web App)
- [ ] Mode hors ligne
- [ ] Synchronisation multi-appareils
- [ ] API publique pour intégrations tierces 