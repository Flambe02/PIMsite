# 🔧 Guide de Configuration Sanity pour les Articles de Blog

## 📋 Prérequis

Avant d'insérer les articles, vous devez configurer les variables d'environnement Sanity.

## 🚀 Étapes de Configuration

### 1. Accéder à Sanity Studio

1. Allez sur `http://localhost:3001/studio`
2. Connectez-vous avec votre compte GitHub
3. Sélectionnez votre projet Sanity

### 2. Obtenir le Project ID

1. Dans Sanity Studio, allez dans **Settings** (⚙️)
2. Cliquez sur **API**
3. Copiez le **Project ID** (ex: `y5sty7n2`)

### 3. Créer un Token API

1. Dans **Settings** > **API**
2. Cliquez sur **Add API token**
3. Donnez un nom (ex: "Blog Posts Token")
4. Sélectionnez **Editor** ou **Write** permissions
5. Copiez le token généré

### 4. Configurer les Variables d'Environnement

Ajoutez ces lignes à votre fichier `.env.local` :

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=y5sty7n2
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_your_token_here
```

**⚠️ Important :**
- Remplacez `y5sty7n2` par votre vrai Project ID
- Remplacez `sk_your_token_here` par votre vrai token API
- Le token doit avoir les permissions **Write** ou **Editor**

### 5. Vérifier la Configuration

Testez la configuration :

```bash
npx tsx -e "console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID); console.log('Token:', process.env.SANITY_API_TOKEN ? 'OK' : 'Manquant');"
```

## 📝 Insertion des Articles

Une fois configuré, vous pouvez insérer les articles :

```bash
# Test des articles
pnpm tsx scripts/test-seed-posts.ts

# Insertion dans Sanity
pnpm tsx scripts/seedPosts.ts
```

## 🔍 Vérification

Après insertion, vérifiez :

1. **Sanity Studio** : `http://localhost:3001/studio`
   - Allez dans **Posts**
   - Vous devriez voir 5 nouveaux articles

2. **Blog** : `http://localhost:3001/br/blog`
   - Les articles devraient apparaître dans la liste

3. **Articles individuels** :
   - `http://localhost:3001/br/blog/descontos-folha-pagamento-verificar-corretos`
   - `http://localhost:3001/br/blog/inss-impacto-salario-liquido`
   - etc.

## 🛠️ Dépannage

### Erreur "Project ID non défini"
- Vérifiez que `NEXT_PUBLIC_SANITY_PROJECT_ID` est dans `.env.local`
- Redémarrez le serveur de développement

### Erreur "Token non défini"
- Vérifiez que `SANITY_API_TOKEN` est dans `.env.local`
- Assurez-vous que le token a les bonnes permissions

### Erreur "Insufficient permissions"
- Le token doit avoir les permissions **Write** ou **Editor**
- Créez un nouveau token avec les bonnes permissions

### Erreur de connexion
- Vérifiez que Sanity Studio fonctionne
- Vérifiez votre connexion internet
- Vérifiez que le Project ID est correct

## 📊 Articles à Insérer

1. **Descontos na folha de pagamento** - Guide des déductions
2. **O que é INSS** - Impact sur le salaire net
3. **Entenda o IRRF** - Impôt sur le revenu
4. **Benefícios corporativos** - Avantages sociaux
5. **CLT, PJ ou estágio** - Comparaison des contrats

## 🎯 Résultat Attendu

- ✅ 5 articles créés dans Sanity
- ✅ Contenu riche en portugais brésilien
- ✅ SEO optimisé
- ✅ Structure Portable Text
- ✅ Métadonnées complètes

---

**Besoin d'aide ?** Vérifiez d'abord ce guide, puis consultez la documentation Sanity. 