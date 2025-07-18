# Documentation du Composant `<Seguros />`

## 1. Vue d'ensemble

Le composant `<Seguros />` a été développé pour afficher les assurances d'un utilisateur sur son dashboard. Il a été conçu en clonant intégralement la structure, le style et la logique du composant `<BemEstar />` (qui gère les bénéfices) afin d'assurer une expérience utilisateur cohérente à travers la plateforme.

Le composant est responsable de :
- Afficher un résumé des assurances détectées.
- Présenter une liste paginée des assurances avec des détails.
- Fournir du contenu pédagogique et des appels à l'action.

## 2. Clonage de la Logique de "Benefícios"

Pour accélérer le développement et maintenir la cohérence, `<Seguros />` réutilise les éléments suivants de `<BemEstar />` :

- **Structure des Cartes (Cards)** : Utilisation de `Card`, `CardHeader`, `CardContent` de shadcn/ui pour le résumé, le tableau de détails, les tuiles pédagogiques et la section d'action.
- **Pagination** : Le système de pagination client-side qui affiche 3 éléments par page et utilise des "dots" pour la navigation est identique.
- **Disposition Responsive** : Le tableau de détails se transforme en une liste (ou accordéon) sur les appareils mobiles, tout comme dans "Benefícios".
- **Composants UI** : Réutilisation des `Badge`, `Table`, `Button`, et des icônes de `lucide-react`.

## 3. Alimentation de la Table Supabase

Le composant récupère ses données depuis la table `seguros` dans Supabase via le hook `useSeguros`. Pour tester le composant en développement, vous pouvez insérer des données de test directement dans votre base de données Supabase.

### Schéma de la table `seguros`
```sql
create table if not exists seguros (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references auth.users(id),
  type         text        not null,    -- 'saude','vida','acidentes','odontologico','rcp','pet'
  detected     boolean     not null,
  comment      text        not null,
  link         text        not null,
  priority     integer     not null default 0,
  updated_at   timestamptz not null default now()
);
```

### Exemple de Données de Test (SQL)

Pour valider la pagination et les différents états, insérez au moins 6 assurances pour un utilisateur de test. Remplacez `'VOTRE_USER_ID'` par l'ID de l'utilisateur de test.

```sql
INSERT INTO public.seguros (user_id, type, detected, comment, link, priority) VALUES
('VOTRE_USER_ID', 'saude', true, 'Plano de saúde empresarial básico incluído no seu pacote de benefícios.', '/beneficios/meu-plano-saude', 1),
('VOTRE_USER_ID', 'vida', true, 'Seguro de vida em grupo com cobertura de 24x o seu salário base.', '/beneficios/seguro-vida', 2),
('VOTRE_USER_ID', 'odontologico', false, 'Você ainda não possui um plano odontológico. Considere adicionar para cobrir despesas dentárias.', '/beneficios/planos-disponiveis', 3),
('VOTRE_USER_ID', 'acidentes', true, 'Cobertura para acidentes pessoais durante o horário de trabalho.', '/beneficios/detalhes-acidentes', 4),
('VOTRE_USER_ID', 'rcp', false, 'Para sua profissão, um seguro de Responsabilidade Civil Profissional é altamente recomendado. Simule agora.', '/simuladores/rcp', 5),
('VOTRE_USER_ID', 'pet', false, 'Sabia que existem seguros para cobrir despesas veterinárias do seu pet? Conheça as opções.', '/guias/seguro-pet', 6);
```

Ce `README` devrait fournir toutes les informations nécessaires pour comprendre, maintenir et tester le composant `<Seguros />`.
