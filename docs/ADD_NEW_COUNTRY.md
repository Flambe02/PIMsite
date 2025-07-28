# Guide d'Ajout d'un Nouveau Pays

Ce guide explique comment étendre le système d'analyse IA pour supporter un nouveau pays.

## 🎯 Vue d'ensemble

Le système est conçu pour être facilement extensible. Pour ajouter un nouveau pays, vous devez :

1. **Ajouter les prompts spécialisés** dans `lib/ia/prompts.ts`
2. **Ajouter les règles de validation** dans `lib/validation/payslipValidator.ts`
3. **Tester l'intégration** avec des documents réels

## 📝 Étape 1 : Ajouter les Prompts

### 1.1 Modifier `lib/ia/prompts.ts`

Ajoutez votre pays dans `PAYSLIP_PROMPTS` :

```typescript
export const PAYSLIP_PROMPTS = {
  // ... pays existants
  es: { // Espagne
    extraction: `Tu es expert-comptable spécialisé en fiches de paie espagnoles. Voici le texte OCR extrait d'une nómina :

1. Identifie précisément selon la structure espagnole :
   - Salario Bruto (Base de cotización)
   - Salario Neto (Líquido total)
   - Deducciones (Seguridad Social, IRPF, etc.)
   - Beneficios (Dietas, transporte, etc.)
   - Seguros (si présents)
   - Statut : Indefinido, Temporal, Autónomo, ou Autre

2. Vérifie la cohérence espagnole :
   - Salario Neto ≈ Salario Bruto - Deducciones
   - Seguridad Social et IRPF sont des déductions obligatoires
   - Dietas et transporte sont des avantages, pas des salaires

3. Corrige automatiquement :
   - Confusion entre ',' et '.' dans les nombres
   - Inversions Bruto/Neto
   - Erreurs OCR courantes (ex: "1.500,00" → 1500.00)

4. Retourne ce JSON structuré :
{
  "salario_bruto": number,
  "salario_liquido": number,
  "descontos": number,
  "beneficios": number,
  "seguros": number,
  "statut": "CLT/PJ/Estagiario/Autre",
  "pays": "es",
  "incoherence_detectee": boolean,
  "period": "string (ex: Enero 2025)",
  "employee_name": "string",
  "company_name": "string",
  "position": "string"
}`,
    recommendations: `Tu es conseiller RH expert en fiches de paie espagnoles. Voici la situation d'un salarié :
[JSON précédemment validé]

Fournis des conseils adaptés au contexte espagnol :

1. **Optimisation fiscale** :
   - Déductions IRPF possibles (gastos profesionales)
   - Planes de pensiones pour réduire l'IR
   - Dietas et transporte pour économiser

2. **Beneficios** :
   - Seguro médico (comparaison des garanties)
   - Transporte público vs vehículo
   - Participación en beneficios

3. **Erreurs courantes** :
   - Ne pas confondre beneficios et salario
   - Vérifier les bases de cotización
   - Optimiser les déductions légales

4. **Opportunités** :
   - Planes de pensiones (PEE, PER)
   - Beneficios sociales optimisés
   - Investissements avec avantages fiscaux

Présente chaque conseil de manière pédagogique avec impact et priorité.

Retourne ce JSON :
{
  "resume_situation": "string",
  "recommendations": [
    {
      "categorie": "Salaires/Beneficios/Assurances/Optimisation",
      "titre": "string",
      "description": "string",
      "impact": "Alto/Medio/Baixo",
      "priorite": number
    }
  ],
  "score_optimisation": number
}`
  }
};
```

### 1.2 Mettre à jour les types

Ajoutez le nouveau pays dans les types :

```typescript
export interface PayslipAnalysisResult {
  // ... autres propriétés
  pays: "br" | "fr" | "es" | "autre"; // Ajoutez votre pays
}
```

## 🔧 Étape 2 : Ajouter les Règles de Validation

### 2.1 Modifier `lib/validation/payslipValidator.ts`

Ajoutez la validation spécifique à votre pays dans `validateCountrySpecific` :

