/**
 * Composant principal SCAN NEW PIM
 * Interface moderne inspirée Apple/Deel pour le scan de feuilles de paie
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye, Trash2 } from 'lucide-react';
import { useScanNewPIM } from '@/hooks/useScanNewPIM';
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

export const ScanNewPIM: React.FC<ScanNewPIMProps> = ({
  onComplete,
  onError,
  className = '',
  country = 'br'
}) => {
  const {
    file,
    uploadFile,
    scanDocument,
    results,
    loading,
    error,
    progress,
    resetScan
  } = useScanNewPIM();

  const [showPreview, setShowPreview] = useState(false);

  // Configuration par pays
  const getCountryInfo = (countryCode: string) => {
    const countries = {
      'br': { 
        name: 'Brasil', 
        flag: '🇧🇷', 
        language: 'Português',
        title: 'SCAN NEW PIM',
        subtitle: 'Análise inteligente de folhas de pagamento'
      },
      'fr': { 
        name: 'France', 
        flag: '🇫🇷', 
        language: 'Français',
        title: 'SCAN NEW PIM',
        subtitle: 'Analyse intelligente de fiches de paie'
      },
      'pt': { 
        name: 'Portugal', 
        flag: '🇵🇹', 
        language: 'Português',
        title: 'SCAN NEW PIM',
        subtitle: 'Análise inteligente de folhas de pagamento'
      }
    };
    return countries[countryCode as keyof typeof countries] || countries.br;
  };

  const countryInfo = getCountryInfo(country);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      await uploadFile(file);
      setShowPreview(true);
    } catch (error) {
      onError?.(error as string);
    }
  }, [uploadFile, onError]);

  const handleScan = useCallback(async () => {
    if (!file) return;
    
    try {
      const scanResults = await scanDocument(file);
      onComplete?.(scanResults);
    } catch (error) {
      onError?.(error as string);
    }
  }, [file, scanDocument, onComplete, onError]);

  const handleReset = useCallback(() => {
    resetScan();
    setShowPreview(false);
  }, [resetScan]);

  return (
    <div className={`scan-new-pim ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-3xl">{countryInfo.flag}</span>
          <h1 className="text-3xl font-bold text-gray-900">
            {countryInfo.title}
          </h1>
        </div>
        <p className="text-gray-600 text-center">
          {countryInfo.subtitle} • {countryInfo.name}
        </p>
      </motion.div>

      {/* Zone d'upload */}
      <AnimatePresence mode="wait">
        {!file && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <FileUploadZone onFileUpload={handleFileUpload} />
          </motion.div>
        )}

        {/* Preview du document */}
        {file && showPreview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <DocumentPreview
              file={file}
              onRemove={handleReset}
              onScan={handleScan}
              loading={loading}
            />
          </motion.div>
        )}

        {/* Barre de progression */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <ProgressBar progress={progress} />
          </motion.div>
        )}

        {/* Résultats du scan */}
        {results && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ScanResults
              results={results}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'erreur */}
      <ErrorModal
        error={error}
        onClose={() => onError?.('')}
      />

      {/* Indicateurs de statut */}
      <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-500">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
          <span>Google Vision OCR</span>
        </motion.div>
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
          <span>IA Análise</span>
        </motion.div>
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
          <span>Seguro</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanNewPIM; 