/**
 * Composant principal SCAN NEW PIM
 * Interface moderne inspirée Apple/Deel pour le scan de feuilles de paie
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye, Trash2 } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';
import { ProgressBar } from './ProgressBar';
import { DocumentPreview } from './DocumentPreview';
import { ScanResults } from './ScanResults';
import { ErrorModal } from './ErrorModal';

export interface ScanNewPIMProps {
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
  className?: string;
  country?: string;
}

export default function ScanNewPIM({
  onComplete,
  onError,
  className = "",
  country = "br"
}: ScanNewPIMProps) {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    setResults(null);
    setError(null);
  }, []);

  const handleScan = useCallback(async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      setProgress(10);

      // Create FormData with country
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysisType', 'enhanced'); // Toujours enhanced
      formData.append('country', country);

      setProgress(20); // Upload terminé

      // Toujours utiliser l'endpoint enhanced
      const endpoint = '/api/scan-new-pim-enhanced';
      
      setProgress(30); // Scan OCR en cours
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      setProgress(50); // Validation en cours

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro durante o scan');
      }

      setProgress(70); // Analyse IA en cours
      
      // Simuler le temps de traitement pour une meilleure UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress(90); // Finalisation
      
      // Simuler la finalisation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(100); // Terminé
      setResults(result.data);
      onComplete?.(result.data);
      
      console.log('✅ Analyse terminée:', result.data);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro durante o scan';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('❌ Erreur:', error);
    } finally {
      // Garder la progression à 100% un moment avant de la remettre à 0
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 1000);
    }
  }, [file, country, onComplete, onError]);

  const handleReset = useCallback(() => {
    setFile(null);
    setResults(null);
    setError(null);
    setProgress(0);
  }, []);

  const handleError = useCallback((error: string) => {
    setError(error);
    onError?.(error);
  }, [onError]);

  if (error) {
    return (
      <div className={`scan-error ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro durante o scan</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <ScanResults
        results={results}
        onReset={handleReset}
        className={className}
      />
    );
  }

  return (
    <div className={`scan-new-pim ${className}`}>
      {!file ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FileUploadZone
            onFileUpload={handleFileUpload}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <DocumentPreview
            file={file}
            onRemove={handleReset}
            onScan={handleScan}
            loading={loading}
          />
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <ProgressBar progress={progress} />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
} 