```typescript
private static validateCountrySpecific(
  data: PayslipAnalysisResult,
  warnings: string[],
  corrections: Partial<PayslipAnalysisResult>,
  confidence: number
): number {
  // ... validations existantes pour br et fr

  if (data.pays === 'es') {
    // Validation spécifique Espagne
    if (data.statut === 'Indefinido' && data.descontos !== null) {
      // Vérification des cotisations obligatoires espagnoles
      const socialRate = 0.06; // 6% Sécurité Sociale approximatif
      const irpfRate = 0.15; // 15% IRPF approximatif
      const expectedSocial = (data.salario_bruto || 0) * socialRate;
      const expectedIrpf = (data.salario_bruto || 0) * irpfRate;
      const expectedTotal = expectedSocial + expectedIrpf;
      
      if (data.descontos < expectedTotal * 0.5) {
        warnings.push("Cotisations Sécurité Sociale/IRPF insuffisantes pour un Indefinido. Vérification recommandée.");
        confidence -= 10;
      }
    }
  }

  return confidence;
}
```

## 🧪 Étape 3 : Ajouter les Tests

### 3.1 Tests de Validation

Ajoutez des tests dans `lib/validation/payslipValidator.test.ts` :

```typescript
it('should validate Spain-specific rules for Indefinido', () => {
  const data: PayslipAnalysisResult = {
    salario_bruto: 3000,
    salario_liquido: 2400,
    descontos: 100, // Trop faible pour Espagne (devrait être ~630)
    beneficios: 200,
    seguros: 100,
    statut: 'Indefinido',
    pays: 'es',
    incoherence_detectee: false
  };

  const result = PayslipValidator.validateAndCorrect(data);

  expect(result.warnings).toContain('Cotisations Sécurité Sociale/IRPF insuffisantes pour un Indefinido. Vérification recommandée.');
  expect(result.confidence).toBeLessThan(100);
});
```

### 3.2 Tests de Détection de Pays

Ajoutez des tests dans `lib/ia/payslipAnalysisService.test.ts` :

```typescript
it('should detect Spain from Spanish text', async () => {
  const mockResponse = {
    choices: [{ message: { content: 'es' } }]
  };
  
  mockOpenAI.mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue(mockResponse)
      }
    }
  }));

  const result = await service.detectCountry('Salario Bruto: 3000€');
  expect(result).toBe('es');
});
```

## 🌍 Étape 4 : Exemple Complet - Espagne

### 4.1 Structure des Données Espagnoles

```typescript
// Exemple de données espagnoles
const spanishPayslipData = {
  salario_bruto: 3000,
  salario_liquido: 2400,
  descontos: 600, // Sécurité Sociale + IRPF
  beneficios: 200, // Dietas, transporte
  seguros: 100, // Seguro médico
  statut: 'Indefinido',
  pays: 'es',
  incoherence_detectee: false,
  period: 'Enero 2025',
  employee_name: 'Juan García',
  company_name: 'TechCorp España',
  position: 'Desarrollador Senior'
};
```

### 4.2 Prompt d'Extraction Espagnol

```typescript
extraction: `Tu es expert-comptable spécialisé en fiches de paie espagnoles (nómina). Voici le texte OCR extrait d'une nómina :

1. Identifie précisément selon la structure espagnole :
   - Salario Bruto (Base de cotización)
   - Salario Neto (Líquido total)
   - Deducciones (Seguridad Social, IRPF, etc.)
   - Beneficios (Dietas, transporte, etc.)
   - Seguros (si présents)
   - Statut : Indefinido, Temporal, Autónomo, ou Autre

2. Vérifie la cohérence espagnole :
   - Salario Neto ≈ Salario Bruto - Deducciones
   - Seguridad Social et IRPF sont des déductions obligatoires
   - Dietas et transporte sont des avantages, pas des salaires

3. Corrige automatiquement :
   - Confusion entre ',' et '.' dans les nombres
   - Inversions Bruto/Neto
   - Erreurs OCR courantes (ex: "1.500,00" → 1500.00)

4. Retourne ce JSON structuré :
{
  "salario_bruto": number,
  "salario_liquido": number,
  "descontos": number,
  "beneficios": number,
  "seguros": number,
  "statut": "CLT/PJ/Estagiario/Autre",
  "pays": "es",
  "incoherence_detectee": boolean,
  "period": "string (ex: Enero 2025)",
  "employee_name": "string",
  "company_name": "string",
  "position": "string"
}`
```

### 4.3 Prompt de Recommandations Espagnol

```typescript
recommendations: `Tu es conseiller RH expert en fiches de paie espagnoles. Voici la situation d'un salarié :
[JSON précédemment validé]

Fournis des conseils adaptés au contexte espagnol :

1. **Optimisation fiscale** :
   - Déductions IRPF possibles (gastos profesionales)
   - Planes de pensiones pour réduire l'IR
   - Dietas et transporte pour économiser

