# 📝 Guide Frontend du Système de Blog PIM

## 🎯 Vue d'ensemble

Le système de blog PIM intègre un **filtrage automatique par pays** et un **support multilingue complet**. Chaque utilisateur ne voit que les articles de son pays sélectionné, avec une interface dans la langue appropriée.

## 🏗️ Architecture

### Composants Principaux

1. **`useCountry` Hook** : Gestion de la détection et sélection du pays
2. **`CountrySelector`** : Interface de sélection du pays
3. **`BlogList`** : Liste d'articles filtrés par pays
4. **`BlogArticle`** : Affichage d'un article individuel
5. **Pages** : `/blog` et `/blog/[slug]`

### Flux de Données

```
URL Parameter → useCountry Hook → Country Detection → BlogService → Supabase Query → Filtered Articles
```

## 🔧 Configuration du Pays

### Détection Automatique

Le système détecte automatiquement le pays selon cette priorité :

1. **Paramètre URL** : `?country=br`
2. **localStorage** : `pim_country`
3. **Navigateur** : `navigator.language`
4. **Défaut** : Brésil (`br`)

### Configuration des Pays

```typescript
export const COUNTRY_CONFIGS = {
  br: {
    code: 'br',
    name: 'Brasil',
    language: 'pt',
    flag: '🇧🇷',
    currency: 'R$'
  },
  fr: {
    code: 'fr',
    name: 'France',
    language: 'fr',
    flag: '🇫🇷',
    currency: '€'
  },
  // ...
};
```

## 📱 Utilisation des Composants

### 1. Hook useCountry

```typescript
import { useCountry } from '@/hooks/useCountry';

function MyComponent() {
  const { 
    currentCountry, 
    changeCountry, 
    getCurrentLanguage,
    isLoading 
  } = useCountry();

  return (
    <div>
      <p>Pays actuel: {currentCountry}</p>
      <p>Langue: {getCurrentLanguage()}</p>
      <button onClick={() => changeCountry('fr')}>
        Changer pour la France
      </button>
    </div>
  );
}
```

### 2. Sélecteur de Pays

```typescript
import { CountrySelector } from '@/components/blog/CountrySelector';

// Dropdown (par défaut)
<CountrySelector />

// Boutons
<CountrySelector variant="buttons" />
```

### 3. Liste d'Articles

```typescript
import { BlogList } from '@/components/blog/BlogList';

// Utilisation simple
<BlogList />

// Avec classe personnalisée
<BlogList className="my-custom-class" />
```

### 4. Article Individuel

```typescript
import { BlogArticle } from '@/components/blog/BlogArticle';

// Via slug
<BlogArticle slug="mon-article" />

// Via URL params (automatique)
<BlogArticle />
```

## 🌐 Support Multilingue

### Traductions Intégrées

Le système inclut des traductions pour :

- **Portugais (BR)** : Interface complète
- **Français (FR)** : Interface complète  
- **Espagnol (ES)** : Interface complète
- **Anglais (EN)** : Interface complète

### Structure des Traductions

```json
{
  "br": {
    "blog": {
      "title": "Blog PIM",
      "noArticles": "Nenhum artigo disponível no momento",
      "readMore": "Ler mais"
    }
  },
  "fr": {
    "blog": {
      "title": "Blog PIM", 
      "noArticles": "Aucun article disponible pour le moment",
      "readMore": "Lire la suite"
    }
  }
}
```

## 📊 Filtrage et Recherche

### Filtrage Automatique par Pays

```sql
-- Requête Supabase automatique
SELECT * FROM blog_articles 
WHERE country = $currentCountry 
ORDER BY published_at DESC
```

### Recherche et Catégories

- **Recherche textuelle** : Titre, extrait, contenu
- **Filtres par catégorie** : Holerite, Finances, Impôts, Bénéfices, Conseils
- **Tri** : Date de publication décroissante

## 🎨 Interface Utilisateur

### Design Responsive

- **Mobile-first** : Optimisé pour mobile
- **Tablette** : Grille 2 colonnes
- **Desktop** : Grille 3 colonnes

### États de Chargement

```typescript
// État de chargement
{isLoading && (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
)}

// État vide
{articles.length === 0 && (
  <div className="text-center py-12">
    <p>{t.noArticles}</p>
  </div>
)}
```

## 📄 Pages Disponibles

### 1. Page Liste (`/blog`)

```typescript
// app/[locale]/blog/page.tsx
import { BlogList } from '@/components/blog/BlogList';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogList />
    </div>
  );
}
```

### 2. Page Article (`/blog/[slug]`)

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { BlogArticle } from '@/components/blog/BlogArticle';

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogArticle slug={params.slug} />
    </div>
  );
}
```

## 🚀 Ajout d'Articles

### 1. Via Script de Seed

```bash
# Exécuter le script de seed
npx tsx scripts/seed-blog-articles.ts
```

### 2. Via Supabase Directement

```sql
INSERT INTO blog_articles (
  country,
  title,
  slug,
  content_markdown,
  excerpt,
  author
) VALUES (
  'br',
  'Mon Article',
  'mon-article',
  '# Contenu markdown...',
  'Extrait de l\'article',
  'PIM Team'
);
```

### 3. Via Service

```typescript
import { BlogService } from '@/lib/blog/blogService';

