# Audit et Correction - Récupération/Display Champs Holerite Dashboard

## 🔍 **Problème identifié**

Certaines valeurs comme "Salário Bruto" ou "Salário Líquido" restent vides (0 ou champ non rempli) dans le Dashboard, alors que d'autres (ex: Recommandations, Descontos, Date de Holerite) s'affichent correctement.

## 📊 **Analyse du pipeline de récupération**

### 1. **Composants analysés**

#### A. `app/[locale]/dashboard/page.tsx` (Principal)
- **Fonction :** `syncWithSupabase()` (lignes 775-1030)
- **Requête :** `select('*')` - ✅ Récupère tous les champs
- **Problème identifié :** Mapping complexe avec fallbacks multiples

#### B. `components/dashboard/HoleriteHistory.tsx`
- **Fonction :** `fetchHolerites()` (ligne 101)
- **Requête :** `select('id, created_at, salario_bruto, salario_liquido, nome, empresa, structured_data, period, user_id')`
- **Problème identifié :** ✅ Champs correctement sélectionnés

#### C. `components/dash/DashHoleriteBlock.tsx`
- **Fonction :** `fetchHoleriteData()` (ligne 23)
- **Requête :** `select('*')` - ✅ Récupère tous les champs
- **Problème identifié :** Mapping avec fallbacks (lignes 171-177)

#### D. `hooks/useUserHolerites.ts`
- **Fonction :** `fetchHolerites()` (ligne 47)
- **Requête :** `select('id, created_at, salario_bruto, salario_liquido, nome, empresa, structured_data, period')`
- **Problème identifié :** ✅ Champs correctement sélectionnés

### 2. **Problèmes identifiés**

#### 🚨 **Problème principal : Mapping complexe et fallbacks**

Dans `app/[locale]/dashboard/page.tsx` (lignes 843-860) :

```typescript
// MAPPING COMPLEXE AVEC FALLBACKS MULTIPLES
const salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                    extractValue(data.structured_data, 'gross_salary') ||
                    extractValue(data.structured_data, 'salario_bruto') ||
                    extractValue(data, 'salario_bruto') ||
                    extractValue(data, 'gross_salary') ||
                    0; // ← FALLBACK À 0
```

**Problèmes :**
1. **Fallback à 0** masque les vraies erreurs
2. **Mapping complexe** avec 6 niveaux de fallback
3. **Pas de logs** pour identifier où le problème se situe

#### 🚨 **Problème secondaire : Affichage conditionnel**

Dans `app/[locale]/dashboard/page.tsx` (lignes 1070-1090) :

```typescript
// AFFICHAGE CONDITIONNEL COMPLEXE
value: holeriteResult.salarioBruto && holeriteResult.salarioBruto > 0 ? 
  `R$ ${holeriteResult.salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
  (holeriteResult.raw?.final_data?.salario_bruto ? 
    `R$ ${Number(holeriteResult.raw.final_data.salario_bruto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
    'R$ 0,00'), // ← FALLBACK À "R$ 0,00"
```

## 🛠️ **Corrections à apporter**

### 1. **Simplifier le mapping dans `syncWithSupabase()`**

**Avant :**
```typescript
const salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                    extractValue(data.structured_data, 'gross_salary') ||
                    extractValue(data.structured_data, 'salario_bruto') ||
                    extractValue(data, 'salario_bruto') ||
                    extractValue(data, 'gross_salary') ||
                    0;
```

**Après :**
```typescript
// PRIORITÉ 1: Colonnes directes de la table
const salarioBruto = data.salario_bruto || 0;
const salarioLiquido = data.salario_liquido || 0;

// PRIORITÉ 2: structured_data si colonnes vides
if (!salarioBruto && data.structured_data) {
  salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                 extractValue(data.structured_data, 'salario_bruto') ||
                 extractValue(data.structured_data, 'gross_salary') ||
                 0;
}

if (!salarioLiquido && data.structured_data) {
  salarioLiquido = extractValue(data.structured_data, 'final_data.salario_liquido') ||
                   extractValue(data.structured_data, 'salario_liquido') ||
                   extractValue(data.structured_data, 'net_salary') ||
                   0;
}
```

### 2. **Ajouter des logs de diagnostic**

```typescript
console.log('🔍 DIAGNOSTIC SALARIES:', {
  direct_salario_bruto: data.salario_bruto,
  direct_salario_liquido: data.salario_liquido,
  structured_final_salario_bruto: data.structured_data?.final_data?.salario_bruto,
  structured_final_salario_liquido: data.structured_data?.final_data?.salario_liquido,
  structured_salario_bruto: data.structured_data?.salario_bruto,
  structured_salario_liquido: data.structured_data?.salario_liquido,
  final_salario_bruto: salarioBruto,
  final_salario_liquido: salarioLiquido
});
```

### 3. **Simplifier l'affichage des summary cards**

**Avant :**
```typescript
value: holeriteResult.salarioBruto && holeriteResult.salarioBruto > 0 ? 
  `R$ ${holeriteResult.salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
  (holeriteResult.raw?.final_data?.salario_bruto ? 
    `R$ ${Number(holeriteResult.raw.final_data.salario_bruto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
    'R$ 0,00'),
```

**Après :**
```typescript
value: holeriteResult.salarioBruto > 0 ? 
  `R$ ${holeriteResult.salarioBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
  'R$ 0,00',
```

### 4. **Corriger le composant DashHoleriteBlock**

**Avant :**
```typescript
{formatCurrency(rawData.salario_bruto || rawData.gross_salary)}
```

**Après :**
```typescript
{formatCurrency(rawData.salario_bruto || 0)}
```

## 📋 **Plan de correction**

### Phase 1 : Diagnostic (Immédiat)
1. ✅ Ajouter des logs détaillés dans `syncWithSupabase()`
2. ✅ Vérifier la structure des données dans Supabase
3. ✅ Identifier où les valeurs sont perdues

### Phase 2 : Simplification (Immédiat)
1. ✅ Simplifier le mapping dans `syncWithSupabase()`
2. ✅ Supprimer les fallbacks complexes
3. ✅ Utiliser les colonnes directes en priorité

### Phase 3 : Affichage (Immédiat)
1. ✅ Simplifier l'affichage des summary cards
2. ✅ Corriger le composant DashHoleriteBlock
3. ✅ Ajouter des placeholders intelligents

### Phase 4 : Validation (Test)
1. ✅ Tester avec des données réelles
2. ✅ Vérifier que tous les champs s'affichent
3. ✅ Valider les performances

## 🎯 **Résultat attendu**

Après les corrections :
- ✅ **Salário Bruto** s'affiche correctement
- ✅ **Salário Líquido** s'affiche correctement
- ✅ **Descontos** s'affiche correctement
- ✅ **Mes Referência** s'affiche correctement
- ✅ **Logs clairs** pour le diagnostic
- ✅ **Code simplifié** et maintenable 