2. **Beneficios** :
   - Seguro médico (comparaison des garanties)
   - Transporte público vs vehículo
   - Participación en beneficios

3. **Erreurs courantes** :
   - Ne pas confondre beneficios et salario
   - Vérifier les bases de cotización
   - Optimiser les déductions légales

4. **Opportunités** :
   - Planes de pensiones (PEE, PER)
   - Beneficios sociales optimisés
   - Investissements avec avantages fiscaux

Présente chaque conseil de manière pédagogique avec impact et priorité.

Retourne ce JSON :
{
  "resume_situation": "string",
  "recommendations": [
    {
      "categorie": "Salaires/Beneficios/Assurances/Optimisation",
      "titre": "string",
      "description": "string",
      "impact": "Alto/Medio/Baixo",
      "priorite": number
    }
  ],
  "score_optimisation": number
}`
```

## ✅ Checklist d'Ajout d'un Nouveau Pays

- [ ] **Prompts d'extraction** adaptés au pays
- [ ] **Prompts de recommandations** spécifiques au contexte
- [ ] **Règles de validation** par pays (taux, déductions)
- [ ] **Tests unitaires** pour la validation
- [ ] **Tests d'intégration** avec documents réels
- [ ] **Documentation** des spécificités du pays
- [ ] **Mise à jour des types** TypeScript
- [ ] **Test avec l'API** `/api/process-payslip`

## 🚀 Test de l'Intégration

### 1. Test avec un document espagnol

```bash
# Test avec un nómina espagnol
curl -X POST /api/process-payslip \
  -F "file=@spanish_payslip.pdf" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Vérification de la réponse

```json
{
  "success": true,
  "data": {
    "extraction": {
      "salario_bruto": 3000,
      "salario_liquido": 2400,
      "descontos": 600,
      "beneficios": 200,
      "seguros": 100,
      "statut": "Indefinido",
      "pays": "es",
      "incoherence_detectee": false
    },
    "validation": {
      "isValid": true,
      "confidence": 95,
      "warnings": []
    },
    "recommendations": {
      "resume_situation": "Indefinido avec salaire de 3000€",
      "recommendations": [
        {
          "categorie": "Optimisation",
          "titre": "Déductions IRPF",
          "description": "Vous pouvez économiser 180€/mois",
          "impact": "Alto",
          "priorite": 1
        }
      ],
      "score_optimisation": 85
    },
    "finalData": { /* données validées */ }
  },
  "country": "es"
}
```

## 📚 Ressources par Pays

### Espagne
- **Sécurité Sociale** : ~6% du salaire brut
- **IRPF** : 15-45% selon le revenu
- **Statuts** : Indefinido, Temporal, Autónomo
- **Avantages** : Dietas, transporte, seguro médico

### France
- **Charges sociales** : ~22% du salaire brut
- **CSG/CRDS** : ~9% du salaire brut
- **Statuts** : CDI, CDD, Intérimaire
- **Avantages** : Tickets restaurant, transport, mutuelle

### Brésil
- **INSS** : ~11% du salaire brut
- **IRRF** : 0-27.5% selon le revenu
- **Statuts** : CLT, PJ, Estagiario
- **Avantages** : Vale refeição, transporte, plano de saúde

## 🔧 Configuration Avancée

### Variables d'environnement par pays

```env
# Espagne
SPAIN_SOCIAL_RATE=0.06
SPAIN_IRPF_RATE=0.15

# France
FRANCE_SOCIAL_RATE=0.22
FRANCE_CSG_RATE=0.09

# Brésil
BRAZIL_INSS_RATE=0.11
BRAZIL_IRRF_RATE=0.15
```

### Prompts dynamiques

```typescript
// Prompts qui s'adaptent aux taux du pays
const getDynamicPrompt = (country: string, rates: any) => {
  return `Taux ${country}: Sécurité Sociale ${rates.social}%, IR ${rates.ir}%...`;
};
```

## 🎯 Bonnes Pratiques

1. **Testez avec des documents réels** du pays
2. **Validez les taux** avec des experts locaux
3. **Documentez les spécificités** de chaque pays
4. **Maintenez la cohérence** des formats de données
5. **Ajoutez des tests** pour chaque nouveau pays
6. **Monitorer les performances** par pays

Le système est conçu pour être facilement extensible tout en maintenant la qualité et la cohérence des analyses. 