import OpenAI from 'openai';
import { PayslipAnalysisResult, RecommendationResult, getPromptForCountry } from './prompts';
import { getEnhancedPromptForCountry } from './enhancedPrompts';
import { PayslipValidator, ValidationResult } from '../validation/payslipValidator';

export interface AnalysisVersion {
  type: 'legacy' | 'enhanced';
  version: string;
  timestamp: number;
}

export interface ExplanationReport {
  summary: string;
  fieldExplanations: Array<{
    field: string;
    label: string;
    value: any;
    explanation: string;
    legalContext?: string;
    calculationMethod?: string;
  }>;
  monthSpecifics: string;
  calculationBases: {
    socialContributions: string;
    taxes: string;
    benefits: string;
    deductions: string;
  };
  salaryComposition: {
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
    breakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  };
}

export interface RecommendationsReport {
  profileAnalysis: string;
  optimizationScore: number; // 0-100
  recommendations: Array<{
    category: 'tax_optimization' | 'benefits' | 'retirement' | 'insurance' | 'financial_education' | 'budget_management';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    priority: number; // 1-5
    actionable: boolean;
    estimatedSavings?: number;
    implementationSteps?: string[];
  }>;
  marketComparison?: {
    salaryBenchmark: string;
    benefitsBenchmark: string;
    recommendations: string[];
  };
}

export interface EnhancedAnalysisResult {
  version: AnalysisVersion;
  extraction: PayslipAnalysisResult;
  validation: ValidationResult;
  explanation?: ExplanationReport;
  recommendations?: RecommendationsReport;
  finalData: PayslipAnalysisResult;
}

