/**
 * Composant DocumentPreview pour afficher le fichier uploadé
 * Avec options de suppression et lancement du scan
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, X, Play, Eye, Trash2, RefreshCw } from 'lucide-react';

export interface DocumentPreviewProps {
  file: File;
  onRemove: () => void;
  onScan: () => void;
  loading?: boolean;
  className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  onRemove,
  onScan,
  loading = false,
  className = ''
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handlePreview = () => {
    if (!previewUrl) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    setShowPreview(!showPreview);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (file.type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className={`document-preview ${className}`}>
      {/* Carte principale */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Prévia do documento
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreview}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Visualizar documento"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Remover documento"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nome:</span>
            <span className="font-medium">{file.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tamanho:</span>
            <span className="font-medium">{formatFileSize(file.size)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tipo:</span>
            <span className="font-medium">{file.type || 'Desconhecido'}</span>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScan}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Analisando documento...
                </motion.span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" />
                Analisar documento
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Modal d'aperçu */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Prévia do documento</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {file.type.includes('image') ? (
              <img
                src={previewUrl}
                alt="Aperçu"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aperçu PDF non disponible
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}; 