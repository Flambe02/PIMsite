# 🔍 DIAGNOSTIC PROBLÈME AFFICHAGE DASHBOARD

## 📋 **PROBLÈME IDENTIFIÉ**

Les données sont correctement extraites et affichées dans l'interface d'analyse (R$ 15.345,00, R$ 10.767,28, etc.), mais dans le dashboard, les cartes affichent "R$ 0,00" alors que les recommandations IA fonctionnent correctement.

## 🔍 **ANALYSE TECHNIQUE**

### **1. Structure des Données dans l'API (scan-new-pim)**

L'API stocke les données dans `holerites` avec cette structure :

```typescript
const holeriteData = {
  user_id: userId,
  structured_data: {
    final_data: {
      employee_name: structuredData.employee_name,
      company_name: structuredData.company_name,
      position: structuredData.position,
      statut: structuredData.profile_type,
      salario_bruto: structuredData.gross_salary,      // ← ICI
      salario_liquido: structuredData.net_salary,      // ← ICI
      descontos: structuredData.total_deductions,
      period: structuredData.period
    },
    // ... autres données
  },
  // Colonnes directes pour compatibilité
  salario_bruto: structuredData.gross_salary || 0,     // ← ET ICI
  salario_liquido: structuredData.net_salary || 0,     // ← ET ICI
  // ...
};
```

### **2. Extraction dans le Dashboard**

Le dashboard cherche les données dans cet ordre :

```typescript
const salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                    extractValue(data.structured_data, 'gross_salary') ||
                    extractValue(data.structured_data, 'salario_bruto') ||
                    extractValue(data, 'salario_bruto') ||
                    0;
```

### **3. Problème Identifié**

**INCOHÉRENCE DE NOMS** :
- L'API stocke : `salario_bruto` et `salario_liquido`
- Le dashboard cherche : `salario_bruto` ET `gross_salary` ET `salario_bruto`
- Mais les données originales viennent avec : `gross_salary` et `net_salary`

## 🛠️ **SOLUTION APPLIQUÉE**

### **1. Correction de l'API (scan-new-pim)**

Modifier la structure pour être cohérente :

```typescript
final_data: {
  employee_name: structuredData.employee_name || structuredData.Identificação?.employee_name,
  company_name: structuredData.company_name || structuredData.Identificação?.company_name,
  position: structuredData.position || structuredData.Identificação?.position,
  statut: structuredData.profile_type || structuredData.Identificação?.profile_type,
  salario_bruto: structuredData.gross_salary || structuredData.Salários?.gross_salary,
  salario_liquido: structuredData.net_salary || structuredData.Salários?.net_salary,
  descontos: structuredData.total_deductions || 0,
  period: structuredData.period || ''
},
// Ajouter aussi les anciens noms pour compatibilité
gross_salary: structuredData.gross_salary || structuredData.Salários?.gross_salary,
net_salary: structuredData.net_salary || structuredData.Salários?.net_salary,
```

### **2. Amélioration de l'Extraction Dashboard**

Ajouter plus de chemins de fallback :

```typescript
const salarioBruto = extractValue(data.structured_data, 'final_data.salario_bruto') ||
                    extractValue(data.structured_data, 'gross_salary') ||
                    extractValue(data.structured_data, 'salario_bruto') ||
                    extractValue(data, 'salario_bruto') ||
                    extractValue(data, 'gross_salary') ||
                    0;
```

### **3. Logs de Débogage**

Ajouter des logs pour tracer le problème :

```typescript
console.log('🔍 STRUCTURE DES DONNÉES RECUES:', {
  structured_data: data.structured_data,
  final_data: data.structured_data?.final_data,
  direct_columns: {
    salario_bruto: data.salario_bruto,
    salario_liquido: data.salario_liquido
  }
});
```

## 🎯 **RÉSULTAT ATTENDU**

Après correction :
- ✅ Les données sont stockées avec des noms cohérents
- ✅ Le dashboard trouve les données dans tous les chemins possibles
- ✅ Les cartes affichent les vraies valeurs (R$ 15.345,00, etc.)
- ✅ Les recommandations IA continuent de fonctionner

## 🔧 **TESTS RECOMMANDÉS**

1. **Scanner un nouveau holerite** via PIM Scan
2. **Vérifier les logs** de l'API pour voir la structure stockée
3. **Vérifier les logs** du dashboard pour voir l'extraction
4. **Confirmer** que les cartes affichent les bonnes valeurs

## 📝 **NOTES IMPORTANTES**

- Le problème n'est pas dans l'extraction OCR ou l'analyse IA
- Le problème n'est pas dans l'authentification
- Le problème est dans la cohérence des noms de champs entre stockage et lecture
- Les recommandations IA fonctionnent car elles utilisent une structure différente 