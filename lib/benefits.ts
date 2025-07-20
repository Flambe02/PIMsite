// lib/benefits.ts

export type BenefitType = "Vale Refeição" | "Plano de Saúde" | "Previdência Privada" | "FGTS";

export interface DetectedBenefit {
  tipo: BenefitType;
  origem: "holerite" | "manual";
}

// Palavras-chave usadas para identificar cada benefício no texto ou no JSON do holerite
const BENEFIT_KEYWORDS: Record<BenefitType, string[]> = {
  "Vale Refeição": [
    "vale refeição", "vale refeicao", "vr", "vale alimentação", "vale alimentacao", "va",
    "refeição", "refeicao", "alimentação", "alimentacao", "ticket refeição", "ticket refeicao"
  ],
  "Plano de Saúde": [
    "plano de saúde", "plano de saude", "assistência médica", "assistencia medica",
    "saúde", "saude", "médico", "medico", "hospitalar", "assistência", "assistencia"
  ],
  "Previdência Privada": [
    "previdência", "previdencia", "pgbl", "vgbl", "previdência privada", "previdencia privada",
    "plano de aposentadoria", "aposentadoria", "pensão", "pensao"
  ],
  FGTS: [
    "fgts", "fundo de garantia", "fundo garantia", "garantia por tempo de serviço"
  ],
};

// Recebe o JSON estruturado retornado pela IA e retorna a lista de benefícios detectados
export function extractBenefitsFromParsedData(parsedData: any): DetectedBenefit[] {
  if (!parsedData) return [];
  
  const detected: DetectedBenefit[] = [];
  
  // Analyser les earnings et deductions spécifiquement
  const earnings = parsedData.earnings || [];
  const deductions = parsedData.deductions || [];
  
  // Créer un texte de recherche complet
  const searchText = [
    ...earnings.map((e: any) => e.description || ''),
    ...deductions.map((d: any) => d.description || ''),
    parsedData.company_name || '',
    parsedData.position || '',
    parsedData.profile_type || ''
  ].join(' ').toLowerCase();
  
  // Analyser chaque type de bénéfice avec des règles spécifiques
  (Object.keys(BENEFIT_KEYWORDS) as BenefitType[]).forEach((tipo) => {
    let found = false;
    
    // Règles spécifiques pour chaque type
    if (tipo === "Vale Refeição") {
      found = BENEFIT_KEYWORDS[tipo].some(kw => searchText.includes(kw)) &&
              !searchText.includes('pro labore') &&
              !searchText.includes('honorário') &&
              !searchText.includes('inss');
    } else if (tipo === "Plano de Saúde") {
      found = BENEFIT_KEYWORDS[tipo].some(kw => searchText.includes(kw)) &&
              !searchText.includes('inss') &&
              !searchText.includes('pro labore');
    } else if (tipo === "Previdência Privada") {
      found = BENEFIT_KEYWORDS[tipo].some(kw => searchText.includes(kw)) &&
              !searchText.includes('inss') &&
              !searchText.includes('pro labore');
    } else if (tipo === "FGTS") {
      // FGTS est toujours présent pour les CLT
      found = BENEFIT_KEYWORDS[tipo].some(kw => searchText.includes(kw)) ||
              (parsedData.profile_type === 'CLT' && parsedData.fgts_deposit > 0);
    }
    
    if (found) {
      detected.push({ tipo, origem: "holerite" });
    }
  });
  
  return detected;
} 