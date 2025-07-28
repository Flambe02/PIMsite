// ATTENTION : Ce service est réservé au serveur (API routes, Server Components, scripts Node). Ne jamais l'importer dans un composant client !
// Utilise lib/supabase/server.ts et next/headers.
import { createClient } from '@/lib/supabase/server';
import { PayslipAnalysisResult, RecommendationResult } from '../ia/prompts';
import { ValidationResult } from '../validation/payslipValidator';

export interface OCRLearningData {
  id?: string;
  user_id: string;
  country: string;
  statut: string;
  raw_ocr_text: string;
  extracted_data: PayslipAnalysisResult;
  validation_result?: ValidationResult;
  confidence_score?: number;
  validated?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SimilarLearningResult {
  count: number;
  average_confidence: number;
  common_patterns: string[];
  validation_warnings: string[];
}

export class OCRLearningService {
  /**
   * Stocke les données d'apprentissage OCR dans Supabase
   */
  static async storeLearningData(data: OCRLearningData): Promise<string> {
    const supabase = await createClient();
    
    // Générer un UUID manuellement si nécessaire
    const learningId = crypto.randomUUID();
    
    const { data: learningRecord, error } = await supabase
      .from('ocr_learnings')
      .insert({
        id: learningId,
        user_id: data.user_id,
        country: data.country,
        statut: data.statut,
        raw_ocr_text: data.raw_ocr_text,
        extracted_data: data.extracted_data,
        validation_result: data.validation_result,
        confidence_score: data.confidence_score,
        validated: data.validated || false
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Erreur lors du stockage des données d\'apprentissage:', error);
      // Retourner l'ID généré même en cas d'erreur pour éviter de bloquer le processus
      console.log('⚠️ Utilisation de l\'ID généré malgré l\'erreur:', learningId);
      return learningId;
    }

    console.log('✅ Données d\'apprentissage stockées avec succès:', learningRecord.id);
    return learningRecord.id;
  }

  /**
   * Trouve des données d'apprentissage similaires pour améliorer la confiance
   */
  static async findSimilarLearningData(
    country: string,
    statut: string,
    limit: number = 10
  ): Promise<SimilarLearningResult> {
    const supabase = await createClient();
    
    const { data: similarData, error } = await supabase
      .from('ocr_learnings')
      .select('*')
      .eq('country', country)
      .eq('statut', statut)
      .eq('validated', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Erreur lors de la recherche de données similaires:', error);
      return {
        count: 0,
        average_confidence: 0,
        common_patterns: [],
        validation_warnings: []
      };
    }

    if (!similarData || similarData.length === 0) {
      return {
        count: 0,
        average_confidence: 0,
        common_patterns: [],
        validation_warnings: []
      };
    }

    // Calcul des métriques
    const totalConfidence = similarData.reduce((sum, record) => 
      sum + (record.confidence_score || 0), 0);
    const averageConfidence = totalConfidence / similarData.length;

    // Extraction des patterns communs
    const commonPatterns = this.extractCommonPatterns(similarData);
    
    // Extraction des warnings de validation
    const validationWarnings = this.extractValidationWarnings(similarData);

    return {
      count: similarData.length,
      average_confidence: Math.round(averageConfidence),
      common_patterns: commonPatterns,
      validation_warnings: validationWarnings
    };
  }

  /**
   * Extrait les patterns communs des données d'apprentissage
   */
  private static extractCommonPatterns(learningData: any[]): string[] {
    const patterns: { [key: string]: number } = {};
    
    learningData.forEach(record => {
      const extractedData = record.extracted_data;
      
      // Patterns de salaires
      if (extractedData.salario_bruto) {
        const salaryRange = this.getSalaryRange(extractedData.salario_bruto);
        patterns[`salary_range_${salaryRange}`] = (patterns[`salary_range_${salaryRange}`] || 0) + 1;
      }
      
      // Patterns de déductions
      if (extractedData.descontos && extractedData.salario_bruto) {
        const deductionRate = Math.round((extractedData.descontos / extractedData.salario_bruto) * 100);
        patterns[`deduction_rate_${deductionRate}%`] = (patterns[`deduction_rate_${deductionRate}%`] || 0) + 1;
      }
      
      // Patterns de bénéfices
      if (extractedData.beneficios) {
        patterns['has_benefits'] = (patterns['has_benefits'] || 0) + 1;
      }
      
      // Patterns d'assurances
      if (extractedData.seguros) {
        patterns['has_insurance'] = (patterns['has_insurance'] || 0) + 1;
      }
    });

    // Retourne les patterns les plus fréquents
    return Object.entries(patterns)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([pattern, _]) => pattern);
  }

  /**
   * Extrait les warnings de validation communs
   */
  private static extractValidationWarnings(learningData: any[]): string[] {
    const warnings: { [key: string]: number } = {};
    
    learningData.forEach(record => {
      if (record.validation_result?.warnings) {
        record.validation_result.warnings.forEach((warning: string) => {
          warnings[warning] = (warnings[warning] || 0) + 1;
        });
      }
    });

    return Object.entries(warnings)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([warning, _]) => warning);
  }

  /**
   * Détermine la fourchette de salaire
   */
  private static getSalaryRange(salary: number): string {
    if (salary < 2000) return 'low';
    if (salary < 5000) return 'medium';
    if (salary < 10000) return 'high';
    return 'very_high';
  }

  /**
   * Améliore la confiance basée sur les données d'apprentissage
   */
  static async enhanceConfidenceWithLearning(
    country: string,
    statut: string,
    currentConfidence: number
  ): Promise<number> {
    const similarData = await this.findSimilarLearningData(country, statut, 5);
    
    if (similarData.count === 0) {
      return currentConfidence;
    }

    // Amélioration basée sur la confiance moyenne des données similaires
    const confidenceBoost = Math.min(
      (similarData.average_confidence - currentConfidence) * 0.1,
      10
    );

    return Math.min(currentConfidence + confidenceBoost, 100);
  }

  /**
   * Génère des insights d'apprentissage pour l'utilisateur
   */
  static async generateLearningInsights(
    country: string,
    statut: string
  ): Promise<string[]> {
    const similarData = await this.findSimilarLearningData(country, statut, 20);
    
    const insights: string[] = [];
    
    if (similarData.count > 0) {
      insights.push(`Basé sur ${similarData.count} analyses similaires (${statut} en ${country})`);
      
      if (similarData.average_confidence > 80) {
        insights.push('Confiance élevée pour ce type de document');
      } else if (similarData.average_confidence < 60) {
        insights.push('Attention: Documents similaires ont souvent des incohérences');
      }
      
      if (similarData.common_patterns.length > 0) {
        insights.push(`Patterns détectés: ${similarData.common_patterns.join(', ')}`);
      }
      
      if (similarData.validation_warnings.length > 0) {
        insights.push(`Warnings fréquents: ${similarData.validation_warnings.join(', ')}`);
      }
    } else {
      insights.push('Première analyse de ce type - données d\'apprentissage en cours de collecte');
    }
    
    return insights;
  }

  /**
   * Récupère les statistiques d'apprentissage par pays
   */
  static async getLearningStats(): Promise<{ [country: string]: number }> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('ocr_learnings')
      .select('country')
      .eq('validated', true);

    if (error) {
      console.error('❌ Erreur lors de la récupération des stats:', error);
      return {};
    }

    const stats: { [country: string]: number } = {};
    data?.forEach(record => {
      stats[record.country] = (stats[record.country] || 0) + 1;
    });

    return stats;
  }
} 