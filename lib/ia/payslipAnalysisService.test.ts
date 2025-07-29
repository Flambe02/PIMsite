import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PayslipAnalysisService } from './payslipAnalysisService';
import { PayslipAnalysisResult, RecommendationResult } from './prompts';

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }))
}));

describe('PayslipAnalysisService', () => {
  let service: PayslipAnalysisService;
  let mockOpenAI: any;

  beforeEach(async () => {
    service = new PayslipAnalysisService();
    const openaiModule = await import('openai');
    mockOpenAI = openaiModule.default;
  });

  describe('detectCountry', () => {
    it('should detect Brazil from Portuguese text', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'br' } }]
      };
      
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue(mockResponse)
          }
        }
      }));

      const result = await service.detectCountry('Salário Bruto: R$ 5.000,00');
      expect(result).toBe('br');
    });

    it('should detect France from French text', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'fr' } }]
      };
      
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue(mockResponse)
          }
        }
      }));

      const result = await service.detectCountry('Salaire Brut: 3000€');
      expect(result).toBe('fr');
    });

    it('should default to Brazil for unknown text', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'unknown' } }]
      };
      
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue(mockResponse)
          }
        }
      }));

      const result = await service.detectCountry('Random text');
      expect(result).toBe('br');
    });
  });

  describe('analyzePayslip', () => {
    it('should perform complete analysis with validation and recommendations', async () => {
      const mockExtractionResponse = {
        choices: [{ 
          message: { 
            content: JSON.stringify({
              salario_bruto: 5000,
              salario_liquido: 4000,
              descontos: 1000,
              beneficios: 500,
              seguros: 200,
              statut: 'CLT',
              pays: 'br',
              incoherence_detectee: false
            })
          } 
        }]
      };

      const mockRecommendationResponse = {
        choices: [{ 
          message: { 
            content: JSON.stringify({
              resume_situation: 'CLT avec salaire de R$ 5.000',
              recommendations: [
                {
                  categorie: 'Optimisation',
                  titre: 'Déductions IRRF',
                  description: 'Vous pouvez économiser R$ 180/mês',
                  impact: 'Alto',
                  priorite: 1
                }
              ],
              score_optimisation: 85
            })
          } 
        }]
      };

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn()
              .mockResolvedValueOnce(mockExtractionResponse)
              .mockResolvedValueOnce(mockRecommendationResponse)
          }
        }
      }));

      const result = await service.analyzePayslip('Test OCR text', 'br', 'user123');

      expect(result.extraction).toBeDefined();
      expect(result.validation).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.finalData).toBeDefined();
      expect(result.validation.isValid).toBe(true);
      expect(result.validation.confidence).toBeGreaterThan(70);
    });

    it('should handle extraction errors gracefully', async () => {
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(new Error('OpenAI API error'))
          }
        }
      }));

      await expect(service.analyzePayslip('Test text', 'br', 'user123'))
        .rejects.toThrow('OpenAI API error');
    });

    it('should handle invalid JSON responses', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'invalid json' } }]
      };

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue(mockResponse)
          }
        }
      }));

      await expect(service.analyzePayslip('Test text', 'br', 'user123'))
        .rejects.toThrow('Impossible de parser la réponse IA');
    });
  });

  describe('validation methods', () => {
    it('should validate extraction result format', () => {
      const validData = {
        incoherence_detectee: false,
        pays: 'br'
      };

      const invalidData = {
        incoherence_detectee: 'not boolean',
        pays: 'invalid'
      };

      // Test with private method through reflection
      const serviceAny = service as any;
      expect(serviceAny.isValidExtractionResult(validData)).toBe(true);
      expect(serviceAny.isValidExtractionResult(invalidData)).toBe(false);
    });

    it('should validate recommendation result format', () => {
      const validData = {
        resume_situation: 'Test situation',
        recommendations: [],
        score_optimisation: 85
      };

      const invalidData = {
        resume_situation: 123, // Should be string
        recommendations: 'not array',
        score_optimisation: 'not number'
      };

      // Test with private method through reflection
      const serviceAny = service as any;
      expect(serviceAny.isValidRecommendationResult(validData)).toBe(true);
      expect(serviceAny.isValidRecommendationResult(invalidData)).toBe(false);
    });
  });
}); 