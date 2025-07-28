/**
 * Hook principal pour le module SCAN NEW PIM
 * Gestion de l'état et de la logique de scan
 */

import { useState, useCallback } from 'react';
import { googleVisionService, ScanResult } from '@/lib/services/googleVisionService';
import { scanAnalysisService, AnalysisResult } from '@/lib/services/scanAnalysisService';

export interface ScanResults {
  ocr: ScanResult;
  analysis: AnalysisResult;
  timestamp: number;
}

export interface UseScanNewPIMReturn {
  file: File | null;
  results: ScanResults | null;
  loading: boolean;
  error: string | null;
  progress: number;
  uploadFile: (file: File) => Promise<void>;
  scanDocument: (file: File) => Promise<ScanResults>;
  resetScan: () => void;
}

export const useScanNewPIM = (): UseScanNewPIMReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setError(null);
      setFile(file);
      setProgress(10);
    } catch (error) {
      setError(error as string);
      throw error;
    }
  }, []);

  const scanDocument = useCallback(async (file: File): Promise<ScanResults> => {
    setLoading(true);
    setError(null);
    setProgress(10); // Début - Upload terminé

    try {
      // Étape 1: Upload et préparation
      console.log('🚀 Début scan via API route...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause pour montrer l'avancement
      setProgress(20);
      
      const formData = new FormData();
      formData.append('file', file);

      // Étape 2: Envoi au serveur
      console.log('📤 Envoi au serveur...');
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(30);
      
      const response = await fetch('/api/scan-new-pim', {
        method: 'POST',
        body: formData
      });

      // Étape 3: Traitement OCR (Scan OCR)
      console.log('🔍 Début OCR...');
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulation OCR
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulation OCR continue
      setProgress(60);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du scan');
      }

      // Étape 4: Validation
      console.log('✅ Validation du document...');
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Étape 5: Analyse IA
      console.log('🤖 Début analyse IA...');
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation analyse IA
      setProgress(85);
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Échec du scan');
      }

      // Étape 6: Finalisation
      console.log('🎯 Finalisation...');
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Convertir la réponse de l'API en format ScanResults
      const scanResults: ScanResults = {
        ocr: {
          success: true,
          text: result.data.ocr.text,
          confidence: result.data.ocr.confidence,
          processingTime: result.data.ocr.processingTime
        },
        analysis: {
          success: true,
          structuredData: result.data.analysis.structuredData,
          recommendations: result.data.analysis.recommendations,
          confidence: result.data.analysis.confidence
        },
        timestamp: result.data.timestamp
      };

      setResults(scanResults);
      setLoading(false);
      setProgress(100); // Terminé

      console.log('✅ Scan terminé avec succès');
      return scanResults;

    } catch (error) {
      console.error('❌ Erreur scan:', error);
      setError(error as string);
      setLoading(false);
      setProgress(0);
      throw error;
    }
  }, []);

  const resetScan = useCallback(() => {
    setFile(null);
    setResults(null);
    setError(null);
    setProgress(0);
    setLoading(false);
  }, []);

  return {
    file,
    results,
    loading,
    error,
    progress,
    uploadFile,
    scanDocument,
    resetScan
  };
}; 