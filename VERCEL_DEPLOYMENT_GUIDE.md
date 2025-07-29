# 🚀 Guide de Déploiement Vercel avec Sanity

## 🔍 **Problème : Articles de blog non affichés sur Vercel**

### **Causes possibles :**

1. **Variables d'environnement manquantes**
2. **Configuration Sanity incorrecte**
3. **Permissions de token insuffisantes**
4. **Cache Vercel**

## 🔧 **Solutions**

### **1. Configuration des Variables d'Environnement Vercel**

#### **Étapes :**

1. **Allez sur https://vercel.com/dashboard**
2. **Sélectionnez votre projet**
3. **Allez dans "Settings" > "Environment Variables"**
4. **Ajoutez ces variables :**

```env
# Variables publiques (NEXT_PUBLIC_*)
NEXT_PUBLIC_SANITY_PROJECT_ID=y5sty7n2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-29

# Variables privées
SANITY_API_TOKEN=sk_votre_token_ici
```

#### **Important :**
- **NEXT_PUBLIC_*** : Variables accessibles côté client
- **SANITY_API_TOKEN** : Variable privée (pas de NEXT_PUBLIC_)
- **Environnements** : Sélectionnez "Production", "Preview", "Development"

### **2. Vérification du Token Sanity**

#### **Permissions requises :**
- ✅ **Read** (lecture)
- ✅ **Write** (écriture)
- ✅ **Create** (création)

#### **Vérification :**
1. Allez sur https://www.sanity.io/manage
2. Sélectionnez votre projet
3. Settings > API > Tokens
4. Vérifiez que le token a les permissions "Editor"

### **3. Test de Configuration**

#### **Script de test :**
```bash
# Local
npx tsx scripts/check-vercel-env.ts

# Ou vérifiez manuellement
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $SANITY_API_TOKEN
```

### **4. Redéploiement**

#### **Après configuration :**
1. **Commit et push** vos changements
2. **Vercel redéploie automatiquement**
3. **Ou forcez un redéploiement** dans le dashboard Vercel

### **5. Vérification du Cache**

#### **Si les articles n'apparaissent toujours pas :**
1. **Vercel Dashboard** > **Deployments**
2. **Cliquez sur le dernier déploiement**
3. **"Redeploy"** (bouton avec flèche)

### **6. Debug en Production**

#### **Ajoutez des logs temporaires :**

```typescript
// Dans hooks/useSanityBlog.ts
const getArticlesByCountry = async (country: string): Promise<BlogArticle[]> => {
  try {
    console.log('🔍 Récupération articles pour pays:', country);
    console.log('🔧 Config Sanity:', {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN
    });
    
    const articles = await sanityClient.fetch(queries.getArticlesByCountry, { country });
    console.log('📄 Articles trouvés:', articles?.length || 0);
    
    return articles || [];
  } catch (error) {
    console.error('❌ Erreur récupération articles:', error);
    return [];
  }
};
```

### **7. Vérification des URLs**

#### **URLs de test :**
- **Blog BR** : `https://votre-app.vercel.app/br/blog`
- **Blog FR** : `https://votre-app.vercel.app/fr/blog`
- **Article spécifique** : `https://votre-app.vercel.app/br/blog/descontos-folha-pagamento-verificar-corretos`

### **8. Configuration CORS Sanity**

#### **Si erreurs CORS :**
1. **Sanity Dashboard** > **API** > **CORS Origins**
2. **Ajoutez** : `https://votre-app.vercel.app`
3. **Sauvegardez**

## 🧪 **Scripts de Test**

### **Test local :**
```bash
npx tsx scripts/check-vercel-env.ts
```

### **Test production :**
```bash
# Dans les logs Vercel ou console navigateur
console.log('Sanity Config:', {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
});
```

## 📋 **Checklist de Déploiement**

- [ ] Variables d'environnement configurées sur Vercel
- [ ] Token Sanity avec permissions "Editor"
- [ ] Articles insérés dans Sanity
- [ ] Redéploiement Vercel effectué
- [ ] CORS configuré si nécessaire
- [ ] URLs testées en production

## 🆘 **Dépannage**

### **Erreur "Missing environment variable"**
- Vérifiez que toutes les variables sont dans Vercel
- Redéployez après ajout des variables

### **Erreur "Insufficient permissions"**
- Vérifiez les permissions du token Sanity
- Créez un nouveau token si nécessaire

### **Articles non trouvés**
- Vérifiez que les articles sont dans le bon dataset
- Vérifiez les requêtes GROQ
- Testez la connexion Sanity

### **Cache persistant**
- Forcez un redéploiement complet
- Vérifiez les headers de cache 