await BlogService.createArticle({
  country: 'br',
  title: 'Mon Article',
  slug: 'mon-article',
  content_markdown: '# Contenu...',
  excerpt: 'Extrait...',
  author: 'PIM Team'
});
```

## 📝 Structure d'Article

### Champs Requis

```typescript
interface BlogArticle {
  country: string;           // 'br', 'fr', 'es', 'autre'
  title: string;             // Titre de l'article
  slug: string;              // URL unique
  content_markdown: string;  // Contenu en markdown
  excerpt?: string;          // Extrait optionnel
  author?: string;           // Auteur (défaut: 'PIM Team')
  featured_image_url?: string; // Image de couverture
}
```

### Exemple d'Article Brésilien

```markdown
# Comment lire votre holerite

## Introduction

Le holerite est un document essentiel...

## Structure

### 1. Informations de Base
**Empresa**: Nom de votre employeur...

### 2. Salário Bruto
Le salaire brut représente...

## Conclusion

Comprendre votre holerite est essentiel...

**Ressources utiles**:
- [Calculadora](https://example.com)
- [Guia](https://example.com)
```

## 🔧 Configuration Avancée

### 1. Ajouter un Nouveau Pays

```typescript
// hooks/useCountry.ts
export const COUNTRY_CONFIGS = {
  // ... pays existants
  es: {
    code: 'es',
    name: 'España',
    language: 'es',
    flag: '🇪🇸',
    currency: '€'
  }
};
```

### 2. Ajouter des Traductions

```json
// locales/blog.json
{
  "es": {
    "blog": {
      "title": "Blog PIM",
      "noArticles": "No hay artículos disponibles",
      "readMore": "Leer más"
    }
  }
}
```

### 3. Personnaliser le Style

```css
/* styles/blog.css */
.blog-card {
  @apply hover:shadow-lg transition-shadow;
}

.markdown-content {
  @apply prose prose-lg max-w-none;
}
```

## 🧪 Tests et Validation

### Tests de Composants

```typescript
// __tests__/BlogList.test.tsx
import { render, screen } from '@testing-library/react';
import { BlogList } from '@/components/blog/BlogList';

test('affiche les articles du pays sélectionné', () => {
  render(<BlogList />);
  expect(screen.getByText('Blog PIM')).toBeInTheDocument();
});
```

### Validation des Données

```typescript
// Validation côté client
if (article.country !== currentCountry) {
  setError('Article non disponible pour votre pays');
  return;
}
```

## 📈 Métriques et Analytics

### Statistiques d'Utilisation

```typescript
// Récupération des stats
const blogStats = await BlogService.getBlogStats();
// { "br": 10, "fr": 5, "es": 3 }
```

### Tracking des Interactions

```typescript
// Analytics des articles
const trackArticleView = (articleSlug: string, country: string) => {
  analytics.track('article_view', {
    slug: articleSlug,
    country: country,
    timestamp: new Date()
  });
};
```

## 🚨 Gestion d'Erreurs

### Erreurs Courantes

1. **Article non trouvé** : 404 avec message localisé
2. **Pays non supporté** : Redirection vers le pays par défaut
3. **Erreur de chargement** : Retry automatique avec fallback

### Fallbacks

```typescript
// Fallback pour pays non supporté
if (!COUNTRY_CONFIGS[detectedCountry]) {
  setCurrentCountry('br'); // Pays par défaut
}

// Fallback pour contenu manquant
if (!article) {
  return <NotFoundMessage country={currentCountry} />;
}
```

## ✅ Checklist d'Implémentation

- [x] **Hook useCountry** : Détection et gestion du pays
- [x] **CountrySelector** : Interface de sélection
- [x] **BlogList** : Liste filtrée par pays
- [x] **BlogArticle** : Affichage individuel
- [x] **Pages** : Routes `/blog` et `/blog/[slug]`
- [x] **Traductions** : Support multilingue complet
- [x] **Responsive** : Design mobile-first
- [x] **SEO** : Métadonnées par pays
- [x] **Performance** : Chargement optimisé
- [x] **Accessibilité** : Support ARIA

## 🎯 Résultat Final

Le système de blog PIM offre maintenant :

1. ✅ **Filtrage automatique par pays** : Chaque utilisateur ne voit que les articles de son pays
2. ✅ **Interface multilingue** : Labels et messages dans la langue du pays
3. ✅ **Design responsive** : Optimisé pour tous les appareils
4. ✅ **Performance optimisée** : Chargement rapide et efficace
5. ✅ **Extensibilité** : Facile d'ajouter de nouveaux pays
6. ✅ **SEO friendly** : URLs propres et métadonnées appropriées

Le système est **prêt pour la production** et offre une expérience utilisateur optimale pour chaque pays supporté. 🚀 