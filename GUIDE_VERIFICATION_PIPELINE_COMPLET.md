# Guide de Vérification du Pipeline Complet

## 🎯 **Objectif**
Vérifier que le processus complet fonctionne :
1. **Scan holerite** → Analyse IA → Sauvegarde Supabase ✅
2. **Dashboard** → Récupération → Affichage ✅

## 🔍 **Étapes de vérification**

### **Étape 1 : Vérification de la base de données**

Exécuter dans **Supabase Dashboard** → **SQL Editor** :

```sql
-- Script : test_pipeline_complet.sql
-- Ce script va analyser l'état complet de la base
```

**Résultats attendus :**
- ✅ Tous les holerites ont `structured_data`
- ✅ Les colonnes directes (`salario_bruto`, `salario_liquido`) sont remplies
- ✅ Les triggers existent et fonctionnent
- ✅ Les RLS policies sont correctes

### **Étape 2 : Test du processus de scan**

Exécuter dans **Supabase Dashboard** → **SQL Editor** :

```sql
-- Script : test_scan_process.sql
-- Ce script va simuler un nouveau scan
```

**Résultats attendus :**
- ✅ Insertion réussie avec `structured_data`
- ✅ Trigger extrait automatiquement les données vers les colonnes directes
- ✅ `salario_bruto = '25000'` et `salario_liquido = '20000'`
- ✅ Nettoyage automatique du test

### **Étape 3 : Vérification de l'affichage**

1. **Aller sur le dashboard** : `/br/dashboard`
2. **Ouvrir la console** (F12)
3. **Chercher les logs** :
   ```
   🔍 DIAGNOSTIC SALARIES: {
     direct_salario_bruto: "25000",
     direct_salario_liquido: "20000",
     final_salario_bruto: 25000,
     final_salario_liquido: 20000
   }
   ```

### **Étape 4 : Test d'un vrai scan**

1. **Aller sur** : `/br/scan-new-pim`
2. **Uploader un vrai holerite**
3. **Attendre l'analyse IA**
4. **Vérifier dans Supabase** que les données sont sauvegardées
5. **Retourner au dashboard** et vérifier l'affichage

## 📊 **Points de contrôle**

### **Dans Supabase :**
- ✅ `holerites` table : Données structurées présentes
- ✅ Colonnes directes : `salario_bruto`, `salario_liquido` remplies
- ✅ Trigger : Fonctionne automatiquement
- ✅ RLS : Sécurité des données

### **Dans le Dashboard :**
- ✅ Summary cards : Affichent les vraies valeurs
- ✅ DashHoleriteBlock : Affiche les vraies valeurs
- ✅ Historico : Liste les holerites avec les vraies valeurs
- ✅ Logs console : Pas d'erreurs

## 🚨 **Si problème détecté**

### **Problème 1 : Données non sauvegardées**
- Vérifier le processus de scan
- Vérifier les permissions Supabase
- Vérifier les triggers

### **Problème 2 : Données non affichées**
- Vérifier les logs console
- Vérifier la fonction `extractValue`
- Vérifier les composants React

### **Problème 3 : Incohérence des données**
- Vérifier les scripts de correction
- Vérifier les triggers
- Vérifier les RLS policies

## 🎉 **Résultat attendu**

Après ces vérifications, vous devriez avoir :
- ✅ **Scan** : Upload → OCR → IA → Sauvegarde automatique
- ✅ **Dashboard** : Récupération → Extraction → Affichage correct
- ✅ **Cohérence** : Mêmes valeurs partout dans l'application

**Exécutez ces scripts et dites-moi ce que vous observez !** 🚀 