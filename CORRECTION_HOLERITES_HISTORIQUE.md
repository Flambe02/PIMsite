# Correction du problème d'affichage des Holerites

## 🔍 Problème identifié

L'onglet "Histórico & Documentos" affiche l'erreur "Erreur lors du chargement des holerites" alors que les données sont présentes dans Supabase (visibles dans l'admin panel).

## 🛠️ Solutions à appliquer

### 1. Exécuter le script SQL de correction

**Fichier recommandé :** `fix_holerites_table_simple.sql` (version sécurisée)

Ce script doit être exécuté dans le Supabase Dashboard :

1. Aller dans **Supabase Dashboard** → **SQL Editor**
2. Copier le contenu du fichier `fix_holerites_table_simple.sql`
3. Exécuter le script

**Alternative :** Si le script simple ne fonctionne pas, utiliser `fix_holerites_table.sql` (version complète)

**Ce script va :**
- Ajouter les colonnes manquantes (`period`, `nome`, `empresa`, `salario_bruto`, `salario_liquido`, `user_id`)
- Créer les index pour les performances
- Mettre à jour les enregistrements existants avec les données depuis `structured_data`
- Configurer les politiques RLS

### 2. Tester avec la page de diagnostic

**URL :** `http://localhost:3000/test-holerites`

Cette page permet de :
- Vérifier la structure de la table
- Tester les requêtes utilisateur
- Diagnostiquer les problèmes RLS
- Voir les données disponibles

### 3. Vérifications à faire

#### A. Structure de la table
Vérifier que la table `holerites` contient bien ces colonnes :
```sql
- id (UUID)
- created_at (timestamp)
- user_id (UUID) ← **IMPORTANT**
- period (text)
- nome (text)
- empresa (text)
- salario_bruto (decimal)
- salario_liquido (decimal)
- structured_data (jsonb)
```

#### B. Politiques RLS
Vérifier que les politiques RLS sont actives :
```sql
-- Dans Supabase Dashboard → Authentication → Policies
-- Table: holerites
-- Politiques nécessaires :
- "Users can view their own holerites" (SELECT)
- "Users can insert their own holerites" (INSERT)
- "Users can update their own holerites" (UPDATE)
- "Users can delete their own holerites" (DELETE)
```

#### C. Données utilisateur
Vérifier que les holerites ont bien un `user_id` :
```sql
SELECT id, user_id, created_at, period 
FROM holerites 
WHERE user_id IS NOT NULL 
ORDER BY created_at DESC;
```

### 4. Problèmes possibles et solutions

#### Problème 1 : Colonnes manquantes
**Symptôme :** Erreur "column does not exist"
**Solution :** Exécuter le script SQL de correction

#### Problème 2 : Politiques RLS manquantes
**Symptôme :** Aucune donnée retournée malgré des données existantes
**Solution :** Vérifier et créer les politiques RLS

#### Problème 3 : user_id manquant
**Symptôme :** Données visibles en admin mais pas pour l'utilisateur
**Solution :** Mettre à jour les enregistrements avec le bon user_id

#### Problème 4 : Authentification
**Symptôme :** "Utilisateur non connecté"
**Solution :** Vérifier que l'utilisateur est bien authentifié

### 5. Script de mise à jour manuelle (si nécessaire)

Si les données existent mais sans `user_id`, exécuter :

```sql
-- Mettre à jour les holerites sans user_id
-- Remplacer 'USER_ID_HERE' par l'ID de l'utilisateur connecté
UPDATE holerites 
SET user_id = 'USER_ID_HERE' 
WHERE user_id IS NULL;

-- Vérifier la mise à jour
SELECT COUNT(*) as total_with_user_id 
FROM holerites 
WHERE user_id IS NOT NULL;
```

### 6. Test final

Après avoir appliqué les corrections :

1. **Recharger la page** `/br/dashboard`
2. **Aller sur l'onglet** "Histórico & Documentos"
3. **Vérifier** que les holerites s'affichent correctement
4. **Tester** les actions (visualiser, supprimer)

### 7. Logs de débogage

Le composant `HoleriteHistory` a été modifié pour afficher des logs détaillés dans la console du navigateur. Vérifier :

1. **Ouvrir les DevTools** (F12)
2. **Aller dans l'onglet Console**
3. **Recharger la page** et observer les logs
4. **Identifier** où le problème se situe

## 📋 Checklist de vérification

- [ ] Script SQL exécuté dans Supabase
- [ ] Colonnes ajoutées à la table holerites
- [ ] Politiques RLS configurées
- [ ] Données mises à jour avec user_id
- [ ] Page de test `/test-holerites` fonctionne
- [ ] Onglet "Histórico & Documentos" affiche les données
- [ ] Actions (visualiser, supprimer) fonctionnent

## 🆘 Si le problème persiste

1. **Vérifier les logs** dans la console du navigateur
2. **Utiliser la page de test** pour diagnostiquer
3. **Vérifier les politiques RLS** dans Supabase Dashboard
4. **Contacter l'équipe** avec les logs d'erreur 