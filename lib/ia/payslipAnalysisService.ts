import OpenAI from 'openai';
import { PayslipAnalysisResult, RecommendationResult, getPromptForCountry } from './prompts';
import { PayslipValidator, ValidationResult } from '../validation/payslipValidator';

export interface AnalysisResult {
  extraction: PayslipAnalysisResult;
  validation: ValidationResult;
  recommendations: RecommendationResult;
  finalData: PayslipAnalysisResult;
}

export class PayslipAnalysisService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Analyse complète d'un holerite avec validation et recommandations
   */
  async analyzePayslip(
    ocrText: string,
    country: string = 'br',
    userId?: string
  ): Promise<AnalysisResult> {
    try {
      console.log('🤖 Début de l\'analyse IA optimisée...');

      // 1. Extraction des données avec prompt optimisé
      let extractionResult: PayslipAnalysisResult;
      try {
        extractionResult = await this.extractData(ocrText, country);
        console.log('✅ Extraction terminée:', extractionResult);
      } catch (extractionError) {
        console.error('❌ Erreur extraction:', extractionError);
        // Données par défaut en cas d'échec
        extractionResult = {
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
      }

      // 2. Validation et correction intelligente
      let validationResult: ValidationResult;
      try {
        validationResult = PayslipValidator.validateAndCorrect(extractionResult);
        console.log('✅ Validation terminée:', validationResult);
      } catch (validationError) {
        console.error('❌ Erreur validation:', validationError);
        // Validation par défaut
        validationResult = {
          isValid: false,
          warnings: ['Erreur de validation'],
          corrections: {},
          confidence: 0
        };
      }

      // 3. Application des corrections
      let correctedData: PayslipAnalysisResult;
      try {
        correctedData = PayslipValidator.applyCorrections(extractionResult, validationResult.corrections);
        console.log('✅ Données corrigées:', correctedData);
      } catch (correctionError) {
        console.error('❌ Erreur correction:', correctionError);
        correctedData = extractionResult;
      }

      // 4. Génération des recommandations
      let recommendations: RecommendationResult;
      try {
        recommendations = await this.generateRecommendations(correctedData, country);
        console.log('✅ Recommandations générées');
      } catch (recommendationError) {
        console.error('❌ Erreur recommandations:', recommendationError);
        // Recommandations par défaut
        recommendations = {
          resume_situation: 'Analyse en cours d\'optimisation',
          recommendations: [
            {
              categorie: 'Optimisation',
              titre: 'Document en cours d\'analyse',
              description: 'Le système d\'analyse est en cours d\'optimisation',
              impact: 'Baixo',
              priorite: 1
            }
          ],
          score_optimisation: 0
        };
      }

      return {
        extraction: extractionResult,
        validation: validationResult,
        recommendations,
        finalData: correctedData
      };

    } catch (error) {
      console.error('❌ Erreur critique dans l\'analyse IA:', error);
      // Retourner un résultat par défaut plutôt que de faire échouer tout le processus
      return {
        extraction: {
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
        },
        validation: {
          isValid: false,
          warnings: ['Erreur critique dans l\'analyse'],
          corrections: {},
          confidence: 0
        },
        recommendations: {
          resume_situation: 'Erreur dans l\'analyse',
          recommendations: [
            {
              categorie: 'Optimisation',
              titre: 'Problème technique',
              description: 'Une erreur est survenue lors de l\'analyse',
              impact: 'Baixo',
              priorite: 1
            }
          ],
          score_optimisation: 0
        },
        finalData: {
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
        }
      };
    }
  }

  /**
   * Extraction des données avec prompt optimisé
   */
  private async extractData(ocrText: string, country: string): Promise<PayslipAnalysisResult> {
    const prompt = getPromptForCountry(country, 'extraction');
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Voici le texte OCR extrait du holerite:\n\n${ocrText}` }
      ],
      temperature: 0.1, // Faible température pour plus de cohérence
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse IA vide");
    }

    try {
      const result = JSON.parse(content) as PayslipAnalysisResult;
      
      // Validation de base du JSON
      if (!this.isValidExtractionResult(result)) {
        throw new Error("Format JSON invalide dans la réponse IA");
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur parsing JSON:', error);
      throw new Error("Impossible de parser la réponse IA");
    }
  }

  /**
   * Génération des recommandations basées sur les données validées
   */
  private async generateRecommendations(
    data: PayslipAnalysisResult,
    country: string
  ): Promise<RecommendationResult> {
    const prompt = getPromptForCountry(country, 'recommendations');
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Voici les données validées du holerite:\n\n${JSON.stringify(data, null, 2)}` }
      ],
      temperature: 0.3, // Température modérée pour la créativité
      max_tokens: 3000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse IA vide pour les recommandations");
    }

    try {
      const result = JSON.parse(content) as RecommendationResult;
      
      // Validation de base du JSON
      if (!this.isValidRecommendationResult(result)) {
        throw new Error("Format JSON invalide dans les recommandations");
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur parsing JSON recommandations:', error);
      throw new Error("Impossible de parser les recommandations IA");
    }
  }

  /**
   * Validation du format de la réponse d'extraction
   */
  private isValidExtractionResult(data: any): data is PayslipAnalysisResult {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.incoherence_detectee === 'boolean' &&
      typeof data.pays === 'string' &&
      ['br', 'fr', 'autre'].includes(data.pays)
    );
  }

  /**
   * Validation du format de la réponse de recommandations
   */
  private isValidRecommendationResult(data: any): data is RecommendationResult {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.resume_situation === 'string' &&
      typeof data.score_optimisation === 'number' &&
      (
        // Soit il y a des recommandations
        (Array.isArray(data.recommendations) && data.recommendations.length > 0) ||
        // Soit il y a un message no_recommendation
        (typeof data.no_recommendation === 'string' && data.no_recommendation.length > 0)
      )
    );
  }

  /**
   * Analyse rapide pour détecter le pays du document
   */
  async detectCountry(ocrText: string): Promise<string> {
    const prompt = `Analyse ce texte OCR et détermine le pays d'origine du document de paie.
    Retourne uniquement le code pays: "br" pour Brésil, "fr" pour France, "autre" pour autres pays.
    
    Texte OCR:
    ${ocrText}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt }
      ],
      temperature: 0,
      max_tokens: 10
    });

    const content = response.choices[0].message.content?.trim().toLowerCase();
    
    if (content === 'br' || content === 'fr') {
      return content;
    }
    
    return 'br'; // Par défaut Brésil
  }
} 