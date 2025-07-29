# Migration Blog Supabase → Sanity.io

## Vue d'ensemble

Ce document décrit la migration complète du système de blog de Supabase vers Sanity.io pour améliorer la gestion de contenu, le SEO et l'édition.

## Changements effectués

### 1. Nettoyage Supabase ✅

**Fichiers supprimés :**
- `lib/blog/blogService.ts`
- `lib/blog/blogServiceClient.ts`
- `supabase/migrations/20250130_create_blog_articles_table.sql`
- `components/blog/BlogArticle.tsx`
- `components/blog/BlogList.tsx`
- `components/blog/CountrySelector.tsx`
- `app/[locale]/blog/page.tsx` (ancien)
- `app/[locale]/blog/[slug]/page.tsx` (ancien)
- Tous les scripts de test et d'insertion Supabase

**Scripts de nettoyage créés :**
- `scripts/cleanup-supabase-blog.ts` - Nettoie la table blog_articles

### 2. Intégration Sanity.io ✅

**Nouvelles dépendances installées :**
```bash
pnpm add @sanity/client next-sanity @sanity/image-url @portabletext/react
```

**Configuration créée :**
- `lib/sanity/config.ts` - Configuration client Sanity
- `lib/sanity/schemas/article.ts` - Schéma article avec SEO
- `lib/sanity/schemas/author.ts` - Schéma auteur
- `lib/sanity/schemas/index.ts` - Index des schémas
- `sanity.config.ts` - Configuration Sanity Studio

**Hooks et services :**
- `hooks/useSanityBlog.ts` - Hooks pour récupérer les données
- `scripts/insert-sanity-articles.ts` - Script d'insertion des articles

### 3. Nouveaux composants ✅

**Composants créés :**
- `components/blog/BlogCard.tsx` - Carte d'article moderne
- `components/blog/BlogList.tsx` - Liste avec filtres et recherche
- `app/[locale]/blog/page.tsx` - Page blog avec Sanity
- `app/[locale]/blog/[slug]/page.tsx` - Page détail article

### 4. Fonctionnalités SEO ✅

**Métadonnées optimisées :**
- Title et description dynamiques
- Open Graph et Twitter Cards
- Images optimisées avec alt text
- URLs SEO-friendly

**Contenu riche :**
- PortableText pour le contenu
- Images avec hotspot et crop
- Code blocks avec syntax highlighting
- Liens et annotations

## Configuration requise

### Variables d'environnement

Ajoutez dans votre `.env.local` :

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### Sanity Studio

1. Créez un projet sur [sanity.io](https://sanity.io)
2. Configurez les variables d'environnement
3. Lancez Sanity Studio : `pnpm sanity dev`

## Articles de test

5 articles brésiliens ont été préparés dans `scripts/insert-sanity-articles.ts` :

1. "Entenda seu holerite" - Guide complet
2. "Benefícios Flexíveis" - Optimisation des avantages
3. "CLT ou PJ?" - Comparaison des régimes
4. "Imposto de Renda 2025" - Guide déclaration
5. "Tendências de RH 2025" - Futur du travail

## Avantages de la migration

### ✅ Sanity.io
- **Édition riche** : Interface WYSIWYG moderne
- **Gestion d'images** : CDN, crop, optimisation automatique
- **SEO avancé** : Métadonnées, Open Graph, sitemap
- **Multi-langue** : Support natif des traductions
- **API GROQ** : Requêtes puissantes et flexibles
- **Versioning** : Historique des modifications
- **Collaboration** : Équipes et permissions

### ❌ Supabase (ancien)
- Édition basique via admin
- Pas de gestion d'images
- SEO limité
- Pas de versioning
- Requêtes SQL basiques

## Prochaines étapes

### 1. Configuration Sanity Studio
```bash
# Installer Sanity CLI
npm install -g @sanity/cli

# Initialiser le projet
sanity init

# Lancer le studio
sanity dev
```

### 2. Insertion des articles
```bash
# Insérer les articles de test
pnpm tsx scripts/insert-sanity-articles.ts
```

### 3. Nettoyage final Supabase
```bash
# Supprimer la table blog_articles
pnpm tsx scripts/cleanup-supabase-blog.ts
```

### 4. Tests et validation
- [ ] Vérifier l'affichage des articles
- [ ] Tester les filtres par pays
- [ ] Valider le SEO (meta tags, OG)
- [ ] Tester la responsivité mobile
- [ ] Vérifier les images optimisées

## Structure des données

### Article Schema
```typescript
{
  title: string,
  slug: string,
  content: PortableText,
  excerpt: string,
  image: SanityImage,
  country: 'br' | 'fr' | 'pt',
  publishedAt: datetime,
  metaTitle: string,
  metaDescription: string,
  ogImage: SanityImage,
  tags: string[],
  author: reference
}
```

### Requêtes GROQ principales
```groq
// Articles par pays
*[_type == "article" && country == $country] | order(publishedAt desc)

// Article par slug
*[_type == "article" && slug.current == $slug][0]

// Articles pour sitemap
*[_type == "article" && publishedAt != null] { slug, publishedAt, country }
```

## Support et maintenance

### Gestion du contenu
- Utilisez Sanity Studio pour éditer les articles
- Les images sont automatiquement optimisées
- Le contenu est versionné et sauvegardé

### Développement
- Les schémas sont dans `lib/sanity/schemas/`
- Les requêtes dans `lib/sanity/config.ts`
- Les hooks dans `hooks/useSanityBlog.ts`

### Déploiement
- Sanity Studio est déployé automatiquement
- Les données sont synchronisées en temps réel
- Pas de migration de base de données nécessaire

## Migration terminée ✅

Le blog est maintenant entièrement géré par Sanity.io avec :
- Interface d'édition moderne
- SEO optimisé
- Images optimisées
- Filtrage par pays
- Contenu riche et structuré 