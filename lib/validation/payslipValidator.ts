import { PayslipAnalysisResult } from '../ia/prompts';

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  corrections: Partial<PayslipAnalysisResult>;
  confidence: number; // 0-100
}

export class PayslipValidator {
  private static readonly TOLERANCE = 0.05; // 5% de tolérance pour les calculs
  private static readonly MIN_SALARY = 100; // Salaire minimum en unité locale
  private static readonly MAX_SALARY = 1000000; // Salaire maximum raisonnable

  /**
   * Valide et corrige automatiquement les données extraites par l'IA
   */
  static validateAndCorrect(data: PayslipAnalysisResult): ValidationResult {
    const warnings: string[] = [];
    const corrections: Partial<PayslipAnalysisResult> = {};
    let confidence = 100;

    // 1. Validation des valeurs de base
    confidence = this.validateBasicValues(data, warnings, corrections, confidence);

    // 2. Validation de la cohérence mathématique
    confidence = this.validateMathematicalConsistency(data, warnings, corrections, confidence);

    // 3. Correction automatique des erreurs courantes
    confidence = this.applyAutomaticCorrections(data, warnings, corrections, confidence);

    // 4. Validation spécifique par pays
    confidence = this.validateCountrySpecific(data, warnings, corrections, confidence);

    return {
      isValid: confidence > 70,
      warnings,
      corrections,
      confidence
    };
  }

  /**
   * Valide les valeurs de base (plages raisonnables, types, etc.)
   */
  private static validateBasicValues(
    data: PayslipAnalysisResult,
    warnings: string[],
    corrections: Partial<PayslipAnalysisResult>,
    confidence: number
  ): number {
    // Validation du salaire brut
    if (data.salario_bruto !== null) {
      if (data.salario_bruto < this.MIN_SALARY) {
        warnings.push(`Salaire brut très faible (${data.salario_bruto}). Vérification recommandée.`);
        confidence -= 10;
      }
      if (data.salario_bruto > this.MAX_SALARY) {
        warnings.push(`Salaire brut très élevé (${data.salario_bruto}). Vérification recommandée.`);
        confidence -= 10;
      }
    }

    // Validation du salaire liquide
    if (data.salario_liquido !== null) {
      if (data.salario_liquido < this.MIN_SALARY) {
        warnings.push(`Salaire liquide très faible (${data.salario_liquido}). Vérification recommandée.`);
        confidence -= 10;
      }
      if (data.salario_liquido > this.MAX_SALARY) {
        warnings.push(`Salaire liquide très élevé (${data.salario_liquido}). Vérification recommandée.`);
        confidence -= 10;
      }
    }

    // Validation des déductions
    if (data.descontos !== null && data.descontos < 0) {
      warnings.push("Déductions négatives détectées. Correction automatique appliquée.");
      corrections.descontos = Math.abs(data.descontos);
      confidence -= 5;
    }

    return confidence;
  }

  /**
   * Valide la cohérence mathématique (Net ≈ Brut - Déductions)
   */
  private static validateMathematicalConsistency(
    data: PayslipAnalysisResult,
    warnings: string[],
    corrections: Partial<PayslipAnalysisResult>,
    confidence: number
  ): number {
    if (data.salario_bruto !== null && data.salario_liquido !== null && data.descontos !== null) {
      const expectedNet = data.salario_bruto - data.descontos;
      const difference = Math.abs(data.salario_liquido - expectedNet);
      const percentageDiff = difference / data.salario_bruto;

      if (percentageDiff > this.TOLERANCE) {
        warnings.push(`Incohérence détectée: Net (${data.salario_liquido}) ≠ Brut (${data.salario_bruto}) - Déductions (${data.descontos})`);
        confidence -= 20;

        // Tentative de correction automatique
        if (data.salario_liquido > data.salario_bruto) {
          // Probable inversion Brut/Net
          warnings.push("Inversion Brut/Net détectée. Correction automatique appliquée.");
          corrections.salario_bruto = data.salario_liquido;
          corrections.salario_liquido = data.salario_bruto;
          confidence += 10; // Amélioration de la confiance après correction
        } else if (Math.abs(data.salario_liquido - expectedNet) < data.salario_bruto * 0.1) {
          // Petite différence, correction des déductions
          warnings.push("Ajustement automatique des déductions pour assurer la cohérence.");
          corrections.descontos = data.salario_bruto - data.salario_liquido;
          confidence += 5;
        }
      }
    }

    return confidence;
  }

  /**
   * Applique les corrections automatiques des erreurs courantes
   */
  private static applyAutomaticCorrections(
    data: PayslipAnalysisResult,
    warnings: string[],
    corrections: Partial<PayslipAnalysisResult>,
    confidence: number
  ): number {
    // Correction des erreurs de ponctuation (virgule vs point)
    if (data.salario_bruto !== null && data.salario_bruto < 1000) {
      const corrected = data.salario_bruto * 1000;
      if (corrected > this.MIN_SALARY && corrected < this.MAX_SALARY) {
        warnings.push("Correction automatique: multiplication par 1000 (erreur de ponctuation probable).");
        corrections.salario_bruto = corrected;
        confidence += 5;
      }
    }

    // Correction des valeurs négatives
    if (data.salario_bruto !== null && data.salario_bruto < 0) {
      warnings.push("Salaire brut négatif détecté. Correction automatique appliquée.");
      corrections.salario_bruto = Math.abs(data.salario_bruto);
      confidence -= 5;
    }

    if (data.salario_liquido !== null && data.salario_liquido < 0) {
      warnings.push("Salaire liquide négatif détecté. Correction automatique appliquée.");
      corrections.salario_liquido = Math.abs(data.salario_liquido);
      confidence -= 5;
    }

    return confidence;
  }

  /**
   * Validation spécifique par pays
   */
  private static validateCountrySpecific(
    data: PayslipAnalysisResult,
    warnings: string[],
    corrections: Partial<PayslipAnalysisResult>,
    confidence: number
  ): number {
    if (data.pays === 'br') {
      // Validation spécifique Brésil
      if (data.statut === 'CLT' && data.descontos !== null) {
        // Vérification des déductions obligatoires CLT
        const inssRate = 0.11; // 11% INSS approximatif
        const expectedInss = (data.salario_bruto || 0) * inssRate;
        
        if (data.descontos < expectedInss * 0.5) {
          warnings.push("Déductions INSS/IRRF insuffisantes pour un CLT. Vérification recommandée.");
          confidence -= 10;
        }
      }
    } else if (data.pays === 'fr') {
      // Validation spécifique France
      if (data.descontos !== null && data.salario_bruto !== null) {
        const socialRate = 0.22; // 22% charges sociales approximatif
        const expectedCharges = data.salario_bruto * socialRate;
        
        if (data.descontos < expectedCharges * 0.5) {
          warnings.push("Charges sociales insuffisantes pour la France. Vérification recommandée.");
          confidence -= 10;
        }
      }
    }

    return confidence;
  }

  /**
   * Applique les corrections à l'objet de données original
   */
  static applyCorrections(data: PayslipAnalysisResult, corrections: Partial<PayslipAnalysisResult>): PayslipAnalysisResult {
    return {
      ...data,
      ...corrections,
      incoherence_detectee: Object.keys(corrections).length > 0
    };
  }
} 