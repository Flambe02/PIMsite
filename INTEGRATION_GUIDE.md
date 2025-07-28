# Guide d'Intégration - Système d'Analyse IA Optimisé

## 🎯 Vue d'ensemble

Ce guide explique comment intégrer le nouveau système d'analyse IA optimisé dans PIM, en respectant l'architecture existante (OCR Tesseract.js, Supabase, hooks existants).

## 📁 Structure des fichiers

```
lib/
├── ia/
│   ├── prompts.ts              # Prompts multi-pays optimisés
│   └── payslipAnalysisService.ts # Service d'analyse IA
├── validation/
│   └── payslipValidator.ts     # Couche de validation intelligente
└── ocr.ts                      # OCR existant (inchangé)

app/api/process-payslip/
└── route.ts                    # API optimisée
```

## 🔧 Intégration avec l'existant

### 1. OCR (Aucune modification requise)
- ✅ Tesseract.js reste inchangé
- ✅ Fonction `parseWithOCRSpaceEnhanced` utilisée
- ✅ Aucune modification du processus OCR

### 2. API existante (Modifications minimales)
- ✅ Endpoint `/api/process-payslip` conservé
- ✅ Même interface de requête/réponse
- ✅ Intégration transparente du nouveau service

### 3. Supabase (Compatibilité maintenue)
- ✅ Tables `holerites` et `analyses` existantes
- ✅ Structure JSONB étendue pour nouvelles données
- ✅ Hook `useUser` inchangé

## 🚀 Utilisation

### Analyse d'un holerite

```typescript
import { PayslipAnalysisService } from '@/lib/ia/payslipAnalysisService';

const analysisService = new PayslipAnalysisService();

// Analyse complète avec détection automatique du pays
const result = await analysisService.analyzePayslip(ocrText, 'br', userId);

console.log('Confidence:', result.validation.confidence);
console.log('Warnings:', result.validation.warnings);
console.log('Recommendations:', result.recommendations);
```

### Validation manuelle

```typescript
import { PayslipValidator } from '@/lib/validation/payslipValidator';

const validation = PayslipValidator.validateAndCorrect(data);
if (!validation.isValid) {
  console.log('Warnings:', validation.warnings);
}
```

## 📊 Nouveaux formats de données

### PayslipAnalysisResult
```typescript
{
  salario_bruto: number | null,
  salario_liquido: number | null,
  descontos: number | null,
  beneficios: number | null,
  seguros: number | null,
  statut: "CLT" | "PJ" | "Estagiario" | "Autre" | null,
  pays: "br" | "fr" | "autre",
  incoherence_detectee: boolean,
  period?: string,
  employee_name?: string,
  company_name?: string,
  position?: string
}
```

### RecommendationResult
```typescript
{
  resume_situation: string,
  recommendations: Array<{
    categorie: "Salaires" | "Beneficios" | "Assurances" | "Optimisation",
    titre: string,
    description: string,
    impact: "Alto" | "Medio" | "Baixo",
    priorite: number
  }>,
  score_optimisation: number
}
```

## 🌍 Support multi-pays

### Prompts par pays
```typescript
import { getPromptForCountry } from '@/lib/ia/prompts';

// Brésil
const brPrompt = getPromptForCountry('br', 'extraction');

// France
const frPrompt = getPromptForCountry('fr', 'extraction');

// Par défaut
const defaultPrompt = getPromptForCountry('default', 'extraction');
```

### Détection automatique
```typescript
const detectedCountry = await analysisService.detectCountry(ocrText);
```

## ✅ Validation intelligente

### Corrections automatiques
- Inversion Brut/Net détectée et corrigée
- Erreurs de ponctuation (virgule vs point)
- Valeurs négatives converties en positives
- Ajustement des déductions pour cohérence

### Validations spécifiques par pays
- **Brésil**: Vérification INSS/IRRF pour CLT
- **France**: Vérification charges sociales
- **Général**: Plages de salaires raisonnables

## 🔄 Migration depuis l'ancien système

