/**
 * Composant FileUploadZone avec drag & drop moderne
 * Inspiré Apple/Deel pour une UX premium
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, File } from 'lucide-react';

export interface FileUploadZoneProps {
  onFileUpload: (file: File) => Promise<void>;
  className?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Vérification de la taille (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'Fichier trop volumineux (max 2MB)'
      };
    }

    // Vérification du type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format non supporté (JPG, PNG, PDF uniquement)'
      };
    }

    return { isValid: true };
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      await onFileUpload(file);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert(error as string);
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <motion.div
      className={`file-upload-zone ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Arraste sua folha de pagamento aqui
          </h3>
          <p className="text-gray-600 mb-4">
            ou clique para selecionar um arquivo
          </p>
          <p className="text-sm text-gray-500">
            Suporta JPG, PNG, PDF (máx. 2MB)
          </p>
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Indicateur de chargement */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-2xl"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-600">Upload en cours...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}; 