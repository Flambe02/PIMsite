/**
 * Fonction utilitaire pour calculer le montant "Money Found"
 * à partir des données d'analyse et de recommandations
 */

import { EnhancedAnalysisResult } from './ia/enhancedPayslipAnalysisService';
import { RecommendationsReport } from './ia/enhancedPayslipAnalysisService';

export interface MoneyFoundResult {
  foundAmount: number;
  source: 'recommendations' | 'estimated' | 'fallback';
  confidence: 'high' | 'medium' | 'low';
  breakdown?: {
    category: string;
    amount: number;
    description: string;
  }[];
}

/**
 * Calcule le montant "Money Found" depuis les données d'analyse
 */
export function computeFound(analysisData: any): MoneyFoundResult {
  // 1. Essayer d'extraire depuis recommendationsReport
  const recommendationsReport = extractRecommendationsReport(analysisData);
  if (recommendationsReport) {
    const foundAmount = calculateFromRecommendations(recommendationsReport);
    if (foundAmount > 0) {
      return {
        foundAmount,
        source: 'recommendations',
        confidence: 'high',
        breakdown: extractBreakdown(recommendationsReport)
      };
    }
  }

  // 2. Essayer d'extraire depuis structured_data
  const structuredData = extractStructuredData(analysisData);
  if (structuredData) {
    const foundAmount = calculateFromStructuredData(structuredData);
    if (foundAmount > 0) {
      return {
        foundAmount,
        source: 'estimated',
        confidence: 'medium',
        breakdown: extractBreakdownFromStructured(structuredData)
      };
    }
  }

  // 3. Fallback avec estimations par défaut
  return {
    foundAmount: 287, // Montant par défaut
    source: 'fallback',
    confidence: 'low',
    breakdown: [
      { category: 'VR Switch', amount: 110, description: 'Trocar VR' },
      { category: 'Health Plan', amount: 62, description: 'Plano de saúde' },
      { category: 'IRRF Adjust', amount: 115, description: 'Ajuste IRRF' }
    ]
  };
}

/**
 * Extrait le rapport de recommandations depuis les données d'analyse
 */
function extractRecommendationsReport(analysisData: any): RecommendationsReport | null {
  // Essayer plusieurs chemins possibles
  const paths = [
    analysisData?.recommendations_report,
    analysisData?.data?.recommendations_report,
    analysisData?.analysis?.recommendations_report,
    analysisData?.finalData?.recommendations_report
  ];

  for (const path of paths) {
    if (path && typeof path === 'object') {
      return path as RecommendationsReport;
    }
  }

  return null;
}

/**
 * Extrait les données structurées depuis les données d'analyse
 */
function extractStructuredData(analysisData: any): any {
  const paths = [
    analysisData?.structured_data,
    analysisData?.data?.structured_data,
    analysisData?.analysis?.structured_data,
    analysisData?.finalData?.structured_data
  ];

  for (const path of paths) {
    if (path && typeof path === 'object') {
      return path;
    }
  }

  return null;
}

/**
 * Calcule le montant depuis les recommandations
 */
function calculateFromRecommendations(recommendations: RecommendationsReport): number {
  if (!recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
    return 0;
  }

  return recommendations.recommendations.reduce((total, rec) => {
    return total + (rec.estimatedSavings || 0);
  }, 0);
}

/**
 * Calcule le montant depuis les données structurées
 */
function calculateFromStructuredData(structuredData: any): number {
  // Logique pour calculer depuis les données structurées
  // Par exemple, analyser les bénéfices, impôts, etc.
  
  let total = 0;

  // Analyser les bénéfices
  if (structuredData.beneficios && Array.isArray(structuredData.beneficios)) {
    total += structuredData.beneficios.reduce((sum: number, beneficio: any) => {
      const valor = beneficio.valor || beneficio.value || 0;
      return sum + (Number(valor) || 0);
    }, 0);
  }

  // Analyser les opportunités d'optimisation
  if (structuredData.optimization_opportunities && Array.isArray(structuredData.optimization_opportunities)) {
    // Estimation basée sur le nombre d'opportunités
    total += structuredData.optimization_opportunities.length * 50;
  }

  return total;
}

/**
 * Extrait le breakdown depuis les recommandations
 */
function extractBreakdown(recommendations: RecommendationsReport): MoneyFoundResult['breakdown'] {
  if (!recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
    return [];
  }

  return recommendations.recommendations
    .filter(rec => rec.estimatedSavings && rec.estimatedSavings > 0)
    .map(rec => ({
      category: rec.category,
      amount: rec.estimatedSavings || 0,
      description: rec.title
    }));
}

/**
 * Extrait le breakdown depuis les données structurées
 */
function extractBreakdownFromStructured(structuredData: any): MoneyFoundResult['breakdown'] {
  const breakdown: MoneyFoundResult['breakdown'] = [];

  // Analyser les bénéfices
  if (structuredData.beneficios && Array.isArray(structuredData.beneficios)) {
    structuredData.beneficios.forEach((beneficio: any) => {
      const valor = beneficio.valor || beneficio.value || 0;
      if (valor > 0) {
        breakdown.push({
          category: 'Benefícios',
          amount: Number(valor),
          description: beneficio.descricao || beneficio.description || 'Benefício'
        });
      }
    });
  }

  return breakdown;
}

/**
 * Calcule le montant "Money Found" depuis un scanId
 */
export async function computeFoundFromScanId(scanId: string): Promise<MoneyFoundResult> {
  // Cette fonction pourrait être implémentée pour récupérer les données
  // depuis la base de données en utilisant le scanId
  // Pour l'instant, retourne le fallback
  return computeFound(null);
}