### 1. Données existantes
Les données existantes dans Supabase restent compatibles. Le nouveau système :
- Lit les anciennes structures
- Applique la validation
- Génère de nouvelles recommandations

### 2. API Response
L'ancienne API retournait :
```json
{
  "success": true,
  "analysisData": { ... }
}
```

La nouvelle API retourne :
```json
{
  "success": true,
  "data": {
    "extraction": { ... },
    "validation": {
      "isValid": true,
      "confidence": 95,
      "warnings": []
    },
    "recommendations": { ... },
    "finalData": { ... }
  },
  "country": "br"
}
```

## 🛠️ Configuration

### Variables d'environnement
```env
OPENAI_API_KEY=your_openai_key
OCR_SPACE_KEY=your_ocr_key
```

### Prompts personnalisés
Pour ajouter un nouveau pays, modifiez `lib/ia/prompts.ts` :

```typescript
export const PAYSLIP_PROMPTS = {
  // ... pays existants
  new_country: {
    extraction: "Votre prompt d'extraction...",
    recommendations: "Votre prompt de recommandations..."
  }
};
```

## 📈 Monitoring et Debug

### Logs détaillés
Le système génère des logs détaillés :
```
🤖 Début de l'analyse IA optimisée...
✅ Extraction terminée: { ... }
✅ Validation terminée: { confidence: 95, warnings: [...] }
✅ Données corrigées: { ... }
✅ Recommandations générées
```

### Métriques de qualité
- **Confidence Score**: 0-100
- **Warnings**: Liste des problèmes détectés
- **Corrections**: Modifications automatiques appliquées

## 🎯 Avantages du nouveau système

### 1. Validation robuste
- ✅ Détection automatique des incohérences
- ✅ Correction intelligente des erreurs
- ✅ Validation spécifique par pays

### 2. Recommandations personnalisées
- ✅ Adaptées au statut (CLT/PJ/Estagiario)
- ✅ Spécifiques au pays (Brésil/France)
- ✅ Priorisées par impact

### 3. Support multi-pays
- ✅ Détection automatique du pays
- ✅ Prompts optimisés par pays
- ✅ Validation spécifique par région

### 4. Compatibilité totale
- ✅ OCR existant inchangé
- ✅ API existante conservée
- ✅ Supabase existant compatible
- ✅ Hooks existants fonctionnels

## 🚨 Points d'attention

### 1. Performance
- L'analyse IA prend plus de temps (2 appels LLM)
- Validation locale rapide
- Cache recommandé pour les gros volumes

### 2. Coûts
- 2 appels OpenAI par analyse
- Optimisation des tokens dans les prompts
- Monitoring des coûts recommandé

### 3. Fallback
- En cas d'échec IA, fallback sur l'ancien système
- Validation locale toujours disponible
- Logs détaillés pour debugging

## 🔮 Évolutions futures

### 1. Cache intelligent
```typescript
// Cache des analyses par hash du document
const cacheKey = hash(ocrText + userId);
```

### 2. Apprentissage continu
```typescript
// Feedback utilisateur pour améliorer les prompts
await saveUserFeedback(analysisId, userRating, corrections);
```

### 3. Support de nouveaux pays
```typescript
// Ajout facile de nouveaux pays
PAYSLIP_PROMPTS.es = { extraction: "...", recommendations: "..." };
```

## ✅ Checklist d'intégration

- [ ] Vérifier les variables d'environnement
- [ ] Tester l'API avec un holerite brésilien
- [ ] Tester l'API avec un bulletin français
- [ ] Vérifier les logs de validation
- [ ] Tester les recommandations générées
- [ ] Vérifier la compatibilité Supabase
- [ ] Tester le fallback en cas d'erreur
- [ ] Monitorer les performances
- [ ] Vérifier les coûts OpenAI

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs détaillés
2. Tester avec un document simple
3. Vérifier la configuration OpenAI
4. Consulter la documentation Supabase

Le système est conçu pour être robuste et évolutif, tout en maintenant une compatibilité totale avec l'existant. 