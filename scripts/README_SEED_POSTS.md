# 🌱 Seed Posts - Articles de Blog PIM

Ce dossier contient les scripts et données pour créer automatiquement 5 articles de blog sur la feuille de paie brésilienne dans Sanity.io.

## 📁 Structure des fichiers

```
scripts/
├── seeds/
│   └── posts/
│       ├── descontos-folha-pagamento.ts
│       ├── inss-impacto-salario.ts
│       ├── irrf-imposto-renda-holerite.ts
│       ├── beneficios-corporativos-holerite.ts
│       └── clt-pj-estagio-folha-pagamento.ts
├── seedPosts.ts
├── test-seed-posts.ts
└── README_SEED_POSTS.md
```

## 📝 Articles créés

1. **"Descontos na folha de pagamento: o que são e como verificar se estão corretos?"**
   - Explication des déductions obligatoires et optionnelles
   - Guide de vérification des calculs

2. **"O que é INSS e como ele impacta seu salário líquido?"**
   - Fonctionnement de l'INSS et ses alíquotas
   - Impact sur le salaire net

3. **"Entenda o IRRF: por que o imposto de renda vem descontado no holerite?"**
   - Calcul de l'IRRF et alíquotas progressives
   - Restituição et déductions

4. **"Benefícios corporativos: quais são e como valorizá-los no seu holerite?"**
   - Vale-refeição, plan de santé, etc.
   - Calcul du vrai valeur des avantages

5. **"CLT, PJ ou estágio: como a estrutura da folha muda conforme o tipo de contrato?"**
   - Comparaison des modalités de contrat
   - Avantages et inconvénients

## 🚀 Utilisation

### 1. Test des articles

```bash
pnpm tsx scripts/test-seed-posts.ts
```

Ce script vérifie que tous les articles sont correctement structurés avant insertion.

### 2. Insertion dans Sanity

```bash
pnpm tsx scripts/seedPosts.ts
```

Ce script insère ou met à jour tous les articles dans Sanity.io.

## ⚙️ Configuration requise

### Variables d'environnement

Assurez-vous d'avoir ces variables dans votre `.env.local` :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
```

### Token API Sanity

Le token doit avoir les permissions suivantes :
- `create` pour créer de nouveaux articles
- `update` pour mettre à jour les articles existants

## 📊 Structure des articles

Chaque article contient :

```typescript
{
  title: string,           // Titre de l'article
  slug: string,           // Slug URL-friendly
  excerpt: string,        // Résumé (max 200 caractères)
  country: "br",          // Pays (BR pour Brésil)
  language: "pt-BR",      // Langue (portugais brésilien)
  publishedAt: string,    // Date de publication (ISO)
  metaTitle: string,      // Titre SEO
  metaDescription: string, // Description SEO
  tags: string[],         // Tags pour catégorisation
  body: PortableTextBlock[] // Contenu riche en Portable Text
}
```

## 🔍 Vérification

Après insertion, vous pouvez vérifier les articles :

1. **Sanity Studio** : `http://localhost:3001/studio`
2. **Blog** : `http://localhost:3001/br/blog`
3. **Articles individuels** : `http://localhost:3001/br/blog/[slug]`

## 📈 Statistiques des articles

- **Total d'articles** : 5
- **Contenu total** : ~15,000 caractères
- **Temps de lecture estimé** : 75 minutes
- **Langue** : Portugais brésilien
- **Pays cible** : Brésil

## 🛠️ Personnalisation

### Ajouter un nouvel article

1. Créez un nouveau fichier dans `scripts/seeds/posts/`
2. Suivez la structure des articles existants
3. Ajoutez l'article au tableau dans `seedPosts.ts`
4. Testez avec `test-seed-posts.ts`
5. Insérez avec `seedPosts.ts`

### Modifier un article existant

1. Modifiez le fichier correspondant dans `scripts/seeds/posts/`
2. Le script `seedPosts.ts` mettra à jour l'article existant
3. Testez et insérez

## 🎯 Objectifs SEO

Les articles sont optimisés pour :

- **Mots-clés** : holerite, folha de pagamento, INSS, IRRF, benefícios
- **Public cible** : Salariés brésiliens (CLT, PJ, estagiários)
- **Intention** : Éducation et information sur la feuille de paie
- **Ton** : Pédagogique, accessible, avec exemples pratiques

## 📞 Support

En cas de problème :

1. Vérifiez les variables d'environnement
2. Testez avec `test-seed-posts.ts`
3. Vérifiez les permissions du token Sanity
4. Consultez les logs d'erreur

---

**Créé pour PIM - Plateforme d'éducation financière pour salariés brésiliens** 🇧🇷 