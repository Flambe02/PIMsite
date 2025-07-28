export interface PayslipAnalysisResult {
  salario_bruto: number | null;
  salario_liquido: number | null;
  descontos: number | null;
  beneficios: number | null;
  seguros: number | null;
  statut: "CLT" | "PJ" | "Estagiario" | "Autre" | null;
  pays: "br" | "fr" | "autre";
  incoherence_detectee: boolean;
  period?: string;
  employee_name?: string;
  company_name?: string;
  position?: string;
}

export interface RecommendationResult {
  resume_situation: string;
  recommendations: Array<{
    categorie: "Salaires" | "Beneficios" | "Assurances" | "Optimisation";
    titre: string;
    description: string;
    impact: "Alto" | "Medio" | "Baixo";
    priorite: number;
  }>;
  score_optimisation: number; // 0-100
}

export const PAYSLIP_PROMPTS = {
  default: {
    extraction: `Tu es expert-comptable spécialisé en fiches de paie. Voici le texte OCR extrait d'une fiche de paie :

1. Identifie précisément : salaire brut, salaire net, bénéfices totaux, déductions totales, assurances (si existantes).
2. Vérifie immédiatement la cohérence : Net ≈ Brut - déductions.
3. Corrige automatiquement les erreurs simples (inversions, ponctuation nombres, erreurs OCR évidentes).
4. Retourne uniquement ce JSON clair et cohérent (null si absent) :
{
  "salario_bruto": number,
  "salario_liquido": number,
  "descontos": number,
  "beneficios": number,
  "seguros": number,
  "statut": "CLT/PJ/Estagiario/Autre",
  "pays": "br/fr/autre",
  "incoherence_detectee": boolean,
  "period": "string",
  "employee_name": "string",
  "company_name": "string",
  "position": "string"
}`,
    recommendations: `Tu es conseiller financier RH expert en fiches de paie. Voici la situation d'un salarié :
[JSON précédemment validé]

Fournis clairement :
- Un résumé rapide de la situation du salarié.
- 3 à 5 conseils pratiques et concrets adaptés au statut ([CLT/PJ...]) et au pays ([br/fr]) :
  - Optimisation fiscale possible
  - Choix de bénéfices pertinents
  - Erreurs courantes à éviter
  - Autres opportunités financières
Présente chaque conseil clairement, de manière pédagogique, avec justification rapide.

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
  },
  br: {
    extraction: `Tu es expert-comptable spécialisé en fiches de paie brésiliennes (Holerite). Voici le texte OCR extrait d'un holerite :

1. Identifie précisément selon la structure brésilienne :
   - Salário Bruto (Base de Cálculo)
   - Salário Líquido (Valor Líquido)
   - Total de Descontos (INSS + IRRF + outros)
   - Benefícios (Vale Refeição, Vale Transporte, etc.)
   - Seguros (Plano de Saúde, etc.)
   - Statut : CLT, PJ, Estagiario, ou Autre

2. Vérifie la cohérence brésilienne :
   - Salário Líquido ≈ Salário Bruto - Total Descontos
   - Vale Refeição et Vale Transporte sont des bénéfices, pas des salaires
   - INSS et IRRF sont des déductions obligatoires

3. Corrige automatiquement :
   - Confusion entre ',' et '.' dans les nombres
   - Inversions Bruto/Líquido
   - Erreurs OCR courantes (ex: "1.500,00" → 1500.00)

4. Retourne ce JSON structuré :
{
  "salario_bruto": number,
  "salario_liquido": number,
  "descontos": number,
  "beneficios": number,
  "seguros": number,
  "statut": "CLT/PJ/Estagiario/Autre",
  "pays": "br",
  "incoherence_detectee": boolean,
  "period": "string (ex: Janeiro/2025)",
  "employee_name": "string",
  "company_name": "string",
  "position": "string"
}`,
    recommendations: `Tu es conseiller RH expert en fiches de paie brésiliennes. Voici la situation d'un salarié :
[JSON précédemment validé]

Fournis des conseils adaptés au contexte brésilien :

1. **Optimisation fiscale** :
   - Déductions IRRF possibles (despesas médicas, educacionais)
   - PGBL/VGBL pour réduire l'IR
   - Vale Refeição/Alimentação pour économiser

2. **Benefícios** :
   - Plano de Saúde (comparaison réseaux)
   - Vale Transporte vs Vale Combustível
   - PLR (Participação nos Lucros)

3. **Erreurs courantes** :
   - Ne pas déclarer Vale Refeição comme salaire
   - Vérifier les bases de calcul INSS/IRRF
   - Optimiser les déductions légales

4. **Opportunités** :
   - Salary Sacrifice pour Vale Alimentação
   - Flexibilização de benefícios
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
  },
  fr: {
    extraction: `Tu es expert-comptable spécialisé en fiches de paie françaises. Voici le texte OCR extrait d'un bulletin de paie :

1. Identifie précisément selon la structure française :
   - Salaire Brut (Base de calcul)
   - Salaire Net (Net à payer)
   - Cotisations sociales (Sécurité sociale, CSG, etc.)
   - Avantages en nature (Tickets restaurant, transport, etc.)
   - Mutuelle santé (si présente)
   - Statut : CDI, CDD, Intérimaire, ou Autre

2. Vérifie la cohérence française :
   - Salaire Net ≈ Salaire Brut - Cotisations
   - CSG/CRDS sont des cotisations obligatoires
   - Tickets restaurant sont des avantages, pas du salaire

3. Corrige automatiquement :
   - Confusion entre ',' et '.' dans les nombres
   - Inversions Brut/Net
   - Erreurs OCR courantes (ex: "1 500,00" → 1500.00)

4. Retourne ce JSON structuré :
{
  "salario_bruto": number,
  "salario_liquido": number,
  "descontos": number,
  "beneficios": number,
  "seguros": number,
  "statut": "CLT/PJ/Estagiario/Autre",
  "pays": "fr",
  "incoherence_detectee": boolean,
  "period": "string (ex: Janvier 2025)",
  "employee_name": "string",
  "company_name": "string",
  "position": "string"
}`,
    recommendations: `Tu es conseiller RH expert en fiches de paie françaises. Voici la situation d'un salarié :
[JSON précédemment validé]

Fournis des conseils adaptés au contexte français :

1. **Optimisation fiscale** :
   - Déductions d'impôts possibles (frais professionnels)
   - PEE/PER pour réduire l'IR
   - Tickets restaurant pour économiser

2. **Avantages sociaux** :
   - Mutuelle santé (comparaison des garanties)
   - Transport en commun vs véhicule
   - Intéressement/participation

3. **Erreurs courantes** :
   - Ne pas confondre avantages et salaire
   - Vérifier les bases de calcul des cotisations
   - Optimiser les déductions légales

4. **Opportunités** :
   - Épargne salariale (PEE, PER)
   - Avantages en nature optimisés
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

export function getPromptForCountry(country: string, type: 'extraction' | 'recommendations'): string {
  const prompts = PAYSLIP_PROMPTS[country as keyof typeof PAYSLIP_PROMPTS] || PAYSLIP_PROMPTS.default;
  return prompts[type];
} 