export class EnhancedPayslipAnalysisService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Analyse complète avec choix de version
   */
  async analyzePayslip(
    ocrText: string,
    analysisType: 'legacy' | 'enhanced' = 'enhanced',
    country: string = 'br',
    userId?: string
  ): Promise<EnhancedAnalysisResult> {
    try {
      console.log(`🤖 Début de l'analyse ${analysisType}...`);

      // 1. Extraction des données (commune aux deux versions)
      const extractionResult = await this.extractData(ocrText, country);
      console.log('✅ Extraction terminée');

      // 2. Validation et correction
      const validationResult = PayslipValidator.validateAndCorrect(extractionResult);
      const correctedData = PayslipValidator.applyCorrections(extractionResult, validationResult.corrections);

      // 3. Génération selon le type d'analyse
      let explanation: ExplanationReport | undefined;
      let recommendations: RecommendationsReport | undefined;

      if (analysisType === 'enhanced') {
        // Nouvelle version avec séparation
        explanation = await this.generateExplanationReport(correctedData, country);
        recommendations = await this.generateRecommendationsReport(correctedData, country);
        console.log('✅ Rapports séparés générés');
      } else {
        // Version legacy (compatible)
        const legacyRecommendations = await this.generateLegacyRecommendations(correctedData, country);
        recommendations = this.convertLegacyToEnhanced(legacyRecommendations);
        console.log('✅ Analyse legacy générée');
      }

      return {
        version: {
          type: analysisType,
          version: analysisType === 'enhanced' ? '2.0' : '1.0',
          timestamp: Date.now()
        },
        extraction: extractionResult,
        validation: validationResult,
        explanation,
        recommendations,
        finalData: correctedData
      };

    } catch (error) {
      console.error('❌ Erreur dans l\'analyse:', error);
      return this.createFallbackResult(analysisType, country);
    }
  }

  /**
   * Génération du rapport d'explication détaillé
   */
  private async generateExplanationReport(
    data: PayslipAnalysisResult,
    country: string
  ): Promise<ExplanationReport> {
    const prompt = this.getExplanationPrompt(country);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Données du holerite:\n\n${JSON.stringify(data, null, 2)}` }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse IA vide pour l'explication");
    }

    try {
      const result = JSON.parse(content) as ExplanationReport;
      return this.validateExplanationReport(result);
    } catch (error) {
      console.error('❌ Erreur parsing explication:', error);
      return this.createDefaultExplanationReport(data);
    }
  }

  /**
   * Génération du rapport de recommandations optimisées
   */
  private async generateRecommendationsReport(
    data: PayslipAnalysisResult,
    country: string
  ): Promise<RecommendationsReport> {
    const prompt = this.getRecommendationsPrompt(country);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Données du holerite:\n\n${JSON.stringify(data, null, 2)}` }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse IA vide pour les recommandations");
    }

    try {
      const result = JSON.parse(content) as RecommendationsReport;
      return this.validateRecommendationsReport(result);
    } catch (error) {
      console.error('❌ Erreur parsing recommandations:', error);
      return this.createDefaultRecommendationsReport(data);
    }
  }

  /**
   * Génération des recommandations legacy (compatibilité)
   */
  private async generateLegacyRecommendations(
    data: PayslipAnalysisResult,
    country: string
  ): Promise<RecommendationResult> {
    const prompt = getPromptForCountry(country, 'recommendations');
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Données du holerite:\n\n${JSON.stringify(data, null, 2)}` }
      ],
      temperature: 0.3,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse IA vide pour les recommandations legacy");
    }

    try {
      return JSON.parse(content) as RecommendationResult;
    } catch (error) {
      console.error('❌ Erreur parsing recommandations legacy:', error);
      return this.createDefaultLegacyRecommendations();
    }
  }

  /**
   * Conversion des recommandations legacy vers le nouveau format
   */
  private convertLegacyToEnhanced(legacy: RecommendationResult): RecommendationsReport {
    return {
      profileAnalysis: legacy.resume_situation,
      optimizationScore: legacy.score_optimisation,
      recommendations: legacy.recommendations.map((rec, index) => ({
        category: this.mapLegacyCategory(rec.categorie),
        title: rec.titre,
        description: rec.description,
        impact: this.mapLegacyImpact(rec.impact),
        priority: rec.priorite,
        actionable: true
      }))
    };
  }

  /**
   * Extraction des données (méthode commune)
   */
  private async extractData(ocrText: string, country: string): Promise<PayslipAnalysisResult> {
    const prompt = getEnhancedPromptForCountry(country, 'extraction');
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Texte OCR:\n\n${ocrText}` }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse IA vide");
    }

    try {
      const result = JSON.parse(content) as PayslipAnalysisResult;
      return this.validateExtractionResult(result);
    } catch (error) {
      console.error('❌ Erreur parsing extraction:', error);
      throw new Error("Impossible de parser la réponse IA");
    }
  }

  // Prompts spécialisés pour l'explication
  private getExplanationPrompt(country: string): string {
    return getEnhancedPromptForCountry(country, 'explanation');
  }

  // Prompts spécialisés pour les recommandations
  private getRecommendationsPrompt(country: string): string {
    return getEnhancedPromptForCountry(country, 'recommendations');
  }

  // Méthodes de validation
  private validateExtractionResult(data: any): PayslipAnalysisResult {
    if (!data || typeof data !== 'object') {
      throw new Error("Données d'extraction invalides");
    }
    return data as PayslipAnalysisResult;
  }

  private validateExplanationReport(data: any): ExplanationReport {
    if (!data || typeof data !== 'object') {
      throw new Error("Rapport d'explication invalide");
    }
    return data as ExplanationReport;
  }

  private validateRecommendationsReport(data: any): RecommendationsReport {
    if (!data || typeof data !== 'object') {
      throw new Error("Rapport de recommandations invalide");
    }
    return data as RecommendationsReport;
  }

  // Méthodes de mapping
  private mapLegacyCategory(category: string): RecommendationsReport['recommendations'][0]['category'] {
    const mapping: Record<string, RecommendationsReport['recommendations'][0]['category']> = {
      'Salaires': 'tax_optimization',
      'Beneficios': 'benefits',
      'Assurances': 'insurance',
      'Optimisation': 'financial_education'
    };
    return mapping[category] || 'financial_education';
  }

  private mapLegacyImpact(impact: string): 'high' | 'medium' | 'low' {
    const mapping: Record<string, 'high' | 'medium' | 'low'> = {
      'Alto': 'high',
      'Medio': 'medium',
      'Baixo': 'low'
    };
    return mapping[impact] || 'medium';
  }

  // Méthodes de fallback
  private createFallbackResult(analysisType: 'legacy' | 'enhanced', country: string): EnhancedAnalysisResult {
    const fallbackData: PayslipAnalysisResult = {
      salario_bruto: 0,
      salario_liquido: 0,
      descontos: 0,
      beneficios: 0,
      seguros: 0,
      statut: 'Autre',
      pays: country as "br" | "fr" | "autre",
      incoherence_detectee: true,
      period: 'Période inconnue',
      employee_name: 'Nom non détecté',
      company_name: 'Entreprise non détectée',
      position: 'Poste non détecté'
    };

    return {
      version: {
        type: analysisType,
        version: analysisType === 'enhanced' ? '2.0' : '1.0',
        timestamp: Date.now()
      },
      extraction: fallbackData,
      validation: {
        isValid: false,
        warnings: ['Erreur dans l\'analyse'],
        corrections: {},
        confidence: 0
      },
      finalData: fallbackData
    };
  }

  private createDefaultExplanationReport(data: PayslipAnalysisResult): ExplanationReport {
    return {
      summary: "Analyse en cours d'optimisation",
      fieldExplanations: [],
      monthSpecifics: "Période en cours d'analyse",
      calculationBases: {
        socialContributions: "En cours d'analyse",
        taxes: "En cours d'analyse",
        benefits: "En cours d'analyse",
        deductions: "En cours d'analyse"
      },
      salaryComposition: {
        totalEarnings: data.salario_bruto || 0,
        totalDeductions: data.descontos || 0,
        netPay: data.salario_liquido || 0,
        breakdown: []
      }
    };
  }

  private createDefaultRecommendationsReport(data: PayslipAnalysisResult): RecommendationsReport {
    return {
      profileAnalysis: "Analyse en cours d'optimisation",
      optimizationScore: 0,
      recommendations: [
        {
          category: 'financial_education',
          title: 'Système en cours d\'optimisation',
          description: 'Le système d\'analyse est en cours d\'optimisation',
          impact: 'low',
          priority: 1,
          actionable: false
        }
      ]
    };
  }

  private createDefaultLegacyRecommendations(): RecommendationResult {
    return {
      resume_situation: 'Analyse en cours d\'optimisation',
      recommendations: [
        {
          categorie: 'Optimisation',
          titre: 'Système en cours d\'optimisation',
          description: 'Le système d\'analyse est en cours d\'optimisation',
          impact: 'Baixo',
          priorite: 1
        }
      ],
      score_optimisation: 0
    };
  }
} 