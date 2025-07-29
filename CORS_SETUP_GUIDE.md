# 🌐 Guide de Configuration CORS Sanity pour Vercel

## 🔍 **Problème : Articles non affichés sur Vercel**

L'erreur CORS peut empêcher l'affichage des articles sur Vercel même si les variables d'environnement sont correctes.

## 📋 **Étapes de Configuration CORS**

### **1. Trouver votre Domaine Vercel**

1. **Allez sur https://vercel.com/dashboard**
2. **Sélectionnez votre projet**
3. **Regardez l'URL dans la barre d'adresse**
4. **Copiez le domaine** (ex: `https://mon-app.vercel.app`)

### **2. Accéder aux CORS Origins Sanity**

1. **Allez sur https://www.sanity.io/manage**
2. **Sélectionnez votre projet** (ID: `y5sty7n2`)
3. **Cliquez sur "Settings"** (⚙️)
4. **Cliquez sur "API"** dans le menu de gauche
5. **Cliquez sur "CORS Origins"**

### **3. Ajouter le Domaine Vercel**

1. **Cliquez "Add CORS Origin"**
2. **Remplissez les champs :**

```
Nom: Vercel Production
Origin: https://[votre-domaine].vercel.app
Allow Credentials: ✅ Coché
Allow Origin: ✅ Coché
```

### **4. Domaines à Ajouter**

#### **Production (obligatoire) :**
```
https://[votre-app].vercel.app
```

#### **Preview (optionnel) :**
```
https://[votre-app]-git-[branch]-[user].vercel.app
```

#### **Développement (optionnel) :**
```
http://localhost:3000
http://localhost:3001
```

## 🔧 **Exemples de Domaines Vercel**

### **Format Standard :**
- `https://pimsite.vercel.app`
- `https://mon-projet.vercel.app`
- `https://app-personnalisee.vercel.app`

### **Format avec Hash :**
- `https://pimsite-abc123.vercel.app`
- `https://mon-projet-def456.vercel.app`

### **Format Preview :**
- `https://pimsite-git-main-username.vercel.app`
- `https://mon-projet-git-feature-user.vercel.app`

## 📝 **Configuration Complète**

### **Étape 1 : Ajouter le domaine principal**
```
Nom: Vercel Production
Origin: https://votre-app.vercel.app
Allow Credentials: ✅
Allow Origin: ✅
```

### **Étape 2 : Tester**
1. **Attendez 2-3 minutes** que les changements se propagent
2. **Redéployez votre app Vercel**
3. **Testez l'URL** : `https://votre-app.vercel.app/br/blog`

### **Étape 3 : Ajouter les domaines supplémentaires (optionnel)**
Si nécessaire, ajoutez :
- Domaine de preview
- Domaines de développement

## 🧪 **Test de Configuration**

### **Script de test :**
```bash
npx tsx scripts/debug-sanity-token.ts
```

### **Test manuel :**
1. **Ouvrez votre app Vercel**
2. **Allez sur `/br/blog`**
3. **Ouvrez la console du navigateur (F12)**
4. **Vérifiez s'il y a des erreurs CORS**

## 🆘 **Dépannage**

### **Erreur CORS persistante :**
1. **Vérifiez que le domaine est exact**
2. **Attendez 5-10 minutes**
3. **Redéployez Vercel**
4. **Videz le cache du navigateur**

### **Domaine non trouvé :**
1. **Vérifiez l'URL dans Vercel Dashboard**
2. **Copiez exactement le domaine**
3. **Incluez le protocole `https://`**

### **Configuration non prise en compte :**
1. **Vérifiez que vous êtes sur le bon projet Sanity**
2. **Sauvegardez bien les changements**
3. **Attendez la propagation**

## 📊 **Vérification Finale**

Après configuration CORS :

1. ✅ **Domaine ajouté dans Sanity CORS**
2. ✅ **Variables d'environnement sur Vercel**
3. ✅ **Token Sanity avec bonnes permissions**
4. ✅ **Articles insérés dans Sanity**
5. ✅ **Redéploiement Vercel effectué**

## 🔗 **URLs de Test**

- **Blog BR** : `https://votre-app.vercel.app/br/blog`
- **Blog FR** : `https://votre-app.vercel.app/fr/blog`
- **Article spécifique** : `https://votre-app.vercel.app/br/blog/descontos-folha-pagamento-verificar-corretos` 