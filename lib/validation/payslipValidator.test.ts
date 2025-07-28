import { describe, it, expect } from 'vitest';
import { PayslipValidator, ValidationResult } from './payslipValidator';
import { PayslipAnalysisResult } from '../ia/prompts';

describe('PayslipValidator', () => {
  describe('validateAndCorrect', () => {
    it('should validate correct data without warnings', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: 5000,
        salario_liquido: 4000,
        descontos: 1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBe(100);
      expect(result.warnings).toHaveLength(0);
      expect(result.corrections).toEqual({});
    });

    it('should detect and correct Brut/Net inversion', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: 4000, // Inversé
        salario_liquido: 5000, // Inversé
        descontos: 1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBeGreaterThan(80);
      expect(result.warnings).toContain('Inversion Brut/Net détectée. Correction automatique appliquée.');
      expect(result.corrections.salario_bruto).toBe(5000);
      expect(result.corrections.salario_liquido).toBe(4000);
    });

    it('should detect mathematical inconsistency', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: 5000,
        salario_liquido: 4500,
        descontos: 200, // Incohérent (devrait être 500)
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Incohérence détectée: Net (4500) ≠ Brut (5000) - Déductions (200)');
      expect(result.corrections.descontos).toBe(500);
    });

    it('should correct negative values', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: -5000,
        salario_liquido: 4000,
        descontos: -1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.corrections.salario_bruto).toBe(5000);
      expect(result.corrections.descontos).toBe(1000);
      expect(result.warnings).toContain('Salaire brut négatif détecté. Correction automatique appliquée.');
      expect(result.warnings).toContain('Déductions négatives détectées. Correction automatique appliquée.');
    });

    it('should detect low salary values', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: 50, // Très faible
        salario_liquido: 40,
        descontos: 10,
        beneficios: 0,
        seguros: 0,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.warnings).toContain('Salaire brut très faible (50). Vérification recommandée.');
      expect(result.confidence).toBeLessThan(100);
    });

    it('should validate Brazil-specific rules for CLT', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: 5000,
        salario_liquido: 4500,
        descontos: 100, // Trop faible pour CLT (devrait être ~550)
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.warnings).toContain('Déductions INSS/IRRF insuffisantes pour un CLT. Vérification recommandée.');
      expect(result.confidence).toBeLessThan(100);
    });

    it('should validate France-specific rules', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: 3000,
        salario_liquido: 2400,
        descontos: 100, // Trop faible pour France (devrait être ~660)
        beneficios: 200,
        seguros: 100,
        statut: 'CLT',
        pays: 'fr',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.warnings).toContain('Charges sociales insuffisantes pour la France. Vérification recommandée.');
      expect(result.confidence).toBeLessThan(100);
    });

    it('should handle null values gracefully', () => {
      const data: PayslipAnalysisResult = {
        salario_bruto: null,
        salario_liquido: null,
        descontos: null,
        beneficios: null,
        seguros: null,
        statut: null,
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.validateAndCorrect(data);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBe(100);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('applyCorrections', () => {
    it('should apply corrections to original data', () => {
      const originalData: PayslipAnalysisResult = {
        salario_bruto: 4000,
        salario_liquido: 5000,
        descontos: 1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const corrections = {
        salario_bruto: 5000,
        salario_liquido: 4000
      };

      const result = PayslipValidator.applyCorrections(originalData, corrections);

      expect(result.salario_bruto).toBe(5000);
      expect(result.salario_liquido).toBe(4000);
      expect(result.incoherence_detectee).toBe(true);
    });

    it('should handle empty corrections', () => {
      const originalData: PayslipAnalysisResult = {
        salario_bruto: 5000,
        salario_liquido: 4000,
        descontos: 1000,
        beneficios: 500,
        seguros: 200,
        statut: 'CLT',
        pays: 'br',
        incoherence_detectee: false
      };

      const result = PayslipValidator.applyCorrections(originalData, {});

      expect(result).toEqual(originalData);
      expect(result.incoherence_detectee).toBe(false);
    });
  });
}); 