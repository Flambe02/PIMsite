// lib/benefits.ts

export type BenefitType = "Vale Refeição" | "Plano de Saúde" | "Previdência Privada" | "FGTS";

export interface DetectedBenefit {
  tipo: BenefitType;
  origem: "holerite" | "manual";
}

// Palavras-chave usadas para identificar cada benefício no texto ou no JSON do holerite
const BENEFIT_KEYWORDS: Record<BenefitType, string[]> = {
  "Vale Refeição": ["vale refeição", "vale refeicao", "vr", "vale alimentação", "vale alimentacao", "va"],
  "Plano de Saúde": ["plano de saúde", "plano de saude", "assistência médica", "assistencia medica"],
  "Previdência Privada": ["previdência", "previdencia", "pgbl", "vgbl"],
  FGTS: ["fgts"],
};

// Recebe o JSON estruturado retornado pela IA e retorna a lista de benefícios detectados
export function extractBenefitsFromParsedData(parsedData: any): DetectedBenefit[] {
  if (!parsedData) return [];
  const haystack = JSON.stringify(parsedData).toLowerCase();
  const detected: DetectedBenefit[] = [];
  (Object.keys(BENEFIT_KEYWORDS) as BenefitType[]).forEach((tipo) => {
    const found = BENEFIT_KEYWORDS[tipo].some((kw) => haystack.includes(kw));
    if (found) {
      detected.push({ tipo, origem: "holerite" });
    }
  });
  return detected;
} 