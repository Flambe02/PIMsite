// ATTENTION : Ce hook est côté client. N'utiliser que OCRLearningServiceClient (jamais OCRLearningService/server) ici !
// OCRLearningServiceClient utilise lib/supabase/client.ts et est sûr pour le client.
import { useState, useCallback } from 'react';
import { OCRLearningServiceClient } from '@/lib/learning/ocrLearningServiceClient';
import { PayslipAnalysisResult } from '@/lib/ia/prompts';
import { ValidationResult } from '@/lib/validation/payslipValidator';

export interface LearningData {
  user_id: string;
  country: string;
  statut: string;
  raw_ocr_text: string;
  extracted_data: PayslipAnalysisResult;
  validation_result?: ValidationResult;
  confidence_score?: number;
  validated?: boolean;
}

export function useLearningService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeLearningData = useCallback(async (data: LearningData): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const learningId = await OCRLearningServiceClient.storeLearningData(data);
      return learningId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur lors du stockage d\'apprentissage:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enhanceConfidenceWithLearning = useCallback(async (
    country: string,
    statut: string,
    currentConfidence: number
  ): Promise<number> => {
    try {
      return await OCRLearningServiceClient.enhanceConfidenceWithLearning(country, statut, currentConfidence);
    } catch (err) {
      console.error('❌ Erreur lors de l\'amélioration de confiance:', err);
      return currentConfidence; // Retourner la confiance originale en cas d'erreur
    }
  }, []);

  const generateLearningInsights = useCallback(async (
    country: string,
    statut: string
  ): Promise<string[]> => {
    try {
      return await OCRLearningServiceClient.generateLearningInsights(country, statut);
    } catch (err) {
      console.error('❌ Erreur lors de la génération d\'insights:', err);
      return ['Apprentissage temporairement indisponible'];
    }
  }, []);

  const getLearningStats = useCallback(async (): Promise<{ [country: string]: number }> => {
    try {
      return await OCRLearningServiceClient.getLearningStats();
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des stats:', err);
      return {};
    }
  }, []);

  return {
    storeLearningData,
    enhanceConfidenceWithLearning,
    generateLearningInsights,
    getLearningStats,
    isLoading,
    error
  };
} 